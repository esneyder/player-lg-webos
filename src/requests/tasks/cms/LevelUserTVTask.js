import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class LevelUserTVTask extends AbstractRequestTask {
  constructor(uri, params) {
    super();

    this.uri = uri;
    this.params = params;
  }

  getHeaders() {
    return {};
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");

    return http + url + this.uri;
  }

  getParams() {
    const params = super.getParams();

    return Object.assign({}, params, this.params);
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default LevelUserTVTask;
