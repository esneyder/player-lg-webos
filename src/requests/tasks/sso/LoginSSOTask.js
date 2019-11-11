import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';
import Utils from '../../../utils/Utils';


class LoginSSOTask extends AbstractRequestTask {
    constructor(params = {}) {
        super();
      this.params = params;
    }

    getHeaders() {
      return {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
    }

    getParams() {
        return this.params;
    }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");
      return `${http}${url}/services/user/loginsso?${this.getQueryStringParams()}`;
    }

    getMethod() {
        return 'POST';
    }

    getQueryStringParams() {
      const baseParams = super.getParams();
      let result = Utils.buildQueryParams(baseParams);
      return result;
    }

}

export default LoginSSOTask;
