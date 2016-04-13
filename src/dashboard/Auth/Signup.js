
import React       from 'react';
import Parse       from 'parse';
import {
	browserHistory
}                  from 'react-router';
import AppsManager from 'lib/AppsManager';
import Icon        from 'components/Icon/Icon.react';
import LoginRow    from 'components/LoginRow/LoginRow.react';
import contants    from './../constants';
import styles      from './form.scss';

export default class Signup extends React.Component {
	constructor(props) {
		super();
		this.state = {
			disableSubmit: true,
			email: '',
			password: '',
			confirmation: '',
			errors: []
		}
	}

	componentDidMount() {
		this.validate();
	}

	setEmail(e) {
		this.state.email = e.target.value;
		this.validate();
	}

	setPassword(e) {
		this.state.password = e.target.value;
		this.validate();
	}

	setConfirmation(e) {
		this.state.confirmation = e.target.value;
		this.validate();
	}

	validate() {
		const errors = [];

		if (
			typeof this.state.confirmation !== 'string' ||
			this.state.password.length === 0
		) {
			errors.push('Password must be not empty.');
		}

		if (
			typeof this.state.confirmation !== 'string' ||
			this.state.confirmation.length === 0 ||
			this.state.confirmation !== this.state.password
		) {
			errors.push('Please, confirm the password.');
		}

		if (
			typeof this.state.email !== 'string' ||
			this.state.email.length === 0
		) {
			errors.push('Please, put valid email.');
		}

		this.setState({
			errors
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		this.validate();
		if (this.state.errors.length) {
			return;
		}

		const adminApp = AppsManager.findAppByName(contants.ADMIN_APP_NAME);
		adminApp.setParseKeys();

		const user = new Parse.User();
		user.set("password", this.state.password);
		user.set("email", this.state.email);

		user.signUp(null, {
			success: function(user) {
				alert('success');
				console.log(Parse.User.current(), user);
			},
			error: function(user, error) {
				// Show the error message somewhere and let the user try again.
				alert("Error: " + error.code + " " + error.message);
				console.log(Parse.User.current(), user, error);
			}
		});
	}

	render() {

		const errors = this.state.errors.map(error =>
			(<div>{error}</div>));

		return (
			<div className={styles['login-bg']}>
				<div className={styles.main} style={{ marginTop: '-220px' }}>
					<Icon width={80} height={80} name='reparse' fill='#093A59' />
					<form method='post' ref='form' className={styles.form}>
						<div className={styles.header}>Create an account</div>
						<LoginRow
							label='Email'
							input={<input name='email' onChange={this.setEmail.bind(this)} type='email' />} />
						<LoginRow
							label='Password'
							input={<input name='password' onChange={this.setPassword.bind(this)} type='password' />} />
						<LoginRow
							label='Confirm'
							input={<input name='password-confirmation' onChange={this.setConfirmation.bind(this)} type='password' />} />
						{errors.length ?
							<div className={styles.error}>
								{errors}
							</div> : null}
						<input
							type='submit'
							disabled={errors.length}
							onClick={this.handleSubmit.bind(this)}
							className={styles.submit} />
					</form>
					<a
						className={styles.swap}
						href="javascript:;"
						onClick={goToLogin}>
							Already have account? Login
					</a>
				</div>
			</div>
		);
	}
}

function goToLogin() {
	browserHistory.push('/login');
}
