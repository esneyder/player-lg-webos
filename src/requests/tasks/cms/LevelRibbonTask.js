import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';
import getAppConfig from "../../../config/appConfig";

class LevelRibbonTask extends AbstractRequestTask {
  constructor(uri, params) {
    super();

    this.uri = uri;
    this.params = params;
    if (this.params.node_id === null) {
      delete this.params.node_id;
    }
  }

  getHeaders() {
    return {};
  }

  getUrl() {
    return getAppConfig().end_point_middleware + this.uri;
    //return 'http://10.7.0.83:4000/webapi-video/level'
  }

  getParams() {
    const params = super.getParams();

    return Object.assign({}, params, this.params);
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default LevelRibbonTask;
