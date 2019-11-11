import AbstractRequestTask from "../../AbstractRequestTask";
import getAppConfig from "../../../../config/appConfig";

class userTask extends AbstractRequestTask {
  constructor(params) {
    super();
    this.gamificationId = params.gamificationId;
  }

  getHeaders() {
    return {};
  }

  getParams() {
    return { }
  }

  getUrl() {
    const url = 'https://www.clarovideo.com';
    return `${url}/api/social/user/${this.gamificationId}`;
  }

  success(data, b) {
      return this.resolve(data);
  }

  isValid (data){
      return data && data.status == true || false;
  }
  
}

export default userTask;