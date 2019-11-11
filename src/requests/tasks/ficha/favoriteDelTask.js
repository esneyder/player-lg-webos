import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class favoriteDelTask extends AbstractRequestTask {
  constructor(parameters) {
    super();
    this.customParameters = parameters;
  }

  getHeaders() {
    return {};
  }

  getParams() {
    const params = super.getParams();
    return Object.assign({}, params, this.customParameters );
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/user/favoritedel`;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default favoriteDelTask;