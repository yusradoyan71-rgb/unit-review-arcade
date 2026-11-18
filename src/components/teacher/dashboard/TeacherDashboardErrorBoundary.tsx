import React, { Component, type ReactNode } from 'react';
import { AlertOctagon, RefreshCw, ArrowLeft, LogOut } from 'lucide-react';

interface Props {
  children: ReactNode;
  onExitToArcade?: () => void;
  onLogout?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class TeacherDashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[TeacherDashboardErrorBoundary] Uncaught dashboard error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans selection:bg-rose-500 selection:text-white">
          <div className="w-full max-w-2xl bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
            
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 shadow-xs">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bubble font-bold text-white tracking-wide">
                  DASHBOARD RENDERING ERROR
                </h2>
                <p className="text-xs text-slate-400">
                  A component error occurred while rendering the Teacher Dashboard. Your student data in Google Sheets remains completely safe.
                </p>
              </div>
            </div>

            {/* Error Details */}
            {this.state.error && (
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs font-mono text-rose-300 overflow-x-auto max-h-48">
                <div className="font-bold text-rose-400">
                  {this.state.error.name}: {this.state.error.message}
                </div>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-[10px] text-slate-500 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-700/60">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs transition-colors"
                >
                  Reload Page
                </button>
              </div>

              <div className="flex items-center gap-2">
                {this.props.onExitToArcade && (
                  <button
                    type="button"
                    onClick={this.props.onExitToArcade}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-400" />
                    <span>Back to Arcade</span>
                  </button>
                )}

                {this.props.onLogout && (
                  <button
                    type="button"
                    onClick={this.props.onLogout}
                    className="px-3.5 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

