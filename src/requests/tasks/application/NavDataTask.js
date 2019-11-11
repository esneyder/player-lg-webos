import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class NavDataTask extends AbstractRequestTask {

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");
    // return `${http}${url}/services/nav/data`;
   // const url = "mfwkngv-api-test.clarovideo.net";
    return `${http}${url}/services/nav/data`;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default NavDataTask;
