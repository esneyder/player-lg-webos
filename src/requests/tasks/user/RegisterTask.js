import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import Launcher from '../../apa/Launcher';


class RegisterTask extends AbstractRequestTask {
    constructor(params = {}) {
        super();
        this.ownParams = params;
    }

    getParams() {
        const params = super.getParams();
        return Object.assign({}, params, this.ownParams);
    }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");

      return `${http}${url}/services/user/register`;
    }

}

export default RegisterTask;
