import AbstractRequestTask from "../AbstractRequestTask";
import Device from "../../../devices/device";
import Launcher from '../../apa/Launcher';

class SmartCardLogin extends AbstractRequestTask {

    getHeaders() {
        return {};
    }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");

      return `${http}${url}/services/user/smartcardlogin`;
    }

    getParams() {
      const params = super.getParams();
      const smartcard = Device.getDevice().getConfig().smartcardId;

      return Object.assign({}, params, { smartcard });
    }

    success(data, b) {
        this.resolve(data);
    }
}

export default SmartCardLogin;
