import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import storage from '../../../components/DeviceStorage/DeviceStorage';
import Launcher from '../../apa/Launcher';


class GetRememeberContent extends AbstractRequestTask {

  constructor(group_id = '') {
    super();
      this.group_id = group_id;
  }

  getHeaders() {
    return {};
  }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");

      return `${http}${url}/services/user/getremembercontent`;
    }

  getParams() {
    const params = super.getParams();
    const group_id = this.group_id;
    const user_hash = storage.getItem("user_hash") || "";
    return Object.assign({}, params, {group_id, user_hash});
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default GetRememeberContent;
