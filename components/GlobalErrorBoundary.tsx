"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-error-container/20 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-error" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-on-surface tracking-tight">Something went wrong</h1>
              <p className="text-on-surface-variant text-sm font-medium">
                An unexpected error occurred while rendering this component.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-surface-container-high p-4 rounded-lg text-left overflow-auto max-h-40">
                <p className="text-[10px] font-mono text-error break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:shadow-[4px_4px_0px_#191A23] transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-high text-on-surface rounded-xl font-bold text-sm transition-all border border-outline-variant/20"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
