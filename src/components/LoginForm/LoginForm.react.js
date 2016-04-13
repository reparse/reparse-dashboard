import CSRFInput          from 'components/CSRFInput/CSRFInput.react';
import Icon               from 'components/Icon/Icon.react';
import PropTypes          from 'lib/PropTypes';
import React              from 'react';
import styles             from 'components/LoginForm/LoginForm.scss';
import { verticalCenter } from 'stylesheets/base.scss';

const facebookSupports = false,
  githubSupports = false,
  googleSupports = false

// Class-style component, because we need refs
export default class LoginForm extends React.Component {
  render() {
    return (
      <div className={styles.login} style={{ marginTop: this.props.marginTop || '-220px' }}>
        <Icon width={80} height={80} name='reparse' fill='#093A59' />
        <form method='post' ref='form' action={this.props.endpoint} className={styles.form}>
          <div className={styles.header}>{this.props.header}</div>
          {this.props.children}
          <div className={styles.footer}>
            <div className={verticalCenter} style={{ width: '100%' }}>
              {this.props.footer}
            </div>
          </div>
          <input
            type='submit'
            disabled={!!this.props.disableSubmit}
            onClick={() => {
              if (this.props.disableSubmit) {
                return;
              }
              this.refs.form.submit()
            }}
            className={styles.submit}
            value={this.props.action} />
        </form>
        <div className={styles.oauth}>
          {ngIf(facebookSupports || githubSupports || googleSupports,
            <span>Or, log in with</span>)}
          {ngIf(
            facebookSupports,
            <a className={styles.facebook} href='/auth/facebook'><Icon name='facebook' width={18} height={18} fill='#ffffff' /></a>)}
          {ngIf(
            githubSupports,
            <a className={styles.github} href='/auth/github'><Icon name='github' width={18} height={18} fill='#ffffff' /></a>)}
          {ngIf(
            googleSupports,
            <a className={styles.google} href='/auth/google_oauth2'><Icon name='google' width={18} height={18} fill='#ffffff' /></a>)}
        </div>
        <a
          className={styles.swap}
          href="javascript:;"
          onClick={this.props.swapAction}>
          {this.props.swapText}
        </a>
      </div>
    );
  }
}

function ngIf(show, element) {
  if (!show) {
    return null;
  }
  return element;
}
