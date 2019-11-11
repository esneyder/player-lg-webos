import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';
import storage from '../../../components/DeviceStorage/DeviceStorage';

class ModifyUserTask extends AbstractRequestTask {
    constructor(params = {}) {
        super();
        this.ownParams = params;
    }

    getParams() {
        const params = super.getParams();
        this.ownParams.user_hash = storage.getItem("user_hash") || "";
        return Object.assign({}, params, this.ownParams);
    }

    getUrl() {
        const http = "https://";
        const url = Launcher.get("akamai_mfwk");
        return `${http}${url}/services/user/modify`;
    }
}

export default ModifyUserTask;
