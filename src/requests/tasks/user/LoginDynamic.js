import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import storage from '../../../components/DeviceStorage/DeviceStorage';
import Launcher from '../../apa/Launcher';


class LoginDynamic extends AbstractRequestTask {
  constructor(email = '') {
    super();
    this.email = email;
  }

  getHeaders() {
    return {};
  }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");

      return `${http}${url}/services/user/logindynamic`;
    }

  getParams() {
    const params = super.getParams();
    const email = this.email;
    return Object.assign({}, params, {email});
  }

  isValid(data){
    if (!data.response) {
      return false;
    }
    return true;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default LoginDynamic;
