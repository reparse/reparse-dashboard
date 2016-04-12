
import React       from 'react';
import lodash      from 'lodash';
import Parse       from 'parse';
import AppsManager from 'lib/AppsManager';
import Loader      from 'components/Loader/Loader.react';
import { center }  from 'stylesheets/base.scss';
import Login       from './../auth/Login';
import Dashboard   from './Dashboard';
import config      from './config';
import contants    from './constants';

class Auth extends React.Component {
	constructor() {
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
			return <Login/>;
		}
		return <Dashboard />;
	}
}

module.exports = Auth;
