import React, {Component} from 'react';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {response: undefined};
    }

    login() {
        this.props.auth.login();
    }

    componentDidMount() {
        let fetchPromise;
        if (!this.props.auth.getAccessToken()) {
            fetchPromise = fetch(`/api/public`);
        } else {
            fetchPromise = fetch('/api/private', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${this.props.auth.getAccessToken()}`
                }
            });
        }

        fetchPromise
            .then(res => res.json())
            .then(res => {
                this.setState({response: res});
            });
    }

    render() {
        const {isAuthenticated} = this.props.auth;
        return (
            <div className="container">
                {
                    isAuthenticated() && (
                        <h4>
                            You are logged in!
                        </h4>
                    )
                }
                {
                    !isAuthenticated() && (
                        <h4>
                            You are not logged in! Please{' '}
                            <a
                                style={{cursor: 'pointer'}}
                                onClick={this.login.bind(this)}
                            >
                                Log In
                            </a>
                            {' '}to continue.
                        </h4>
                    )
                }
                <div>
                    response:
                    <pre data-cy="responseText">{JSON.stringify(this.state.response)}</pre>
                </div>
            </div>
        );
    }
}

export default Home;
