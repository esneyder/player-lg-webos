import AbstractRequestTask from "../AbstractRequestTask";

class DRMTask extends AbstractRequestTask {

  constructor(manifest) {
    super();
    this._manifest = manifest;
  }

  getMethod() {
    return 'GET';
  }

  getHeaders() {
    return {};
  }

  getUrl() {
    return `http://aaf-stbnagra.clarovideo.net/webapi-video/drm-url?manifest=${this._manifest}`;
  }

  getParams() {
    return {};
  }

  success(data, b) {
    this.resolve(data);
  }

  isValid(data) {
    console.log('DRMTask isValid ', data);
    return true;
  }
}

export default DRMTask;
