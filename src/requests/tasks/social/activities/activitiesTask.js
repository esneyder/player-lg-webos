import AbstractRequestTask from "../../AbstractRequestTask";
import getAppConfig from "../../../../config/appConfig";

class activitiesTask extends AbstractRequestTask {
  constructor(params, gamificationId) {
    super();
    this.gamificationId = gamificationId;
    this.params = params;
  }

  getHeaders() {
    return {};
  }

  getParams() {
    const params = {}
    return Object.assign({}, params, this.params );
  }

  getUrl() {
    const url = 'https://www.clarovideo.com';
    return `${url}/api/social/activities/user/${this.gamificationId}`;
  }

  success(data, b) {
    if(data.status == true) this.resolve(data);  
    else this.reject(data);
  }

  isValid (data){
      return data && data.status == true || false;
  }
  
}

export default activitiesTask;