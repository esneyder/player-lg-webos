import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import Utils from '../../../utils/Utils';
import Launcher from '../../apa/Launcher';


class Login360Task extends AbstractRequestTask {
    constructor(params = {}) {
        super();
        this.ownParams = params;
    }

   getParams() {
        return this.ownParams;
    }

    getMethod() {
        return 'POST';
    }

    getHeaders() {
        return {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
    }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");

      return `${http}${url}/services/user/threesixty/auth?${Utils.buildQueryParams(super.getParams())}`;
    }

}

export default Login360Task;
