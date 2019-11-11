import AbstractRequestTask from "../AbstractRequestTask";
import Device from "../../../devices/device";
import storage from '../../../components/DeviceStorage/DeviceStorage';
import Launcher from '../../apa/Launcher';


class DeleteFavorite extends AbstractRequestTask {

  constructor(object_id = '') {
    super();
    this._object_id = object_id;
  }

  getHeaders() {
    return {};
  }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");

      return `${http}${url}/services/user/favoritedel`;
    }

  getParams() {
    const params = super.getParams();
    const object_id = this._object_id;
    const user_hash = storage.getItem("user_hash") || "";
    const device_id = Device.getDevice().getConfig().device_id;
    const object_type = 1;
    return Object.assign({}, params, { object_id, user_hash, device_id, object_type });
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default DeleteFavorite;
