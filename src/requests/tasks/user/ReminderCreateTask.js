import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import storage from '../../../components/DeviceStorage/DeviceStorage';
import Launcher from '../../apa/Launcher';


class ReminderCreate extends AbstractRequestTask {

  constructor(event_id = '', exp_date ='', type ='', channel_id) {
    super();
      this.event_id = event_id;
      this.exp_date = exp_date;
      this.type = type;
      this.channel_id = channel_id;
  }

  getHeaders() {
    return {};
  }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");

      return `${http}${url}/services/user/reminder/create`;
    }

  getParams() {
    const params = super.getParams();
    const event_id = this.event_id;
    const exp_date = this.exp_date;
    const type = this.type;
    const channel_id = this.channel_id;
    const user_hash = storage.getItem("user_hash") || "";
    return Object.assign({}, params, {event_id, user_hash, exp_date, type, channel_id});
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

export default ReminderCreate;
