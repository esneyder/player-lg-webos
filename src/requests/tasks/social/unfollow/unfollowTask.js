import AbstractRequestTask from "../../AbstractRequestTask";
import Launcher from '../../../apa/Launcher';

class unfollowTask extends AbstractRequestTask {
  constructor(params) {
      super();
      this.params = params;
  }

  getHeaders() {
    return {};
  }

  getParams() {
    const params =  super.getParams();
    return Object.assign({}, params, this.params );
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/user/unfollow`;
  }

  success(data, b) {
    if(data.status == true) this.resolve(data);  
    else this.reject(data);
  }
  
}

export default unfollowTask;