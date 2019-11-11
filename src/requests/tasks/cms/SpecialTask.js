import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import Launcher from '../../apa/Launcher';

class SpecialTask extends AbstractRequestTask {

    constructor(special = "", user_status = '') {
        super();
        this._special = special;
        this._user_status = user_status;
    }

    getHeaders() {
        return {};
    }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");

      return `${http}${url}/services/cms/special`;
    }

    getParams() {
        const params = super.getParams();
        const special = this._special;
        const user_status = this._user_status;

        return Object.assign({}, params, { special, user_status });
    }

    success(data, b) {
        this.resolve(data);
    }
}

export default SpecialTask;
