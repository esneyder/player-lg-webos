import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class ListNpvrFromUrlTask extends AbstractRequestTask {
  constructor(params,url) {
    super();

    this.params = params;
    this.url=url;
  }

  getUrl() {
    if(this.url){
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");
      return `${http}${url}${this.url}`;
    }

    else {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");
      return `${http}${url}/services/recordings/list`;
    }
  }

  getParams() {
    const params = super.getParams();
    return Object.assign({}, params, this.params);
  }

  getShowModal() {
    return false;
  }
}

export default ListNpvrFromUrlTask;
