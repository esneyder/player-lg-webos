import AbstractRequestTask from "../AbstractRequestTask";
import getAppConfig from "../../../config/appConfig";
import Utils from "../../../utils/Utils";
import LocalStorage from "../../../components/DeviceStorage/LocalStorage";

class EpgTask extends AbstractRequestTask {
  constructor(parameters) {
    super();
    this.customParameters = parameters;
  }
  isValid(data)
  {

    if(data.errors) {
        data.body = [];
        data.channels = [];
        data.channelsRender = [];
        return false;
    }

    return data.body?true:false;
  }

  getHeaders() {
    return {};
  }

  getParams() {
    const params = super.getParams();
    let now = Utils.now(true);
    //TODO mejor tecnica para este redondeo
    const time = now.toObject();
    time.minutes        -=(time.minutes%15);
    now=now.format('YYYYMMDDHHmmss');
    now=now.substring(0,now.length-4)+(time.minutes=='0'?"00":time.minutes.toString())+"00";

    Object.assign(this.customParameters,{
      event_image: Utils.getToggleFunctionsFromMetadata().event_image_from_epg,
      epg_version: LocalStorage.getItem('epgVersion') || false,
      soa_version: LocalStorage.getItem('soaVersion') || false,
    });
    //TODO mejor tecnica para este redondeo
    return { ...params, ...this.customParameters, now };
  }

  getUrl() {
    return `${getAppConfig().end_point_middleware}epg`;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default EpgTask;
