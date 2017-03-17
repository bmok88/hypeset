import React, { Component, PropTypes as T } from 'react';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthenticated, routeToNews } = nextProps;
    if (isAuthenticated) {
      routeToNews();
    }
  }

  handleInputChange(e, field) {
    const updatedState = {};
    updatedState[field] = e.target.value;
    this.setState(updatedState);
  }

  // TODO: form validation
  render() {
    const { onSignUp, routeToSignIn } = this.props;
    const { username, password, email, firstName, lastName } = this.state;
    return (
      <div className="sign-up">
        <img src={require('../../../assets/intro-bg4.jpg')} className="bg" />
        <div className="sign-up-container">
          <div className="title">hypeset</div>
          <form className="sign-up-form">
            <input type="text" className="username" name="username" placeholder="Username" value={username} onChange={e => this.handleInputChange(e, 'username')} />
            <input type="password" className="password" name="password" placeholder="Password" value={password} onChange={e => this.handleInputChange(e, 'password')} />
            <input type="email" className="email" name="email" placeholder="Email" value={email} onChange={e => this.handleInputChange(e, 'email')} />
            <button type="button" value="Sign up" onClick={() => onSignUp({ username, password, email, firstName, lastName })}>Sign Up</button>
          </form>
          <div onClick={routeToSignIn}>Already have an account? <span className="link">Sign in</span></div>
        </div>
      </div>
    );
  }
}

SignUp.propTypes = {
  onSignUp: T.func,
  routeToNews: T.func,
  routeToSignIn: T.func,
  isAuthenticated: T.boolean,
};
