





import AbstractRequestTask from "../../AbstractRequestTask";
import Launcher from '../../../apa/Launcher';

class ReadProfile extends AbstractRequestTask {

  constructor(params) {
    super();
    this.params = params;    
  }

  getParams() {
    const params = super.getParams();
    return Object.assign({}, params, this.params);
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/user/profile/read`;
  }

  isValid(data) {

    if (data.errors || data.status === 1 || data.response === 'error') {
      return false;
    }

    return true;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default ReadProfile;
