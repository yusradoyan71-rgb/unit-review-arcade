import json
import re

# Read src/data/gamesZone/wordConnectData.ts
with open('src/data/gamesZone/wordConnectData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Locate the export
prefix = "export const WORD_CONNECT_BANK: WordConnectBank = "
assert prefix in text
json_str = text.split(prefix)[1].strip().rstrip(';')
bank = json.loads(json_str)

# Puzzles to redesign:
# 1. wc_g7_e_02 (F,A,S,T -> FAT)
# 2. wc_g7_e_16 (B,E,A,R -> BAR)
# 3. wc_g7_e_37 (A,W,A,R,D,S -> WAR)
# 4. wc_g7_m_13 (W,A,T,E,R,S -> WAR)
# 5. wc_g7_m_22 (B,R,A,V,E -> BAR)
# 6. wc_g7_m_38 (R,A,F,T -> FAT)
# 7. wc_g7_h_10 (J,U,N,G,L,E,S -> GUN)
# 8. wc_g7_h_24 (D,A,M,A,G,E,S -> MAD)
# 9. wc_g7_h_31 (H,E,A,L,T,H,Y -> HATE)
# 10. wc_g7_h_33 (S,U,M,M,E,R,S -> RUM)
# 11. wc_g8_e_38 (F,L,A,T -> FAT)
# 12. wc_g8_m_19 (R,E,C,I,P,E -> DIE)
# 13. wc_g8_m_26 (F,L,O,O,D -> FOOL)
# 14. wc_g8_h_10 (H,A,N,G,U,P -> GUN)
# 15. wc_g8_h_28 (H,E,A,T,E,D -> HATE)
# 16. wc_g8_h_30 (D,A,M,A,G,E -> MAD)

print("Puzzles loaded successfully.")

