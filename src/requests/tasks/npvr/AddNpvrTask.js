import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class AddNpvrTask extends AbstractRequestTask {
  constructor({ user_token, event_id, channel_id, payway_token }) {
    super();

    this.user_token = user_token;
    this.event_id = event_id;
    this.channel_id = channel_id;
    this.payway_token = payway_token;
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/recordings/add`;
  }

  getParams() {
    const params = super.getParams();
    const extraParams = {
      user_token: this.user_token,
      event_id: this.event_id,
      channel_id: this.channel_id,
      payway_token: this.payway_token,
    };

    return { ...params, ...extraParams };
  }
}

export default AddNpvrTask;
