import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#ffebee', color: '#c62828', fontFamily: 'sans-serif', height: '100vh', overflow: 'auto' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>कुछ गड़बड़ हुई (Something went wrong)</h1>
          <h2 style={{ fontSize: '18px', marginTop: '10px' }}>{this.state.error && this.state.error.toString()}</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px', background: '#fff', padding: '10px', borderRadius: '4px' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
