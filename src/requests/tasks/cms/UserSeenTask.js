//"http://mfwktv2sony-api.clarovideo.net/services/user/seen
//  ?user_hash=MjM0MzE5NjR8MTUwNDczMjUyNXxlZmI3ODNmMWUzM2M5YjBiMzU3Yjc0MzIxNDYzZjUwMjA0OTJiOWQwYmUyZDEzMWFiYw%3D%3D
//  &filterlist=31032%2C30978
//  &region=mexico
//  &device_manufacturer=sony
//  &device_model=sony
//  &device_category=tv
//  &device_type=Workstation
//  &api_version=v5.6
//  &format=json
//  &authpn=amco
//  &authpt=12e4i8l6a581a
//  &HKS=(ejo9g16ovtl4m4a178ca6dg9a3)"
import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import store from '../../../store';

import Launcher from '../../apa/Launcher';

class UserSeenTask extends AbstractRequestTask {

  constructor(filterlist = "") {
    super();
    this._filterlist = filterlist;
  }

  getHeaders() {
    return {};
  }

  getUrl() {

    const http = "https://";
    const url = Launcher.get("akamai_mfwk");

    return  `${http}${url}/services/user/seen`;
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

    //Aqui se agrega el parametro last touch

    const params = super.getParams();
    const filterlist = this._filterlist;
    const user = store.getState().user;
    const lasttouch = user && user.lasttouch ? user.lasttouch.seen : false;

    if (lasttouch) {
      params.lasttouch = lasttouch;
    }

    return Object.assign({}, params, { filterlist });
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default UserSeenTask;
