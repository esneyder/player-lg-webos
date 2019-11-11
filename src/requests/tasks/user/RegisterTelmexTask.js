import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class RegisterTelmexTask extends AbstractRequestTask {
    constructor(uri, params = {}) {
        super();
        this.uri = uri;
        this.params = params;
    }

    getParams() {
        const params = super.getParams();
        return Object.assign({}, params, this.params);
    }

    getUrl() {
        return `${this.uri}`;
    }

    success(data, b) {
        this.resolve(data);
    }

}

export default RegisterTelmexTask;
