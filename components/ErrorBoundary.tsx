import React, { ErrorInfo } from 'react';
import styles from '../styles/Dashboard.module.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackRender?: (props: { error: Error; resetErrorBoundary: () => void }) => React.ReactNode;
  onReset?: () => void;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, info);
    }
    console.error("Uncaught error:", error, info);
  }

  resetErrorBoundary() {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallbackRender) {
        return this.props.fallbackRender({
          error: this.state.error,
          resetErrorBoundary: this.resetErrorBoundary
        });
      }
      return (
        <div className={styles.errorContainer}>
          <h1 className={styles.errorMessage}>Something went wrong.</h1>
          <p className={styles.errorDetails}>{this.state.error.message}</p>
          <button onClick={this.resetErrorBoundary} className={styles.refreshButton}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
