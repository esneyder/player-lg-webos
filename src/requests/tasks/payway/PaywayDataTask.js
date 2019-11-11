import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class PaywayDataTask extends AbstractRequestTask {
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
        return `${http}${url}/services/payway/data`;
    }

    success(data, b) {
        this.resolve(data);
    }
}

export default PaywayDataTask;
