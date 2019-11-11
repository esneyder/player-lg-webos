import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class CounterValidEmailTask extends AbstractRequestTask {
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
        return `${http}${url}/services/user/countervalidemail`;
    }
}

export default CounterValidEmailTask;
