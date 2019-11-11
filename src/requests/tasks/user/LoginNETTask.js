import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import Utils from '../../../utils/Utils';
import Launcher from '../../apa/Launcher';


class LoginNETTask extends AbstractRequestTask {
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
            'Content-type': 'application/x-www-form-urlencoded'
        };
    }

    getEncType() {
        return 'multipart/form-data';
    }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");

      return `${http}${url}/services/user/net/auth?${Utils.buildQueryParams(super.getParams())}`;
    }

}

export default LoginNETTask;
