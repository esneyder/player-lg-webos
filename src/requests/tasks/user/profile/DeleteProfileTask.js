import AbstractRequestTask from "../../AbstractRequestTask";
import Launcher from '../../../apa/Launcher';
import Utils from '../../../../utils/Utils';

class DeleteProfileTask extends AbstractRequestTask {

  constructor(params) {
    super();    
    this.gamification_id = params.gamification_id;
    this.user_token = params.user_token;
  }

  getMethod() {
    return "POST";
  }

  getHeaders() {
    return {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
  }

  getParams() {

    const params = {
      user_token: this.user_token
    };

    return Object.assign({}, params);
  }

  getQueryStringParams() {

    const superParams = super.getParams();
    let qsParams = Object.assign({}, superParams, { gamification_id: this.gamification_id });
    return Utils.buildQueryParams(qsParams);

  }

  getUrl() {
    const http = "http://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/user/profile/delete?${this.getQueryStringParams()}`;
  }


  isValid(data) {
    if (data.errors || data.status === 1 || data.response === 'error') {
      return false;
    }

    return true;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default DeleteProfileTask;
