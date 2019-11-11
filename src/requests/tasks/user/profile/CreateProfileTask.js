import AbstractRequestTask from "../../AbstractRequestTask";
import Launcher from '../../../apa/Launcher';
import Utils from '../../../../utils/Utils';

class CreateProfileTask extends AbstractRequestTask {

  constructor(params = {}) {

    super();    

    this.firstname = params.firstname;
    this.user_image = params.user_image;
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
      user_token: this.user_token,
      user_image: this.user_image
    };
    
    return Object.assign({}, params);
  }

  getQueryStringParams() {

    const superParams = super.getParams();
    let qsParams = Object.assign({}, superParams, { firstname: this.firstname});
    return Utils.buildQueryParams(qsParams);

  }

  getUrl() {
    const http = "http://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/user/profile/create?${ this.getQueryStringParams() }`;
  }

  isValid(data){
    if (data.errors || data.status === 1 || data.response === 'error') {
      return false;
    }

    return true;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default CreateProfileTask;
