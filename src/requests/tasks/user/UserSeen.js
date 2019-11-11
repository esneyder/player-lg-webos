
import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import Launcher from '../../apa/Launcher';
import DeviceStorage from '../../../components/DeviceStorage/DeviceStorage';
import store from '../../../store';

class UserSeenTask extends AbstractRequestTask {

  constructor(group_id = "") {
    super();
    this.group_id = group_id;
  }

  getHeaders() {
    return {};
  }

  getUrl() {

    const http = "https://";
    const url = Launcher.get("akamai_mfwk");

    return  `${http}${url}/services/user/seen`;
  }

  getParams() {
    const params = super.getParams();
    const group_id = this.group_id;
    const user_hash =  DeviceStorage.getItem('user_hash');
    const user = store.getState().user;
    const lasttouch = user && user.lasttouch ? user.lasttouch.seen : false;    

    if (lasttouch) {
      params.lasttouch = lasttouch;
    }

    return Object.assign({}, params, { group_id, user_hash });
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default UserSeenTask;
