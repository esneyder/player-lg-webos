import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class SetTermsAndConditionsTask extends AbstractRequestTask {
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

        if (this.uri) {
            return `${this.uri}`;
        }
        else {
            //Este caso es desde el login
            const http = "http://";
            const url = Launcher.get("akamai_mfwk");

            return `${http}${url}/services/user/settermsandconditions`;
        }
        
    }
}

export default SetTermsAndConditionsTask;
