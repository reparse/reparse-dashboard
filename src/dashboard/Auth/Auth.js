
import React       from 'react';
import lodash      from 'lodash';
import Parse       from 'parse';
import {
	Router,
  Route,
  Redirect,
  browserHistory
}                  from 'react-router';
import AppsManager from 'lib/AppsManager';
import Loader      from 'components/Loader/Loader.react';
import { center }  from 'stylesheets/base.scss';
import Dashboard   from './../Dashboard';
import config      from './../config';
import contants    from './../constants';
import Login       from './Login';
import Signup      from './Signup';

class Auth extends React.Component {
	constructor(props) {
		super();
		this.state = {
			autenticated: null
		};
	}

	componentWillMount() {
		const rawAdminApp = _.cloneDeep(config.adminApp);
		rawAdminApp.appName = contants.ADMIN_APP_NAME;
		AppsManager.addApp(rawAdminApp);

		const adminApp = AppsManager.findAppByName(contants.ADMIN_APP_NAME);
		adminApp.setParseKeys();
		const currentUser = Parse.User.current();

		if (currentUser) {
			this.state.autenticated = true;
		} else {
			this.state.autenticated = false;
		}
	}

	render() {
		if (this.state.autenticated === null) {
			return <div className={center}><Loader/></div>;
		}
		if (this.state.autenticated === false) {
			return <Router history={browserHistory}>
				<Route path="/" component={Login} />
				<Route path="/login" component={Login} />
				<Route path="/signup" component={Signup} />
				<Route path="*" component={Login} />
			</Router>;
		}
		return <Dashboard />;
	}
}

module.exports = Auth;
