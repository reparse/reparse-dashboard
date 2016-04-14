
import React              from 'react';
import Parse              from 'parse';
import { browserHistory } from 'react-router'
import Icon               from 'components/Icon/Icon.react';
import LoginRow           from 'components/LoginRow/LoginRow.react';
import AdminApp           from './../AdminApp';
import { verticalCenter } from 'stylesheets/base.scss';
import styles             from './form.scss';

export default class Login extends React.Component {
	constructor(props) {
		super();
		this.state = {
			errors: [],
			backendErrors: [],
			sended: false,
			requestInProcess: false
		}
	}

	validate() {
		const errors = this.state.backendErrors,
			emailRegexp = /^[^@]+@[^@]+$/;

		this.state.backendErrors = [];

		if (!emailRegexp.test(this.refs.email.value)) {
			errors.push('Please, put valid email.');
		}

		this.setState({ errors });
	}

	handleSubmit(e) {
		e.preventDefault();
		this.validate();
		if (this.state.errors.length) {
			return;
		}

		AdminApp.setParseKeys();

		this.setState({ requestInProcess: true });
		Parse.User.requestPasswordReset(this.refs.email.value, {
			success: _ =>
				this.setState({sended: true, requestInProcess: false}),
			error: error => {
				this.setState({ requestInProcess: false });
				this.state.backendErrors.push(error.message);
				this.validate();
			}
		});
	}

	render() {
		return (<div className={styles['login-bg']}>
			<div className={styles.main} style={{ marginTop: '-220px' }}>
				<Icon width={80} height={80} name='reparse' fill='#093A59' />
				<form className={styles.form}>
					<div className={styles.header}>Reset your password</div>
					<LoginRow
						label='Email'
						input={<input ref="email" onChange={this.validate.bind(this)} />} />
					{this.state.errors.length ?
						<div className={styles.error}>
							{this.state.errors.map((error, i) => <div key={i}>{error}</div>)}
						</div> : null}
					<div className={styles.message}>
						{this.state.requestInProcess ?
							'Please, wait' :
							this.state.sended ? 
								'Successfully sended' :
								<span>That's okay. Enter your email and we'll send<br />you a way to reset your password.</span>}
					</div>
					<div className={styles.footer}>
						<div className={verticalCenter} style={{ width: '100%' }}>
							<a href='javascript:;' onClick={browserHistory.push.bind(browserHistory, '/login')}>
								{this.state.sended ? 'Go to login' : 'Never mind, go back'}
							</a>
						</div>
					</div>
					<input
						type='submit'
						disabled={
							this.state.errors.length ||
							this.state.requestInProcess}
						onClick={this.handleSubmit.bind(this)}
						className={styles.submit} />
				</form>
			</div>
		</div>);
	}
}
