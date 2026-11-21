/**
 * UNIT REVIEW ARCADE — ZERO-DEPENDENCY SPREADSHEET ENGINE (PHASE 3)
 * Version: 3.0.0
 * 
 * Provides pure TypeScript/JavaScript parsing and generation for:
 * 1. RFC-4180 compliant CSV (with UTF-8 BOM, auto-delimiter detection, multiline & escaped quotes)
 * 2. Microsoft Excel .xlsx files (ZIP decompression, workbook XML, sharedStrings, cell coordinate parsing)
 * 3. Excel .xlsx generation (standard ZIP Store/Deflate structure recognized natively by Excel/Sheets)
 * 
 * 100% self-contained: No external npm packages, zero network calls, runs seamlessly in Browser and Node.
 */

// ============================================================================
// 1. CRC-32 IMPLEMENTATION (Standard IEEE 802.3 polynomial)
// ============================================================================
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[i] = c >>> 0;
}

export function calculateCrc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// ============================================================================
// 2. ZIP CONTAINER BUILDER & EXTRACTOR
// ============================================================================
export interface ZipFileEntry {
  name: string;
  data: Uint8Array;
}

/**
 * Builds a valid ZIP container from an array of file entries.
 * Uses Deflate compression via CompressionStream if available and beneficial,
 * otherwise falls back cleanly to Store method 0 (fully compliant with Excel).
 */
export async function buildZipFile(files: ZipFileEntry[]): Promise<Uint8Array> {
  interface ProcessedEntry {
    name: string;
    nameBytes: Uint8Array;
    compressedData: Uint8Array;
    localHeader: Uint8Array;
    compMethod: number;
    crc: number;
    compressedSize: number;
    uncompressedSize: number;
    offset: number;
  }

  const processed: ProcessedEntry[] = [];
  let currentOffset = 0;
  const encoder = new TextEncoder();

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = file.data;
    const uncompressedSize = dataBytes.length;
    const fileCrc = calculateCrc32(dataBytes);

    let compressedData = dataBytes;
    let compMethod = 0; // Store

    // Attempt deflate-raw compression if Web API is available
    if (typeof CompressionStream !== 'undefined' && uncompressedSize > 120) {
      try {
        const cs = new CompressionStream('deflate-raw');
        const writer = cs.writable.getWriter();
        writer.write(dataBytes as unknown as BufferSource);
        writer.close();
        const reader = cs.readable.getReader();
        const chunks: Uint8Array[] = [];
        let total = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            total += value.length;
          }
        }
        if (total < uncompressedSize) {
          const deflated = new Uint8Array(total);
          let p = 0;
          for (const c of chunks) {
            deflated.set(c, p);
            p += c.length;
          }
          compressedData = deflated;
          compMethod = 8; // Deflated
        }
      } catch {
        // Fallback to Store method 0
        compressedData = dataBytes;
        compMethod = 0;
      }
    }

    const compressedSize = compressedData.length;

    // Local Header (30 bytes + name length)
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(localHeader.buffer);
    view.setUint32(0, 0x04034b50, true); // Signature
    view.setUint16(4, 20, true);         // Version needed (2.0)
    view.setUint16(6, 0, true);          // Flags
    view.setUint16(8, compMethod, true); // Method
    view.setUint16(10, 0, true);         // Mod time
    view.setUint16(12, 0, true);         // Mod date
    view.setUint32(14, fileCrc, true);   // CRC-32
    view.setUint32(18, compressedSize, true);
    view.setUint32(22, uncompressedSize, true);
    view.setUint16(26, nameBytes.length, true);
    view.setUint16(28, 0, true);         // Extra field length
    localHeader.set(nameBytes, 30);

    processed.push({
      name: file.name,
      nameBytes,
      compressedData,
      localHeader,
      compMethod,
      crc: fileCrc,
      compressedSize,
      uncompressedSize,
      offset: currentOffset,
    });

    currentOffset += localHeader.length + compressedSize;
  }

  // Build Central Directory
  const cdHeaders: Uint8Array[] = [];
  let cdSize = 0;

  for (const entry of processed) {
    const cdHeader = new Uint8Array(46 + entry.nameBytes.length);
    const view = new DataView(cdHeader.buffer);
    view.setUint32(0, 0x02014b50, true); // Central directory signature
    view.setUint16(4, 20, true);         // Version made by
    view.setUint16(6, 20, true);         // Version needed
    view.setUint16(8, 0, true);          // Flags
    view.setUint16(10, entry.compMethod, true);
    view.setUint16(12, 0, true);         // Mod time
    view.setUint16(14, 0, true);         // Mod date
    view.setUint32(16, entry.crc, true); // CRC-32
    view.setUint32(20, entry.compressedSize, true);
    view.setUint32(24, entry.uncompressedSize, true);
    view.setUint16(28, entry.nameBytes.length, true);
    view.setUint16(30, 0, true);         // Extra length
    view.setUint16(32, 0, true);         // Comment length
    view.setUint16(34, 0, true);         // Disk start
    view.setUint16(36, 0, true);         // Internal attrs
    view.setUint32(38, 0, true);         // External attrs
    view.setUint32(42, entry.offset, true); // Relative offset of local header
    cdHeader.set(entry.nameBytes, 46);

    cdHeaders.push(cdHeader);
    cdSize += cdHeader.length;
  }

  // End of Central Directory Record (22 bytes)
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(4, 0, true);             // Disk number
  eocdView.setUint16(6, 0, true);             // Start disk
  eocdView.setUint16(8, processed.length, true); // Entries on disk
  eocdView.setUint16(10, processed.length, true); // Total entries
  eocdView.setUint32(12, cdSize, true);       // Size of CD
  eocdView.setUint32(16, currentOffset, true); // Offset of CD
  eocdView.setUint16(20, 0, true);            // Comment length

  // Combine into single buffer
  const totalLength = currentOffset + cdSize + 22;
  const zip = new Uint8Array(totalLength);
  let writePos = 0;

  for (const entry of processed) {
    zip.set(entry.localHeader, writePos);
    writePos += entry.localHeader.length;
    zip.set(entry.compressedData, writePos);
    writePos += entry.compressedData.length;
  }

  for (const cd of cdHeaders) {
    zip.set(cd, writePos);
    writePos += cd.length;
  }

  zip.set(eocd, writePos);
  return zip;
}

