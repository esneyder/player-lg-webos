import AbstractRequestTask from "../AbstractRequestTask";

class CertificateTask extends AbstractRequestTask {

  constructor(url, params) {
    super();
    this._url = "https://widevine-vod.clarovideo.net/licenser/getcertificate";
    this._params = params || {}
  }

  getMethod() {
    return 'GET';
  }

  getHeaders() {
    return {  };
  }

  getUrl() {
    return this._url;
  }

  getParams() {
    const params = super.getParams();
    return this._params;
  }

  getResponseType(){
    return "arraybuffer";
  }

  success(data, b) {
    this.resolve(data);
  }

  isValid(data) {  
    return true;
  }
}

export default CertificateTask;
