import AbstractRequestTask from "../AbstractRequestTask";
import Device from "../../../devices/device";
import Launcher from '../../apa/Launcher';

class authdeviceTask extends AbstractRequestTask {

    constructor(params) {
      super();
      this.extraparams=params;
    }

    getHeaders() {
        return {};
    }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");

      return `${http}${url}/services/user/authdevice`;
    }

    getParams() {
      const params = super.getParams();
      this.extraparams.serial_id =Device.getDevice().getConfig().serial_id;



      return Object.assign({}, params, this.extraparams);
    }

    success(data, b) {
        this.resolve(data);
    }
}

export default authdeviceTask;
