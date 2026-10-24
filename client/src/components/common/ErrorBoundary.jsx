import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div role="alert" style={{ padding: '48px', textAlign: 'center' }}>
        <h2>Something went wrong</h2>
        <p>An unexpected error occurred. Please reload the page.</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    )
  }
}

export default ErrorBoundary
