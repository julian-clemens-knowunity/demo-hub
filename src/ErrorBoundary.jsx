import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Demo crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 20,
            backgroundColor: '#0a0a0a',
            color: '#fff',
            fontFamily: 'system-ui',
            minHeight: '100vh',
          }}
        >
          <h2 style={{ color: '#ff5555' }}>Demo crashed</h2>
          <pre style={{ color: '#ff8888', fontSize: 12, whiteSpace: 'pre-wrap', overflow: 'auto' }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: 16,
              padding: '12px 24px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              color: '#fff',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
