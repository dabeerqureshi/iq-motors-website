import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, Phone } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render-time errors anywhere in the tree so a crash shows a friendly,
 * branded recovery screen with showroom contact information instead of a blank page.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[IQ Motors] Uncaught UI error:", error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public handleReset = () => {
    this.setState({ error: null });
    window.location.href = "/";
  };

  public render() {
    const { error } = this.state;

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-5">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
              <p className="text-gray-600 text-sm mt-2">
                We encountered an unexpected issue while loading this page. Please reload or contact our showroom directly on{" "}
                <a href="tel:+447877028198" className="font-semibold text-cardealer-primary hover:underline">
                  07877 028198
                </a>
                .
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={this.handleReload}
                className="flex-1 bg-cardealer-primary hover:bg-cardealer-secondary text-white gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </Button>
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="flex-1 gap-2"
              >
                <Home className="w-4 h-4" />
                Return Home
              </Button>
            </div>

            {import.meta.env.DEV && (
              <pre className="mt-4 overflow-x-auto rounded bg-gray-100 p-3 text-left text-xs text-red-600 max-h-32">
                {error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
