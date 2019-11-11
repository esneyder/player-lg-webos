import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import storage from '../../../components/DeviceStorage/DeviceStorage';
import Launcher from '../../apa/Launcher';

class MyContentTask extends AbstractRequestTask {

  constructor(filterlist = '') {
    super();
    this._filterlist = filterlist
  }

  getHeaders() {
    return {};
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");

    return `${http}${url}/services/user/favorited`;
  }

  getParams() {
    const params = super.getParams();
    const filterlist = this._filterlist;
    const user_hash = storage.getItem("user_hash") || "";

    return Object.assign({}, params, { filterlist, user_hash });
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default MyContentTask;
