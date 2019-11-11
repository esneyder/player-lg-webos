import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import Utils from '../../../utils/Utils';
import Launcher from '../../apa/Launcher';


class ShowCaptchaTask extends AbstractRequestTask {
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

      return `${http}${url}/services/user/showcaptcha`;
    }

    getImageUrl(){
        return `${this.getUrl()}?${Utils.buildQueryParams(this.getParams())}`
    }
}


export default ShowCaptchaTask;
