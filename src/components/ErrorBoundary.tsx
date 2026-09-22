import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render-time errors anywhere in the tree so a crash shows a friendly,
 * branded message (with a phone number) instead of a blank white page. Global
 * startup errors are covered separately by the guard in index.html.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[IQ Motors] Unhandled UI error:", error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold mb-3 text-cardealer-primary">
            Sorry, something went wrong
          </h1>
          <p className="text-gray-600 mb-6">
            Please reload the page. If the problem continues, call us on{" "}
            <a
              href="tel:+447877028198"
              className="font-semibold text-cardealer-primary hover:underline"
            >
              07877 028198
            </a>
            .
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="inline-flex items-center justify-center rounded-md bg-cardealer-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            Reload page
          </button>
          {import.meta.env.DEV && (
            <pre className="mt-6 overflow-x-auto rounded bg-gray-100 p-3 text-left text-xs text-gray-700">
              {error.message}
            </pre>
          )}
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
