import React, { Component } from "react";




class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    
  }
  
  render() {
    if (this.state.error) {
      return (
        <div>
          
          <div>
            <p>We're sorry - something's gone wrong.</p>
            
          </div>

        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;