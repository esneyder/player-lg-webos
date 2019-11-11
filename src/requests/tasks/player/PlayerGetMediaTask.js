import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';
import Device from '../../../devices/device';
import Utils from '../../../utils/Utils';
import UtilsProfile from '../../../utils/Profile';
import {PLY_PLY_00009,PLY_PLY_00001} from '../../../AAFPlayer/constants';
// Sending info to the dashboard
import TrackerManager from '../../../utils/TrackerManager';
import DashboardTracker from "../../../utils/trackers/DashboardTracker";
import AkamaiTracker from "../../../utils/trackers/AkamaiTracker";
import PlayerTracker from "../../../utils/trackers/PlayerTracker";
import store from '../../../store';

class PlayerGetMediaTask extends AbstractRequestTask {
  constructor(groupId = "", contentId = "", isTrailer = false, stream_type = "", startTime = "", endTime = "", payway_token = "", showErrorModal) {
    super();
    console.log('Veamos media1 ', groupId, payway_token);

    let device_config = Device.getDevice().getConfig();
    const user = store.getState().user;
    this.player = Device.getDevice().getPlayer();
    this.groupId = groupId;
    this.contentId = contentId;
    this.isTrailer = isTrailer;
    this.stream_type = stream_type ? stream_type : device_config && device_config.stream_type ? device_config.stream_type : 'smooth_streaming';
    this.startTime = startTime ? Utils.getClaroUnixEpochTime(startTime) : '';
    this.endTime = endTime ? Utils.getClaroUnixEpochTime(endTime) : '';
    this.payway_token = payway_token ? payway_token : false;
    this.user_token = user && user.user_token ? user.user_token : false;
    this.showErrorModal = showErrorModal;
    this.isProfilesConfigEnable = UtilsProfile.isProfilesConfigEnable(user);
    console.log('Veamos media2 ', groupId, this.payway_token);
    //this.payway_token = false;
  }

  /* getTrackerManager() {
    const dashboardTracker = new DashboardTracker();

    return new TrackerManager([ dashboardTracker ]);
  }*/

  getEncType() {
    if (this.getMethod() === 'POST') {
      return 'application/x-www-form-urlencoded';
    }
    else {
      return super.getEncType();
    } 
  }

  getShowErrorModal(){
    return this.showErrorModal;
  }

  getRetriesNumber(){
    if(this.showErrorModal){
      return 2;
    }else{
      return 4;
    }
  }

  getShowModal() {
    if (this.getMethod() === 'POST') {
      return false;
    }
    else {
      return super.getShowModal();
    }
  }

  getUrl() {
    const http = "https://";
    let url = Launcher.get("akamai_mfwk");
    if (this.getMethod() === 'POST') {
      let _url = `${http}${url}/services/player/getmedia?`;
      _url += Utils.buildQueryParams(this.getGETParams());
      return _url;
    }
    else {
      return `${http}${url}/services/player/getmedia`;
    }
  }

  getMethod() {    
    //https://dlatvarg.atlassian.net/browse/STV-7687
    //Ahora TODAS las llamadas a PGM deben ir por POST
    return 'POST';

    /*
    if (this.isProfilesConfigEnable && this.user_token && this.payway_token) {
      //Perfiles      
      return 'POST';
    }
    else if (!this.isProfilesConfigEnable && this.payway_token) {
      //Timeshift Pau
      return 'POST';
    }
    else {
      return 'GET';
    }
    */
  }

  getParams() {
    if (this.getMethod() === 'POST') {
      
      const params = {};

      if (this.user_token) {
        params.user_token = this.user_token;
      }
      if (this.payway_token) {
        params.payway_token = this.payway_token;
      }

      return params;
    }
    else {
      return  this.getGETParams();
    }
  }

  getGETParams() {
    const params = super.getParams();
      return  {
          group_id: this.groupId,
          content_id: this.contentId,
          stream_type: this.stream_type,
          preview: this.isTrailer ? "1" : "0",
          startTime: this.startTime,
          endTime: this.endTime,
          ...params
      };
  }

  success(data, b) {
    this.resolve(data);
  }

  isValid(data) {
    if(data.errors && data.errors[0] && data.errors[0].code){
      if(data.errors[0].code!= PLY_PLY_00009 && data.errors[0].code!= PLY_PLY_00001 ){
        data.url=this.getUrl();
        TrackerManager.playerGetMedia(data);
      }
    }else{
      TrackerManager.setup(data);
      TrackerManager.playerGetMedia();
    }

    //TODO Partial fix for SAMSUNG HIBRIDAS, WE NEED TO IMPROVE move after PAU fix
    console.log(data);
    if(data &&data.response && data.response.media && data.response.media.server_url)
    {
      if(Device.getDevice().getPlatform()=='samsung' && !this.isHBO(data) && !this.isFOXV3(data)) {
        data.response.media.server_url = data.response.media.server_url.replace('https:', 'http:');
      }
    }
    //TODO Partial fix for SAMSUNG HIBRIDAS, WE NEED TO IMPROVE move after PAU fix
    return true;
  }

  isHBO(data) {
    if (data.response &&
      data.response.group &&
      data.response.group.common &&
      data.response.group.common.extendedcommon &&
      data.response.group.common.extendedcommon.media &&
      data.response.group.common.extendedcommon.media.proveedor &&
      data.response.group.common.extendedcommon.media.proveedor.nombre) {
      return data.response.group.common.extendedcommon.media.proveedor.nombre === 'HBO';
    }
    return false;
  }

  isFOXV3(data) {
    if (data.response &&
      data.response.group &&
      data.response.group.common &&
      data.response.group.common.extendedcommon &&
      data.response.group.common.extendedcommon.media &&
      data.response.group.common.extendedcommon.media.proveedor &&
      data.response.group.common.extendedcommon.media.proveedor.codigo) {
      return data.response.group.common.extendedcommon.media.proveedor.codigo === 'foxv3';
    }
    return false;

  }

  getHeaders() {
    if (!this.method === 'POST') {
      return {
        'Access-Control-Allow-Origin': '*'
      };
    }
    else {
      return {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
    }
  }
}

export default PlayerGetMediaTask;
