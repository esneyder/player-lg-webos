import AbstractRequestTask from "../AbstractRequestTask";

class GeneralTask extends AbstractRequestTask {
  constructor(url, params = {}, authorization, method = 'POST') {
    super();
    
    this.url = url;    
    this.params = params;    
    this.authorization = authorization;
    this.method = method;
  }

  getMethod() {    
    return this.method;
  }

  getEncType() {
    return 'application/json';
  }

  getHeaders() {
   
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': this.authorization
    };
  }

  getUrl() {
    return `${this.url}`;
  }

  getParams() {
    return this.params;
  }

  isValid(data) {
    if (data.status === "success" || data.http_code === 200  ) {      
      return true;
    }
    return false;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default GeneralTask;
