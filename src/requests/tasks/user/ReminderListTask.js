import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import storage from '../../../components/DeviceStorage/DeviceStorage';
import Launcher from '../../apa/Launcher';


class ReminderList extends AbstractRequestTask {

  constructor(event_id = '') {
    super();
      this.event_id = event_id;
  }

  getHeaders() {
    return {};
  }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");

      return `${http}${url}/services/user/reminder/list`;
    }

  getParams() {
    const params = super.getParams();
    const event_id = this.event_id;
    const user_hash = storage.getItem("user_hash") || "";
    return Object.assign({}, params, {event_id, user_hash});
  }

  success(data, b) {
    this.resolve(data);
  }

    isValid(data) {
        if (data.errors || data.status === 1 || data.response === 'error') {
            return false;
        }

        return true;
    }
}

export default ReminderList;
