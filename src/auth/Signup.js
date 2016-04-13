
import React    from 'react';
import {
	browserHistory
}               from 'react-router';
import Icon     from 'components/Icon/Icon.react';
import LoginRow from 'components/LoginRow/LoginRow.react';
import styles   from './form.scss';

export default class Signup extends React.Component {
	constructor() {
		super();
		this.state = {
			disableSubmit: true
		}
	}

	render() {
		return (
			<div className={styles['login-bg']}>
				<div className={styles.main} style={{ marginTop: '-220px' }}>
					<Icon width={80} height={80} name='reparse' fill='#093A59' />
					<form method='post' ref='form' className={styles.form}>
						<div className={styles.header}>Create an account</div>
						<LoginRow
	            label='Email'
	            input={<input name='email' type='email' />} />
	          <LoginRow
	            label='Password'
	            input={<input name='password' type='password' />} />
	          <LoginRow
	            label='Password confirmation'
	            input={<input name='password-confirmation' type='password' />} />
	          {this.errors ?
	            <div className={styles.error}>
	              {this.errors}
	            </div> : null}
						<input
							type='submit'
							disabled={!!this.state.disableSubmit}
							onClick={e => {
								if (this.props.disableSubmit) {
									e.preventDefault();
									return false;
								}
								return handleSubmit(e);
							}}
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

function handleSubmit(e) {
	console.log(e);
}
