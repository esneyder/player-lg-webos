import AbstractRequestTask from "../AbstractRequestTask";
import Device from "../../../devices/device";
import getAppConfig from "../../../config/appConfig";

class BadgesTask extends AbstractRequestTask {
  constructor(region = "") {
    super();

    this.region = region;
  }

  isValid (data){
    return (typeof data == 'object')
  }

  getUrl() {
    return getAppConfig().end_point_middleware + 'badges';
  }

  getParams() {
    const params = super.getParams();

    const appKey = Device.getDevice().getConfig().appKey;
    const region = this.region || params.region;
    const sessionKey = `${appKey}-${region}`;

    const newParams = {
      sessionKey,
      region
    };

    return Object.assign({}, params, newParams);
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default BadgesTask;
