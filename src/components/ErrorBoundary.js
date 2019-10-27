import React, { Component } from "react";
import { Link } from "react-router-dom";




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
                        <div className="buttons">
                            <Link to={'/api'} className="button is-link is-light">Volver a la Home</Link>
                        </div>
                    </div>

                </div>
            );
        } else {
            return this.props.children;
        }
    }
}

export default ErrorBoundary;