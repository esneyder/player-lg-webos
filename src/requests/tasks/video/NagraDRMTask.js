import AbstractRequestTask from "../AbstractRequestTask";

class NagraDRMTask extends AbstractRequestTask {

  constructor(params) {
    super();
    this._url = params.url;
    this._challenge = params.challenge;
  }

  getMethod() {
    return 'POST';
  }

  getHeaders() {
    return {};
  }

  getUrl() {
    return this._url;
  }

  getParams() {
    return { data: this._challenge };
  }

  success(data, b) {
    this.resolve(data);
  }

  isValid(data) {
    // TODO
    if (data.status != 'OK') {
      return false;
    }
    return true;
  }
}

export default NagraDRMTask;
