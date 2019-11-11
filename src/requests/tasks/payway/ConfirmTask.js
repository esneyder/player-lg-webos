import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';
import Utils from '../../../utils/Utils';
import getAppConfig from '../../../config/appConfig';

class ConfirmTask extends AbstractRequestTask {
    constructor(url, params = {}, method = 'GET', paramsPOST = {}) {
        super();

        this.url = url;
        this.params = params;
        this.method = method;
        this.paramsPOST = paramsPOST;

    }

    getMethod() {
        
        return this.method;
    }

    getHeaders() {
        if (this.method === 'GET') {
            return {};
        } else {
            return {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        }
    }

  //Extra la version de la url
  getVersionFromUrl(version) {

    let arrUrl = this.url.split('/');
    const index = arrUrl.findIndex((element) => element === 'api_version');

    if (arrUrl[index + 1]) {
      return arrUrl[index + 1];
    }
    
    return version;

  }

    getUrl() {
        const http = "https://";
        const url = Launcher.get("akamai_mfwk");
        const queryString = this.method === 'POST' ? (`?${this.getQueryStringParams()}`) : '';
      
        return `${http}${url}/${this.url}${queryString}`;
    }

    getQueryStringParams()
    {

      const baseParams = super.getParams();


      //Fix https://dlatvarg.atlassian.net/browse/STV-6170
      if (this.method === 'POST') {
        //Este metodo no debe llevar api_version, a menos que lo traiga desde el buyLink de payway/workflowstart
        delete baseParams.api_version;
      }

      let parms = Object.assign({}, baseParams, this.params);      
      let result = Utils.buildQueryParams(parms);
      
      return result;
    }

    getParams() {

      const params = super.getParams();

        if (this.method === 'GET') {
            return Object.assign({}, params, this.params);
        }
        else
        {            
            return this.paramsPOST;
        }        
    }

    isValid(data) {
        console.log('==>Is valid confirm')
        console.log(data);

        if (this.method === 'POST') {
          if ((data.status >= 200 && data.status <= 299) || (data.response && data.response.code && data.response.uuid)) {
                //Para POST los codigos de error son los de HTTP status
                return true;
            }
            return false;
        }
        else {
            if (data.errors || !data.response || data.response === 'error') {
                return false;
            }
            return true;
        }
    }

    success(data, b) {
        this.resolve(data);
    }
}

export default ConfirmTask;
