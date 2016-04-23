
import ParseApp from 'lib/ParseApp';
import config   from './config';
import contants from './constants';

const rawAdminApp = _.cloneDeep(config.adminApp);
rawAdminApp.appName = contants.ADMIN_APP_NAME;

export default (new ParseApp(rawAdminApp));
