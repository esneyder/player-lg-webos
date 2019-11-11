import AbstractRequestTask from "../AbstractRequestTask";
import Device from "../../../devices/device";

class ApaMetadataTask extends AbstractRequestTask {
  constructor(region = "") {
    super();

    this.region = region;
  }

  isValid (data){
    return (typeof data == 'object')

  }

  getUrl() {
    //return `http://apa-api-tv2sony-test.clarovideo.net/services/apa/metadata`;
    return `${Device.getDevice().getConfig().end_point_apa}services/apa/metadata`;
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

export default ApaMetadataTask;
