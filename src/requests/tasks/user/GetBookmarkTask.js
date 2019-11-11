import AbstractRequestTask from "../AbstractRequestTask";
import device from "../../../devices/device";
import storage from '../../../components/DeviceStorage/DeviceStorage';
import Launcher from '../../apa/Launcher';
import Utils from "../../../utils/Utils";
import store from '../../../store';


class GetBookmark extends AbstractRequestTask {

  constructor(group_id = '') {
    super();
    this._group_id = group_id;
  }

  getHeaders() {
    return {};
  }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");

      return `${http}${url}/services/user/getbookmark`;
    }

  getParams() {
    const params = super.getParams();
    const group_id = this._group_id;
    const user_hash = storage.getItem("user_hash") || "";
    const user = store.getState().user;
    const lasttouch = user && user.lasttouch ? user.lasttouch.seen : false;

    if (lasttouch) {
      params.lasttouch = lasttouch;
    }
    // Solo en esta api es filter_list y no  filterlist como en las demas
    //https://dlatvarg.atlassian.net/wiki/spaces/GCV/pages/267059977/user+getbookmark?focusedCommentId=621510829#comment-621510829
    const filter_list = Utils.getAPAFilterList();

    return Object.assign({}, params, { group_id, user_hash, filter_list });
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default GetBookmark;
