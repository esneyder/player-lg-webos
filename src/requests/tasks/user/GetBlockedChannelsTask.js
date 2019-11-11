import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import storage from '../../../components/DeviceStorage/DeviceStorage';
import Launcher from '../../apa/Launcher';
import store from "../../../store";


class GetBlockedChannels extends AbstractRequestTask {

  constructor() {
    super();
  }

  getHeaders() {
    return {};
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");

    return `${http}${url}/services/user/controlpin/channels/list`;
  }

  getParams() {
    const params = super.getParams();
    const user = store.getState().user;
    const user_id = user.user_id || "";
    const user_hash = storage.getItem("user_hash") || "";
    return Object.assign({}, params, { user_id, user_hash });
  }

  isValid(data) {
    if (data.errors || data.status == 1 || data.response === 'error') {
      return false;
    }
    return true;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default GetBlockedChannels;
