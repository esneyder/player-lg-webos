import AbstractRequestTask from "./AbstractRequestTask";

class SimplePostRequestTask extends AbstractRequestTask {
  constructor({ url, params, headers, showErrorModal }) {
    super();

    this.url = url;
    this.params = params;
    this.headers = headers;
    this.showErrorModal = showErrorModal;
  }

  isValid(data) {
    return true;
  }

  getShowModal() {
    return (typeof this.showErrorModal === 'undefined') ? true : this.showErrorModal;
  }

  getHeaders() {
    return { ...this.headers };
  }

  getEncType() {
    return 'application/json';
  }

  getParams() {
    return this.params;
  }

  getMethod() {
    return 'POST';
  }

  success(data, b) {
    this.resolve(data);
  }

  parseErrors(err) {
    if (this.showErrorModal) {
      super.parseErrors(err)
    } else {
      return {}
    }
  }
}

export default SimplePostRequestTask;
