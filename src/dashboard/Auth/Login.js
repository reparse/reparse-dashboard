import React              from 'react';
import { browserHistory } from 'react-router'
import LoginRow           from 'components/LoginRow/LoginRow.react';
import Icon               from 'components/Icon/Icon.react';
import { verticalCenter } from 'stylesheets/base.scss';
import styles             from './form.scss';

const facebookSupports = false,
	githubSupports = false,
	googleSupports = false;

export default class Login extends React.Component {
	render() {
		return (
			<div className={styles['login-bg']}>
				<div className={styles.main} style={{ marginTop: '-220px' }}>
					<Icon width={80} height={80} name='reparse' fill='#093A59' />
					<form className={styles.form}>
						<div className={styles.header}>Access your Dashboard</div>
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
						<div className={styles.footer}>
							<div className={verticalCenter} style={{ width: '100%' }}>
								<a href='javascript:;' onClick={browserHistory.push.bind(browserHistory, '/forgot')}>Forgot something?</a>
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
							className={styles.submit} />
					</form>
					{ngIf(facebookSupports || githubSupports || googleSupports,
						<div className={styles.oauth}>
								<span>Or, log in with</span>
							{ngIf(
								facebookSupports,
								<a className={styles.facebook} href='/auth/facebook'><Icon name='facebook' width={18} height={18} fill='#ffffff' /></a>)}
							{ngIf(
								githubSupports,
								<a className={styles.github} href='/auth/github'><Icon name='github' width={18} height={18} fill='#ffffff' /></a>)}
							{ngIf(
								googleSupports,
								<a className={styles.google} href='/auth/google_oauth2'><Icon name='google' width={18} height={18} fill='#ffffff' /></a>)}
						</div>)}
					<a
						className={styles.swap}
						href="javascript:;"
						onClick={browserHistory.push.bind(browserHistory, '/signup')}>
						<span style={{ verticalAlign: 'top' }}>
							I don't have a Parse account <span style={{ fontSize: 20, verticalAlign: 'middle' }}>😕</span>
						</span>
					</a>
				</div>
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

