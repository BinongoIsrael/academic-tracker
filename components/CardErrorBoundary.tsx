"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  title?: string;
}

interface State {
  hasError: boolean;
}

class CardErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Card error caught:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-full min-h-[200px] bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 bg-error-container/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-error" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-on-surface">
              {this.props.title || "Section Error"}
            </h3>
            <p className="text-xs text-on-surface-variant max-w-[200px]">
              Something went wrong while loading this card.
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface rounded-lg text-xs font-bold border border-outline-variant/10 hover:bg-surface-container-highest transition-colors"
          >
            <RefreshCcw className="w-3 h-3" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default CardErrorBoundary;