/**
 * Extracts all files from a ZIP archive buffer.
 */
export async function unzipFiles(buffer: ArrayBuffer | Uint8Array): Promise<Map<string, Uint8Array>> {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const decoder = new TextDecoder();

  // Find End of Central Directory (EOCD: signature 0x06054b50)
  let eocdOffset = -1;
  for (let i = bytes.length - 22; i >= 0; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) {
    throw new Error('Invalid spreadsheet archive: End of Central Directory record not found.');
  }

  const numEntries = view.getUint16(eocdOffset + 10, true);
  const cdOffset = view.getUint32(eocdOffset + 16, true);

  const files = new Map<string, Uint8Array>();
  let cdPos = cdOffset;

  for (let i = 0; i < numEntries; i++) {
    if (cdPos + 46 > bytes.length) break;
    if (view.getUint32(cdPos, true) !== 0x02014b50) break;

    const compMethod = view.getUint16(cdPos + 10, true);
    const compSize = view.getUint32(cdPos + 20, true);
    const nameLen = view.getUint16(cdPos + 28, true);
    const extraLen = view.getUint16(cdPos + 30, true);
    const commentLen = view.getUint16(cdPos + 32, true);
    const localOffset = view.getUint32(cdPos + 42, true);

    const filename = decoder.decode(bytes.subarray(cdPos + 46, cdPos + 46 + nameLen));
    cdPos += 46 + nameLen + extraLen + commentLen;

    if (localOffset + 30 > bytes.length) continue;
    const localNameLen = view.getUint16(localOffset + 26, true);
    const localExtraLen = view.getUint16(localOffset + 28, true);
    const dataStart = localOffset + 30 + localNameLen + localExtraLen;
    const rawData = bytes.subarray(dataStart, dataStart + compSize);

    if (compMethod === 0) {
      files.set(filename, new Uint8Array(rawData));
    } else if (compMethod === 8) {
      if (typeof DecompressionStream === 'undefined') {
        throw new Error('DecompressionStream is not supported in this runtime environment.');
      }
      const ds = new DecompressionStream('deflate-raw');
      const writer = ds.writable.getWriter();
      writer.write(rawData as unknown as BufferSource);
      writer.close();
      const reader = ds.readable.getReader();
      const chunks: Uint8Array[] = [];
      let total = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          total += value.length;
        }
      }
      const decompressed = new Uint8Array(total);
      let p = 0;
      for (const c of chunks) {
        decompressed.set(c, p);
        p += c.length;
      }
      files.set(filename, decompressed);
    }
  }

  return files;
}

