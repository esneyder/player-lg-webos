import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';
import store from "../../../store";

class StatusControlPinTask extends AbstractRequestTask {
  constructor(params) {
    super();
    this.ownParams = params;
  }

  getParams() {
    const params = super.getParams();
    const user = store.getState().user;
    const user_id = user.user_id || "";
    return Object.assign({}, params, { user_id, ...this.ownParams });
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");

    return `${http}${url}/services/user/controlpin/status`;
  }

}

export default StatusControlPinTask;
