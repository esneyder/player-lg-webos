import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class ListTask extends AbstractRequestTask {
    constructor(url, params = {}) {
        super();

        this.url = url;
        this.params = params;
    }

    getHeaders() {
        return {};
    }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");

      return `${http}${url}${this.url}`;
    }

    getParams() {
        const params = super.getParams();

        return Object.assign({}, params, this.params);
    }

    success(data, b) {
        this.resolve(data);
    }
}

export default ListTask;