// ============================================================================
// 3. EXCEL COLUMN CONVERSION HELPERS
// ============================================================================
export function indexToColLetter(index: number): string {
  let col = '';
  let temp = index;
  while (temp >= 0) {
    col = String.fromCharCode((temp % 26) + 65) + col;
    temp = Math.floor(temp / 26) - 1;
  }
  return col;
}

export function colLetterToIndex(colStr: string): number {
  let index = 0;
  const upper = colStr.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    index = index * 26 + (upper.charCodeAt(i) - 64);
  }
  return index - 1;
}

// ============================================================================
// 4. MICROSOFT EXCEL (.XLSX) PARSER
// ============================================================================
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function unescapeXml(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/**
 * Parses an Excel (.xlsx) file buffer into a 2D matrix of string cells.
 */
export async function parseXlsx(buffer: ArrayBuffer | Uint8Array): Promise<string[][]> {
  const files = await unzipFiles(buffer);
  const decoder = new TextDecoder();

  // 1. Read shared strings if present (xl/sharedStrings.xml)
  const sharedStrings: string[] = [];
  const sstBytes = files.get('xl/sharedStrings.xml') || files.get('xl/SharedStrings.xml');
  if (sstBytes) {
    const sstXml = decoder.decode(sstBytes);
    const siRegex = /<si\b[^>]*>([\s\S]*?)<\/si>/g;
    let match: RegExpExecArray | null;
    while ((match = siRegex.exec(sstXml)) !== null) {
      const inner = match[1];
      // Gather all <t> or <t ...> text pieces inside this string item
      const tRegex = /<t\b[^>]*>([\s\S]*?)<\/t>/g;
      let tMatch: RegExpExecArray | null;
      let fullText = '';
      while ((tMatch = tRegex.exec(inner)) !== null) {
        fullText += unescapeXml(tMatch[1]);
      }
      sharedStrings.push(fullText);
    }
  }

  // 2. Identify the first worksheet (default: xl/worksheets/sheet1.xml)
  let sheetXml = '';
  for (const [name, bytes] of files.entries()) {
    if (/xl\/worksheets\/sheet1\.xml$/i.test(name)) {
      sheetXml = decoder.decode(bytes);
      break;
    }
  }

  if (!sheetXml) {
    // Fallback: look for any worksheet
    for (const [name, bytes] of files.entries()) {
      if (/xl\/worksheets\/sheet.*\.xml$/i.test(name)) {
        sheetXml = decoder.decode(bytes);
        break;
      }
    }
  }

  if (!sheetXml) {
    throw new Error('No valid worksheet found inside the Excel spreadsheet.');
  }

  // 3. Parse rows and cells
  const rows: string[][] = [];
  const rowRegex = /<row\b[^>]*>([\s\S]*?)<\/row>/g;
  let rowMatch: RegExpExecArray | null;

  while ((rowMatch = rowRegex.exec(sheetXml)) !== null) {
    const rowContent = rowMatch[1];
    const cellRegex = /<c\b([^>]*)>([\s\S]*?)<\/c>/g;
    let cellMatch: RegExpExecArray | null;
    const rowCells: Array<{ col: number; val: string }> = [];

    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      const attrs = cellMatch[1];
      const body = cellMatch[2];

      // Coordinate r="A1"
      const rMatch = /r="([A-Z]+)(\d+)"/i.exec(attrs);
      const colIndex = rMatch ? colLetterToIndex(rMatch[1]) : rowCells.length;

      // Type attribute t="s" | "inlineStr" | "b" | "str" | etc.
      const tMatch = /t="([^"]+)"/i.exec(attrs);
      const cellType = tMatch ? tMatch[1] : '';

      let val = '';
      if (cellType === 's') {
        const vMatch = /<v>(\d+)<\/v>/.exec(body);
        if (vMatch) {
          const idx = parseInt(vMatch[1], 10);
          val = sharedStrings[idx] || '';
        }
      } else if (cellType === 'inlineStr') {
        const tVal = /<t\b[^>]*>([\s\S]*?)<\/t>/.exec(body);
        val = tVal ? unescapeXml(tVal[1]) : '';
      } else if (cellType === 'b') {
        const vMatch = /<v>(\d+)<\/v>/.exec(body);
        val = vMatch && vMatch[1] === '1' ? 'TRUE' : 'FALSE';
      } else {
        const vMatch = /<v>([\s\S]*?)<\/v>/.exec(body);
        val = vMatch ? unescapeXml(vMatch[1]) : '';
      }

      rowCells.push({ col: colIndex, val: val.trim() });
    }

    if (rowCells.length > 0) {
      const maxCol = Math.max(...rowCells.map((c) => c.col));
      const rowArr = new Array<string>(maxCol + 1).fill('');
      for (const cell of rowCells) {
        if (cell.col >= 0) rowArr[cell.col] = cell.val;
      }
      rows.push(rowArr);
    }
  }

  return rows;
}

