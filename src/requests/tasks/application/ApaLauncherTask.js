import AbstractRequestTask from "../AbstractRequestTask";
import getAppConfig from '../../../config/appConfig';
import Device from "../../../devices/device";

class ApaLauncherTask extends AbstractRequestTask {

  getUrl() {
    return `${Device.getDevice().getConfig().end_point_apa}services/apa/launcher`;
  }

  getParams() {
    const defaultParams = super.getParams();
    const appConfig = getAppConfig();
    const params = {
      osversion: appConfig.osversion,
      appversion: appConfig.appversion,
      device_name: appConfig.device_name,
      launcher_key: 'launcher_config',
      launcher_subkey: Device.getDevice().getConfig().appSubkey || 'generic',
    };
    if(appConfig.appKey)
      params.sessionKey = appConfig.appKey
    if(appConfig.appversion)
      params.appversion = appConfig.appversion;
    if(appConfig.firmwareversion)
      params.firmwareversion = appConfig.firmwareversion;

    return Object.assign({}, defaultParams, params);
  }

  success(data, b) {
    this.resolve(data);
  }

  parseErrors(err) {
    let supererrors = super.parseErrors(err);
    let response = Object.assign({ response: err.response }, supererrors);
    //console.error("[ApaLauncherTask] parseErrors", response);
    return response;
  }
}

export default ApaLauncherTask;
