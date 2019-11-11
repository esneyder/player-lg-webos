import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from "../../apa/Launcher";

class ChannelsTask extends AbstractRequestTask {
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

    return `${http}${url}/services/content/list`;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default ChannelsTask;
