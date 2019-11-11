import AbstractRequestTask from "../AbstractRequestTask";
import settings from "../../../devices/all/settings";
import getAppConfig from "../../../config/appConfig";

class AppVersionTask extends AbstractRequestTask {

  getUrl() {
    return `${getAppConfig().end_point_middleware}check-app-version`;
  }

  isValid(data) {

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


}

export default AppVersionTask;
