import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class LinealChannelsTask extends AbstractRequestTask {
    constructor(userId) {
        super();
        this.userId = userId;
    }

    getParams() {
        const params = super.getParams();
        const user_id = this.userId || null;
        return Object.assign({}, params, { user_id });
    }

    getUrl() {
        const http = "https://";
        const url = Launcher.get("akamai_mfwk");
        return `${http}${url}/services/payway/linealchannels`;
    }

    success(data, b) {
        this.resolve(data);
    }
}

export default LinealChannelsTask;
