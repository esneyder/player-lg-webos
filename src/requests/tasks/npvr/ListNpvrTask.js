import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class ListNpvrTask extends AbstractRequestTask {
  constructor(params) {
    super();

    this.params = params;
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/recordings/list`;
  }

  getParams() {
    const params = super.getParams();
    return Object.assign({}, params, this.params);
  }
  
  getShowModal() {
    return false;
  }
}

export default ListNpvrTask;
