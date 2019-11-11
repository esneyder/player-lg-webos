import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class AttachTask extends AbstractRequestTask {
  constructor(groupId = "", css = 0) {
    super();
    this.groupId = groupId;
    this.css = css;
  }

  /*
  * This service must be call just with logged users
  */
  getUrl() {
    const protocol = "https://";
    const url = Launcher.get("akamai_mfwk");
    return `${protocol}${url}/services/device/attach`;
  }

  getParams() {
    const params = super.getParams();
    const otherParams = {
      css: this.css,
      group_id: this.groupId,
    };

    return { ...params, ...otherParams };
  }

  getShowModal(){
    return false;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default AttachTask;
