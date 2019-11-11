import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import storage from '../../../components/DeviceStorage/DeviceStorage';
import Launcher from '../../apa/Launcher';


class ReminderDelete extends AbstractRequestTask {

  constructor(reminder_id = '') {
    super();
      this.reminder_id = reminder_id;
  }

  getHeaders() {
    return {};
  }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");

      return `${http}${url}/services/user/reminder/delete`;
    }

  getParams() {
    const params = super.getParams();
    const reminder_id = this.reminder_id;
    const user_hash = storage.getItem("user_hash") || "";
    return Object.assign({}, params, {reminder_id, user_hash});
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

export default ReminderDelete;
