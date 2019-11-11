import AbstractRequestTask from "../AbstractRequestTask";
import getAppConfig from "../../../config/appConfig";
import DeviceStorage from "../../../components/DeviceStorage/DeviceStorage";

class PureEpgTask extends AbstractRequestTask {
    constructor(parameters) {
        super();
        this.customParameters = parameters;
    }

    isValid(data){
        if(data.errors) {
            data.response = {
                channels:[],
                events:[]
            };
            return false;
        }
        return true;
    }

    getHeaders() {
        return {};
    }

    getParams() {
        const params = super.getParams();
        //for test
        //params.region = 'colombia'
        return {
            ...params,
            ...this.customParameters,
            epg_version: DeviceStorage.getItem('epgVersion') || false,
            soa_version: DeviceStorage.getItem('soaVersion') || false,
        };
    }

    getHostMiddleware(){
        const host =    window.location.origin ? `${window.location.origin}/webapi-video/` :
                        window.location.host ? `${window.location.protocol}//${window.location.host}/webapi-video/` : 
                        `${window.location.protocol}//${window.location.hostname}/webapi-video/`;
        console.log('PureEpgTask host',host);
        return host;
    }

    getUrl() {
        return `${this.getHostMiddleware()}pureEpg`;
    }

    getUrlWithQueryParams(){
        return `${this.getUrl()}?${Object.keys(this.getParams()).map(key => `${key}=${encodeURIComponent(this.getParams()[key])}`).join('&')}`
    }

    success(data, b) {
        this.resolve(data);
    }
}

export default PureEpgTask;
