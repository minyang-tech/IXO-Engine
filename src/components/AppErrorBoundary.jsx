import { Component } from "react";

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      componentStack: ""
    };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("IXO renderer crash", error, info);
    this.setState({ componentStack: info?.componentStack || "" });
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <main className="app-error-screen">
        <section className="app-error-card">
          <p className="app-error-kicker">IXO Recovery</p>
          <h1>Renderer error detected</h1>
          <p>
            The workspace hit an unexpected error. Your local auto-save is preserved, so a reload is the safest first recovery step.
          </p>
          <div className="app-error-actions">
            <button onClick={() => window.location.reload()}>Reload workspace</button>
            <button className="ghost-btn" onClick={() => this.setState({ error: null, componentStack: "" })}>
              Try to continue
            </button>
          </div>
          <details>
            <summary>Technical details</summary>
            <pre>{String(this.state.error?.stack || this.state.error?.message || this.state.error)}</pre>
            {this.state.componentStack ? <pre>{this.state.componentStack}</pre> : null}
          </details>
        </section>
      </main>
    );
  }
}
