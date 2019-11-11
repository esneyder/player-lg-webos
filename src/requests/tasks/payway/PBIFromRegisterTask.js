import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class PBIFromRegisterTask extends AbstractRequestTask {
  constructor(params) {
    super();

    this.params = params;
  }

  getUrl() {    
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");
      return `${http}${url}/services/payway/purchasebuttoninfo`;
  }

  getParams() {
    const params = super.getParams();
    return {
        object_type: this.params.object_type,
      ...params,
    };
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default PBIFromRegisterTask;
