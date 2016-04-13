import React     from 'react';
import {
  Link,
  browserHistory
}  from 'react-router'
import LoginForm from 'components/LoginForm/LoginForm.react';
import LoginRow  from 'components/LoginRow/LoginRow.react';
import styles    from './form.scss';

export default class Login extends React.Component {
  constructor() {
    super();

    let errorDiv = document.getElementById('login_errors');
    if (errorDiv) {
      this.errors = errorDiv.innerHTML;
    }

    this.state = {
      forgot: false
    };
  }

  render() {
    if (this.state.forgot) {
      return (
        <div className={styles['login-bg']}>
          <LoginForm
            header='Reset your password'
            footer={<a href='javascript:;' onClick={() => this.setState({ forgot: false })}>Never mind, go back</a>}
            action='Reset password'
            endpoint='/password_resets'
            swapText={
              <span style={{ verticalAlign: 'top' }}>
                I don't have a Parse account <span style={{ fontSize: 20, verticalAlign: 'middle' }}>😕</span>
              </span>
            }
            swapAction={signup}>
            <LoginRow
              label='Email'
              input={<input name='email' type='email' />} />
            <div className={styles.message}>
              That's okay. Enter your email and we'll send<br />you a way to reset your password.
            </div>
          </LoginForm>
        </div>
      );
    }

    return (
      <div className={styles['login-bg']}>
        <LoginForm
          header='Access your Dashboard'
          footer={<a href='javascript:;' onClick={() => this.setState({ forgot: true })}>Forgot something?</a>}
          action='Log In'
          endpoint='/user_session'
          swapText={
            <span style={{ verticalAlign: 'top' }}>
              I don't have a Parse account <span style={{ fontSize: 20, verticalAlign: 'middle' }}>😕</span>
            </span>
          }
          swapAction={signup}>
          <LoginRow
            label='Email'
            input={<input name='user_session[email]' type='email' />} />
          <LoginRow
            label='Password'
            input={<input name='user_session[password]' type='password' />} />
          {this.errors ?
            <div className={styles.error}>
              {this.errors}
            </div> : null}
        </LoginForm>
      </div>
    );
  }
}

function signup() {
  browserHistory.push('/signup');
}
