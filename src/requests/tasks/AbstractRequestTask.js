// import htmlDecode from '../../utils/htmlDecode';
import getAppConfig from '../../config/appConfig';
import storage from '../../components/DeviceStorage/DeviceStorage';
import DeviceStorage from '../../components/DeviceStorage/DeviceStorage';
import Metadata from '../../requests/apa/Metadata';
import store from '../../store';

class AbstractRequestTask {

    success(data, b) {
        if (data.errors || !data.response) {
            return false;
        }

        return true;
    }

    isValid(data) {
        if (data.errors || !data.response || data.response === 'error') {
            return false;
        }

        return true;
    }

    getResponseType(){
        return "";
    }

    replaceProtocol(url){
        let newUrl = Object.assign(url);

        const signalKey = newUrl.indexOf('signalKey') === -1;
        const social = newUrl.indexOf('www.clarovideo.com') === -1;
        const cert = newUrl.indexOf('getcertificate') === -1;
        if(window.location && window.location.protocol && signalKey && social && cert) {
          newUrl= newUrl.replace('https:', window.location.protocol);
          newUrl= newUrl.replace('http:', window.location.protocol);
        }
        return newUrl;
    }

    getShowErrorModal(){
        return false;
      }

    error(data, b) {
        const newError = this.parseErrors(data);
        this.reject(newError, b);
    }

  parseErrors(err) {
      if (typeof window.newrelic === 'object') {
        console.log('Newrelic Error parseErrors', err);
        window.newrelic.noticeError(err);
      }
        let message;
        let code = null;
        if (err.errors && err.errors["0"] && err.errors["0"].code) {
            code = err.errors["0"].code;
            message = err.errors["0"].message;
        } else
        if (err.errors) {
            
            if (err.errors.msg) {
                message = err.errors.msg;
            } else if (Array.isArray(err.errors.error)) {
                message = err.errors.error[0];
            } else {
                message = err.errors.error;
            }
            if (err.errors.code)
                code = err.errors.code;

        }
        else if(err.status == false) {
            message = err.message;
            code = err.code;
        }
        else {
            message = err.msg || null;
        }

        return {
            // message: htmlDecode(message),
            message: message,
            completeError: err,
            code
        };

    }

    /*
        Para métodos POST, tipos:
        1. application/x-www-form-urlencoded - DEFAULT
        2. text/plain - TODO see @ src/requests/Ajax.js
        3. multipart/form-data
    */
    getEncType() {
      return 'application/x-www-form-urlencoded';
    }

    getShowModal(){
      return true;
    }

    getRetriesNumber(){
      return 4;
    }

    getParams() {
        const config = getAppConfig();
        const HKS = storage.getItem("HKS") || "";
        const region = storage.getItem("region");
        const user = store.getState().user;

        const params = {
            HKS: HKS,

            api_version: config.api_version,
            authpn: config.authpn,
            authpt: config.authpt,

            device_category: config.device_category,
            device_manufacturer: config.device_manufacturer,
            device_model: config.device_model,
            device_type: config.device_type,

            device_id: config.device_id,
            device_name: config.device_name,
            device_so: config.device_so,

            region: region,
            format: config.format
        };

        const stickySession = JSON.parse(Metadata.get('sticky_session', '{"default":{"push_session":false,"user_id":false}}'));
        const userIdEnabled =  stickySession[region] ? stickySession[region].user_id : stickySession['default'].user_id;
        if(userIdEnabled && user && user.user_id){
            return Object.assign({}, params, this.params, { user_id: user.user_id});
        }

        return Object.assign({}, params, this.params);
    }

    getMethod() {
        return 'GET';
    }

    getUrl() {
        return this.url;
    }

    getHeaders() {
        return {
            'Access-Control-Allow-Origin': '*'
        };
    }
}

export default AbstractRequestTask;
