import AbstractRequestTask from "../AbstractRequestTask";
import Device from "../../../devices/device";

class ApaAssetTask extends AbstractRequestTask {
  constructor(region = "") {
    super();

    this.region = region;
  }

  getUrl() {
    //return `http://apa-api-tv2sony-test.clarovideo.net/services/apa/asset`;
    return `${Device.getDevice().getConfig().end_point_apa}services/apa/asset`;
  }

  getParams() {
    const params = super.getParams();

    const appKey = Device.getDevice().getConfig().appKey;
    const region = this.region || params.region;
    const sessionKey = `${appKey}-${region}`;

    return Object.assign({}, params, { sessionKey } );
  }

  isValid(data = null) {
    return !!data;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default ApaAssetTask;
