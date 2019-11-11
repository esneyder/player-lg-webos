import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from "../../apa/Launcher";
import DeviceStorage from "../../../components/DeviceStorage/DeviceStorage";

class EpgVersionTask extends AbstractRequestTask {

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/epg/version`;
    //return "http://10.7.1.205:6001/epg/version";
  }

  isValid(data) {

  }

  getParams() {
    const defaultParams = super.getParams();
    const subregion = DeviceStorage.getItem("sub_region");
    const soa_version = DeviceStorage.getItem('soaVersion');
    const app_version = DeviceStorage.getItem('appVersion');
    const epg_version = DeviceStorage.getItem('epgVersion');;
    const params =  Object.assign({}, defaultParams, {subregion, soa_version, app_version, epg_version})
    return params;
  }

  success(data, b) {
    this.resolve(data);
  }


  parseErrors(err) {
    console.log('Parser errors en appVersion');
  }

  isValid(data) {
    return data;
  }

  getRetriesNumber(){
    return 0;
  }


}

export default EpgVersionTask;
