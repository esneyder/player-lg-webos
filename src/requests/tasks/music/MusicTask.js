import AbstractRequestTask from "../AbstractRequestTask";
import getAppConfig from '../../../config/appConfig';
import device from "../../../devices/device";

class MusicTask extends AbstractRequestTask {

  constructor(service = "", user, params, headers) {
    super();
    this._config = getAppConfig();
    this._service = service;
    this._user = user;
    this.method = params.method
    this._params = {...params, token: user.token, userId: user.id, deviceId: user.deviceId,type: user.type};
    this._headers = headers || {}
  }

  getMethod() {
    if(this.method)
      return this.method
    return 'GET';
  }

  getEncType() {
    if(this.getMethod() === 'POST')
      return 'multipart/form-data';
    else {
      return 'application/x-www-form-urlencoded';
    }
  }

  isValid(data){
    if (data.errors && !data.ribbons && !data.albumDetail && !data.playlistDetail) {
      return false;
    }
    return true;
  }
  getUrl() {
    return `${this._config.end_point_music}${this._service}`;
  }

  getParams() {
    //const params = super.getParams();
    const params = this._params;
    delete params['method'];
    console.log('musictaskParams =>', this._params);
    return {...this._params };
  }

  getHeaders() {

    const headers = {
      ...this._headers,
      'Access-Control-Allow-Origin': '*'
    };
    return headers;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default MusicTask;
