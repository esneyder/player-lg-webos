import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class SeriesAddNpvrTask extends AbstractRequestTask {
  constructor({ channelId, eventId, userToken, userLimit, }) {
    super();

    this.params = {
      event_id: eventId,
      channel_id: channelId,
      user_token: userToken,
      user_limit: userLimit,
    }
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/recordings/series/add`;
  }

  getParams() {
    const params = super.getParams();
    return { ...params, ...this.params };
  }
}

export default SeriesAddNpvrTask;
