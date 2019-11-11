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
import Launcher from '../../apa/Launcher';
import DeviceStorage from '../../../components/DeviceStorage/DeviceStorage';
import store from '../../../store';

class UserSeenLastTask extends AbstractRequestTask {

  constructor(group_id = "") {
    super();
    this.group_id = group_id;
  }

  getHeaders() {
    return {};
  }

  getUrl() {

    const http = "https://";
    const url = Launcher.get("akamai_mfwk");

    return  `${http}${url}/services/user/seenlast`;
  }

  getParams() {
    const params = super.getParams();
    const group_id = this.group_id;
    const user_hash =  DeviceStorage.getItem('user_hash');
    const user = store.getState().user;
    const lasttouch = user && user.lasttouch ? user.lasttouch.seen : false;    

    if (lasttouch) {
      params.lasttouch = lasttouch;
    }

    return Object.assign({}, params, { group_id, user_hash });
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default UserSeenLastTask;
