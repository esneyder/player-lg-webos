import AbstractRequestTask from "../../AbstractRequestTask";
import Launcher from "../../../apa/Launcher";

class userTask extends AbstractRequestTask {
  constructor(params) {
    super();
    this.gamificationId = params.gamificationId;
  }

  getHeaders() {
    return {};
  }

  getParams() {
    const params =  super.getParams();
    return Object.assign({}, params, { gamification_id: this.gamificationId });
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");

    return `${http}${url}/services/user/seen`;
  }

  success(data, b) {
    if(data.status == true) this.resolve(data);
    else this.reject(data);
  }

}

export default userTask;
