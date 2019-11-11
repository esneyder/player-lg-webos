import AbstractRequestTask from "../AbstractRequestTask";

class AkamaiTrackerTask extends AbstractRequestTask {
  constructor(url, parameters) {
    super();
    this.customParameters = parameters;
    this.url = url;
  }

  isValid(data)
  {
    return true;
  }

  getShowModal(){
    return false;
  }

  getParams() {
    const params = super.getParams();
    return Object.assign({}, params, this.customParameters );
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default AkamaiTrackerTask;
