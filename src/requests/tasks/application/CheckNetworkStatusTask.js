import AbstractRequestTask from "../AbstractRequestTask";
import settings from "../../../devices/all/settings";

class CheckNetworkStatusTask extends AbstractRequestTask {

  getUrl() {
    return settings.ajax_url;
  }

  isValid(data) {
    return data.hasOwnProperty('short_name');
  }

  success(data, b) {
    this.resolve(data);
  }

  getParams() {
    return {};
  }

  parseErrors(err) {
    console.log('Parser errors en checknetworkstatus');
  }

  isValid(data) {
    console.log('Checknetwork status isValid ', data, data === '<html></html>');
    return data;
  }

  getShowModal(){
    // En playing, player lanza/controla modal al perder red
    if(window.location.href.indexOf('/player/') !== -1) {
      return false;
    }
    else {
      return false;
    }
  }

}

export default CheckNetworkStatusTask;
