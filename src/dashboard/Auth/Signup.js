
import React       from 'react';
import Parse       from 'parse';
import {
	browserHistory
}                  from 'react-router';
import Icon        from 'components/Icon/Icon.react';
import LoginRow    from 'components/LoginRow/LoginRow.react';
import AdminApp    from './../AdminApp';
import styles      from './form.scss';

export default class Signup extends React.Component {
	constructor(props) {
		super();
		this.state = {
			disableSubmit: true,
			email: '',
			password: '',
			confirmation: '',
			errors: [],
			backendErrors: []
		}
	}

	componentDidMount() {
		this.validate();
	}

	validate() {
		const errors = this.state.backendErrors,
			emailRegexp = /^[^@]+@[^@]+$/;

		this.state.backendErrors = [];

		if (this.refs.username.value.length === 0) {
			errors.push('Username must be not empty.');
		}

		if (this.refs.password.value.length === 0) {
			errors.push('Password must be not empty.');
		}

		if (
			this.refs.confirmation.value.length === 0 ||
			this.refs.confirmation.value !== this.refs.password.value
		) {
			errors.push('Please, confirm the password.');
		}

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

		this.state.backendErrors = [];

		AdminApp.setParseKeys();

		const user = new Parse.User();
		user.set("username", this.refs.username.value);
		user.set("password", this.refs.password.value);
		user.set("email", this.refs.email.value);

		user.signUp(null, {
			success: this.props.route.onLogin,
			error: (user, error) => {
				this.state.backendErrors.push(error.message);
				this.validate();
			}
		});
	}

	render() {

		const errors = this.state.errors.map((error, i) =>
			(<div key={i}>{error}</div>));

		return (
			<div className={styles['login-bg']}>
				<div className={styles.main} style={{ marginTop: '-220px' }}>
					<Icon width={80} height={80} name='reparse' fill='#093A59' />
					<form className={styles.form}>
						<div className={styles.header}>Create an account</div>
						<LoginRow
							label='Username'
							input={<input ref='username' name='username' type='text' onChange={this.validate.bind(this)} />} />
						<LoginRow
							label='Email'
							input={<input ref='email' name='email' type='email' onChange={this.validate.bind(this)} />} />
						<LoginRow
							label='Password'
							input={<input ref='password' name='password' type='password' onChange={this.validate.bind(this)} />} />
						<LoginRow
							label='Confirm'
							input={<input ref='confirmation' name='confirmation' type='password' onChange={this.validate.bind(this)} />} />
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
						onClick={browserHistory.push.bind(browserHistory, '/login')}>
							Already have account? Login
					</a>
				</div>
			</div>
		);
	}
}