// ============================================================================
// 5. MICROSOFT EXCEL (.XLSX) GENERATOR
// ============================================================================
/**
 * Generates an Excel (.xlsx) file buffer from a 2D matrix of strings.
 */
export async function generateXlsx(rows: Array<Array<string | number>>): Promise<Uint8Array> {
  const encoder = new TextEncoder();

  // 1. Build sheet1.xml
  let sheetXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  sheetXml += '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">\n';
  sheetXml += '<sheetData>\n';

  rows.forEach((row, rowIdx) => {
    const rowNum = rowIdx + 1;
    sheetXml += `  <row r="${rowNum}">\n`;
    row.forEach((cellVal, colIdx) => {
      const cellRef = `${indexToColLetter(colIdx)}${rowNum}`;
      const strVal = String(cellVal ?? '');
      sheetXml += `    <c r="${cellRef}" t="inlineStr"><is><t>${escapeXml(strVal)}</t></is></c>\n`;
    });
    sheetXml += '  </row>\n';
  });

  sheetXml += '</sheetData>\n';
  sheetXml += '</worksheet>';

  // 2. Standard OpenXML Boilerplate files
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Question Bank" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;

  const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`;

  // 3. Package as ZIP archive
  const files: ZipFileEntry[] = [
    { name: '[Content_Types].xml', data: encoder.encode(contentTypesXml) },
    { name: '_rels/.rels', data: encoder.encode(rootRelsXml) },
    { name: 'xl/workbook.xml', data: encoder.encode(workbookXml) },
    { name: 'xl/_rels/workbook.xml.rels', data: encoder.encode(workbookRelsXml) },
    { name: 'xl/worksheets/sheet1.xml', data: encoder.encode(sheetXml) },
  ];

  return buildZipFile(files);
}

// ============================================================================
// 6. RFC-4180 CSV PARSER & GENERATOR (with UTF-8 BOM)
// ============================================================================
/**
 * Generates an RFC-4180 compliant CSV string with a UTF-8 BOM header
 * so Excel automatically recognizes international characters without corruption.
 */
export function generateCsv(rows: Array<Array<string | number>>, delimiter: string = ','): string {
  const lines = rows.map((row) =>
    row
      .map((cell) => {
        const str = String(cell ?? '');
        if (str.includes(delimiter) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(delimiter)
  );

  // Prepend UTF-8 BOM (\uFEFF)
  return '\uFEFF' + lines.join('\r\n');
}

/**
 * Parses an RFC-4180 compliant CSV text into a 2D matrix of string cells.
 * Automatically recognizes comma (,), semicolon (;), and tab (\t) delimiters.
 */
export function parseCsv(text: string): string[][] {
  const cleanStr = text.replace(/^\uFEFF/, '');
  if (!cleanStr.trim()) return [];

  // Delimiter auto-detection from the first non-empty line
  const lines = cleanStr.split(/\r?\n/);
  const sampleLine = lines.find((l) => l.trim().length > 0) || '';
  const commaCount = (sampleLine.match(/,/g) || []).length;
  const semiCount = (sampleLine.match(/;/g) || []).length;
  const tabCount = (sampleLine.match(/\t/g) || []).length;

  let delimiter = ',';
  if (semiCount > commaCount && semiCount > tabCount) delimiter = ';';
  else if (tabCount > commaCount && tabCount > semiCount) delimiter = '\t';

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < cleanStr.length; i++) {
    const char = cleanStr[i];
    const nextChar = cleanStr[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // Skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}
