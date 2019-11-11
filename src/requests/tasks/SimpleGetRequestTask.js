import AbstractRequestTask from "./AbstractRequestTask";

class SimpleGetRequestTask extends AbstractRequestTask {
  constructor(url, params = {}, showErrorModal = true) {
    super();

    this.url = url;
    this.params = params;
    this.showErrorModal = showErrorModal;
  }

  isValid(data) {
    return true;
  }

  getShowModal() {
    return this.showErrorModal;
  }

  getParams() {
    if (this.params !== null) {
      return { ...super.getParams(), ...this.params };
    }
    return {}
  }

  success(data, b) {
    this.resolve(data);
  }

  getRetriesNumber(){
    return 0; //caso de tracking para que solo envie una vez la peticion y no tenga reintentos TODO checar que en mis contenidos tambien utiliza este task
  }
  parseErrors(err) {
    if (this.showErrorModal) {
      super.parseErrors(err)
    } else {
      return {}
    }
  }

}

export default SimpleGetRequestTask;
