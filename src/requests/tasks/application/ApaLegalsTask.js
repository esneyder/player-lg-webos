import AbstractRequestTask from "../AbstractRequestTask";
import Device from "../../../devices/device";

class ApaLegalsTask extends AbstractRequestTask {
  constructor(region = "") {
    super();

    this.region = region;
  }

  getUrl() {
    //return `http://apa-api-tv2sony-test.clarovideo.net/services/apa/metadata`;
    return `${Device.getDevice().getConfig().end_point_apa}services/apa/metadata`;
  }

  getParams() {
    const params = super.getParams();

    const appKey = "d48c48c956cda082e2e03b717c81c220";
    const region = this.region || params.region;
    const sessionKey = `${appKey}-${region}`;

    return Object.assign({}, params, { sessionKey } );
  }

  isValid(data = null) {
    return !!data;
  }

  getRetriesNumber(){
    return 3;
  }

  success(data, b) {
    this.resolve(data);
  }

  getShowModal(){
    return null;
  }
}

export default ApaLegalsTask;
