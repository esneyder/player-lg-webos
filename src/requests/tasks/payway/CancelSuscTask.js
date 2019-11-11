import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class CancelSuscTask extends AbstractRequestTask {
  constructor(params) {
    super();

    this.params = params;
  }

  getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");
      return `${http}${url}/services/payway/cancelsuscription`;
  }

  getParams() {
    const params = super.getParams();
    return {
      ...this.params,
      ...params,
    };
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default CancelSuscTask;
