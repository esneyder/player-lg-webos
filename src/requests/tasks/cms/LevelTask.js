import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class LevelTask extends AbstractRequestTask {

    constructor(node = "", user_status = '') {
        super();
        this._node = node;
        this._user_status = user_status;
    }

    getHeaders() {
        return {};
    }

    getUrl() {
        const http = "https://";
        const url = Launcher.get("akamai_mfwk");

        return `${http}${url}/services/cms/level`;
    }

    getParams() {
      /*
  if (url.indexOf('cms/') >= 0) {
  if (sUser.isLoggedIn() == false) {
  url = url + "&user_status=anonymous";
} else if ((sUser.isLoggedIn() == true && sUser.hasSubscription() == true) || (sUser.isLoggedIn() == true && sUser.get('hasSavedPayway') == "1")) {
  url = url + "&user_status=susc";
} else {
  url = url + "&user_status=no_susc";
}
}
*/

        const params = super.getParams();

        const node = this._node;
        const user_status = this._user_status;

        return Object.assign({}, params, { node, user_status });
    }

    success(data, b) {
        this.resolve(data);
    }
}

export default LevelTask;
