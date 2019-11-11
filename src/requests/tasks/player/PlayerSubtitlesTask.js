import AbstractRequestTask from "../AbstractRequestTask";
import Metadata from "../../apa/Metadata";
import DeviceStorage from '../../../components/DeviceStorage/DeviceStorage';
import Device from "../../../devices/device";

class PlayerSubtitlesTask extends AbstractRequestTask {
  constructor(url,vendor='') {
    super();
    this.url = url;
    this.vendor=vendor;

    this.disableSSL=false;
    let isTizen=Device.getDevice().getPlatform()=='tizen';

    let checkDisable=Metadata.get('force_subtitle_http','{}');

    if(checkDisable=='{}'&&isTizen)
    {
      checkDisable='{"default":{"hbo":{"enable":true},"default":{"enable":false}}}';
    }

    try {
      checkDisable = JSON.parse(checkDisable);
    }
    catch(e)
    {
      checkDisable={}
    }

    checkDisable=checkDisable[DeviceStorage.getItem('region')]||checkDisable['default'];

    if(checkDisable)
      checkDisable=checkDisable[this.vendor.toLowerCase()]||checkDisable['default'];
    if(checkDisable)
      checkDisable=checkDisable['enable'];
    if(checkDisable)
      this.disableSSL=true;
  }

  replaceProtocol(url) {
    if(this.disableSSL) {
      return url.replace('https:', 'http:');
    }
    else {
      return super.replaceProtocol(url);
    }
  }

  getUrl() {
    return this.url;
  }

  getParams() {
      return {};
  }

  success(data, b) {
    this.resolve(data);
  }

  isValid(data) {
    if (!data) {
      return false;
    }
    console.log('[PARSER] return is Valid true');
    return true;
  }

  getShowModal(){
    return false;
  }
}

export default PlayerSubtitlesTask;
