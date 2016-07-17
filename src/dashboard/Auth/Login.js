import React              from 'react';
import Parse              from 'parse';
import { browserHistory } from 'react-router'
import LoginRow           from 'components/LoginRow/LoginRow.react';
import Icon               from 'components/Icon/Icon.react';
import AdminApp           from './../AdminApp';
import { verticalCenter } from 'stylesheets/base.scss';
import styles             from './form.scss';

const facebookSupports = false,
	githubSupports = false,
	googleSupports = false;

export default class Login extends React.Component {
	constructor() {
		super();

		this.state = {
			requestInProcess: false,
			inputErrors: [],
			backendErrors: []
		};
	}

	validate() {
		const inputErrors = [];

		if (!this.refs.username.value.length) {
			inputErrors.push('Username must be non-empty.');
		}

		if (!this.refs.password.value.length) {
			inputErrors.push('Password must be non-empty.');
		}

		this.setState({ inputErrors });
	}

	handleSubmit(e) {
		e.preventDefault();
		this.validate();
		if (this.state.inputErrors.length) {
			return;
		}
		this.setState({ backendErrors: [] });

		AdminApp.setParseKeys();

		this.setState({ requestInProcess: true });
		Parse.User.logIn(this.refs.username.value, this.refs.password.value, {
			success: this.props.route.onLogin,
			error: (user, error) => {
				this.setState({ requestInProcess: false });
				this.state.backendErrors.push(error.message);
				this.validate();
			}
		});
	}

	render() {
		return (
			<div className={styles['login-bg']}>
				<div className={styles.main} style={{ marginTop: '-220px' }}>
					<Icon width={80} height={80} name='reparse' fill='#093A59' />
					<form className={styles.form}>
						<div className={styles.header}>Access your Dashboard</div>
						<LoginRow
							label='Username'
							input={<input onChange={this.validate.bind(this)} ref='username' />} />
						<LoginRow
							label='Password'
							input={<input onChange={this.validate.bind(this)} ref='password' />} />
						{this.state.inputErrors.length || this.state.backendErrors.length ?
							<div className={styles.error}>
								{[]
									.concat(this.state.inputErrors)
									.concat(this.state.backendErrors)
									.map((error, i) => <div key={i}>{error}</div>)}
							</div> : null}
						<div className={styles.footer}>
							<div className={verticalCenter} style={{ width: '100%' }}>
								<a href='javascript:;' onClick={browserHistory.push.bind(browserHistory, '/forgot')}>Forgot something?</a>
							</div>
						</div>
						<input
							type='submit'
							disabled={this.state.inputErrors.length || this.state.requestInProcess}
							onClick={this.handleSubmit.bind(this)}
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

