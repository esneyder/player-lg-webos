import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';
import getAppConfig from "../../../config/appConfig";
import DeviceStorage from '../../../components/DeviceStorage/DeviceStorage'
import Metadata from "../../apa/Metadata";
import store from '../../../store';

class LevelUserTask extends AbstractRequestTask {
  constructor(uri, params = {}, node = "", user_status = '') {
    super();

    this.uri = uri;
    this.params = params;
    //this._node = node;
    //this._user_status = user_status;
  }

  APAFilters(){
    let filters=Metadata.get("byr_filterlist_configuration");
    let region=DeviceStorage.getItem("region");

    try{
      filters=JSON.parse(filters);
      if(filters)
        filters=filters[region];
      if(filters)
      {
        filters=filters['filterlist'];
      }
      if(filters) {
        return filters

      }
    }
    catch(e)
    {
      return null
    }
    return null
  }

  getHeaders() {
    return {};
  }

  getUrl() {
    return getAppConfig().end_point_middleware + this.uri;
  }

  getParams() {
    let params = super.getParams();
    let APA =this.APAFilters();;
    if(APA){
      let filterList={}
      filterList['filterlist']=APA;
      params=Object.assign(filterList,params);
    }

    //Se agrega parametro adicional
    const user = store.getState().user;
    const lasttouch = user && user.lasttouch ? user.lasttouch.seen : false;
    const user_hash = (user && user.session_userhash) || null;
    
    if (lasttouch) {
      params.lasttouch = lasttouch;
    }
    if (user_hash) {
      params.user_hash = user_hash;
    }

    return Object.assign({}, params, this.params);
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default LevelUserTask;
