import { Component, type ErrorInfo, type ReactNode } from "react";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";

interface Props { children: ReactNode }
interface State { error: Error | null }

/**
 * ErrorBoundary — catches unhandled render errors so the app never
 * fully white-screens. Shows a retry card that resets both React
 * component state and the TanStack Query cache.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    queryClient.resetQueries();
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Something went wrong</h2>
            <p className="text-sm text-gray-500 font-mono bg-gray-100 rounded p-3 text-left break-words">
              {this.state.error.message}
            </p>
            <Button onClick={this.handleReset}>Try again</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
