import AbstractRequestTask from "../../AbstractRequestTask";
import Launcher from '../../../apa/Launcher';

class Avatars extends AbstractRequestTask {

  constructor() {
    super();    
  }

  getParams() {
    const params = super.getParams();    
    return Object.assign({}, params);
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/user/profile/avatars`;
  }

  isValid(data){
    if (data.errors || data.status === 1 || data.response === 'error') {
      return false;
    }

    return true;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default Avatars;
