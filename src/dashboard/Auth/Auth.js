
import React      from 'react';
import lodash     from 'lodash';
import Parse      from 'parse';
import {
	Router,
	Route,
	Redirect,
	browserHistory
}                 from 'react-router';
import Loader     from 'components/Loader/Loader.react';
import { center } from 'stylesheets/base.scss';
import Dashboard  from './../Dashboard';
import AdminApp   from './../AdminApp';
import Login      from './Login';
import Signup     from './Signup';
import Forgot     from './Forgot';

class Auth extends React.Component {
	constructor(props) {
		super();
		this.state = {
			autenticated: null
		};
		this.mounted = false;
	}

	componentWillMount() {
		this.checkLogin();
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	checkLogin() {
		AdminApp.setParseKeys();
		const currentUser = Parse.User.current(),
			autenticated = !!currentUser;

		if (this.mounted) {
			this.setState({autenticated: autenticated});
		}
		else {
			this.state.autenticated = autenticated;
		}

		if (autenticated) {
			browserHistory.push('/');
		}
	}

	render() {
		if (this.state.autenticated === null) {
			return <div className={center}><Loader/></div>;
		}
		if (this.state.autenticated === false) {
			return <Router history={browserHistory}>
				<Route path="/" component={Login} />
				<Route path="/login" onLogin={this.checkLogin.bind(this)} component={Login} />
				<Route path="/signup" onLogin={this.checkLogin.bind(this)} component={Signup} />
				<Route path="/forgot" component={Forgot} />
				<Route path="*" component={Login} />
			</Router>;
		}
		return <Dashboard />;
	}
}

module.exports = Auth;
