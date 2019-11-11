import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';
import store from '../../../store';
import Utils from '../../../utils/Utils';

class PushSessionTask extends AbstractRequestTask {
  constructor(user_id) {
    super();
    this.user_id = user_id;
  }

  getHeaders() {
    return {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
  }

  getParams() {
    
    const userData = store && store.getState().user;    
    const user_session = userData && userData.user_session ? userData.user_session : null;
    return Object.assign({}, {user_session});
  }


  getQueryStringParams() {

    const baseParams = super.getParams();
    let parms = Object.assign({}, baseParams, { user_id : this.user_id });
    let result = Utils.buildQueryParams(parms);

    return result;
  }

  getMethod() {
    return 'POST';
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/user/push_session?${this.getQueryStringParams()}`;
  }

  success(data, b) {
    this.resolve(data);
  }

}

export default PushSessionTask;
