import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import storage from '../../../components/DeviceStorage/DeviceStorage';
import Launcher from '../../apa/Launcher';
import store from "../../../store";


class RemindControlPin extends AbstractRequestTask {

  constructor() {
    super();
  }

  getHeaders() {
    return {};
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");

    return `${http}${url}/services/user/remindcontrolpin`;
  }

  getParams() {
    const params = super.getParams();
    const user_hash = storage.getItem("user_hash") || "";
    const user = store.getState().user;
    const user_id = user.user_id || "";
    return Object.assign({}, params, { user_hash, user_id });
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default RemindControlPin;
