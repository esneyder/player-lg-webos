import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';
import DeviceStorage from '../../../components/DeviceStorage/DeviceStorage';

class IsLoggedIn extends AbstractRequestTask {

  constructor(includpaywayprofile = false) {
    super();
    this._includpaywayprofile = includpaywayprofile
  }

  getHeaders() {
    return {};
  }

  getParams() {
    const params = super.getParams();
    const includpaywayprofile = this._includpaywayprofile;
    const user_id = DeviceStorage.getItem('user_id') || '';
    return Object.assign({}, params, { includpaywayprofile, user_id});
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/user/isloggedin`;
  }

  isValid(data){
    if (!data.response || data.response.is_user_logged_in === undefined) {
      return false;
    }
    return true;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default IsLoggedIn;
