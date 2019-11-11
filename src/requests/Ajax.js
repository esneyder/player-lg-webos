import store from '../store';
import { SHOW_MODAL, MODAL_REINTENTO } from '../actions/modal';
import Metadata from './apa/Metadata';
import Utils from '../utils/Utils';
import LocalStorage from "../components/DeviceStorage/LocalStorage";
import DeviceStorage from "../components/DeviceStorage/DeviceStorage";

export default class Ajax {
    constructor(options = {}) {


        let params = null;
        let url = options.url;
        const method = options.type.toUpperCase();
        switch (method) {
          case 'POST':
          case 'PUT':
            if (url.includes('.claropagos.') || url.includes('services/user/loginsso')) {
                  url = url.replace('http://', 'https://');
                }
                const encType = options.encType;
                if (encType === 'multipart/form-data') {
                    params = new FormData();
                    for (const key in options.data) {
                        params.append(key, options.data[key]);
                    }
                //TODO encType === text/plain
                } if (encType === 'application/json') {
                    params = JSON.stringify(options.data);
                //Default application/x-www-form-urlencoded
                } else {
                    params = Utils.buildQueryParams(options.data);
                }
                break;
            default: // GET
              url = options.url;
              const query_data = Utils.buildQueryParams(options.data);
                url = (url.indexOf('?') === -1)
                  ? `${url}?${query_data}`
                  : `${url}&${query_data}`;
                break;
        }
        this.options = {...options, params, url};
        this.setConfig();

        this.modal = {
            type: SHOW_MODAL,
            modalType: MODAL_REINTENTO
        };
        this.handleRetry = this.handleRetry.bind(this);
        const _this = this;
        // Return a new promise.

        return new Promise(function (resolve, reject) {
          const beforeResolve = (response) =>{
            if(response.appVersion){
              console.log('recibimos appVersion de la respuesta de webapi-video/epg');
              _this.checkVersion(response.appVersion);
            }
            if(typeof resolve === 'function'){
              resolve(response);
            }
          }
            _this.tryRequest(_this, resolve, reject);
        })
    }

    checkVersion(middlewareVersion){
      console.log('checkVersion middlewareVersion',middlewareVersion);
      const appVersionFromLocalStorage = DeviceStorage.getItem('appVersion');
      console.log('appVersionFromLocalStorage',appVersionFromLocalStorage);
      if(appVersionFromLocalStorage && middlewareVersion){
        const appVersion = Utils.appVersionToNumber(appVersionFromLocalStorage);
        middlewareVersion = Utils.appVersionToNumber(middlewareVersion);
        console.log('appVersion',appVersion);
        console.log('middlewareVersion',middlewareVersion);
        if(middlewareVersion>appVersion && !DeviceStorage.getItem('deactivateForceUpdate')){
          if(window.navigator.userAgent.toLowerCase().indexOf('stb')!==-1){
            console.log('Stop stb player');
            window.AndroidPlayerInterface.stopFullPlayer();
            console.log('Va a reiniciar');
            localStorage.setItem('appWasUpdate',true);
            setTimeout(window.location.replace('/'),15000);
          }
        }
      }

    }

    setConfig() {
        this.retries = parseInt(Metadata.get('request_num_retries', 3));
        if(this.options && typeof this.options.retries !=='undefined' && this.options.retries<this.retries)
        {
          this.retries=this.options.retries;
        }
    }

    async tryRequest(_this, handleResolve, handleReject) {
        const promise = new Promise(function (resolve, reject) {
            const options = _this.options;
            const method = options.type;
            const headers = options.headers;
            const params = options.params;
            const url = options.url;
            const responseType = options.responseType;
            // Do the usual XHR stuff
            let xhr = new XMLHttpRequest();
            xhr.responseType = responseType;
            xhr.open(method, url);

            // Set request headers
            // for(let header in headers) {
            //     const value = headers[header];
            //     xhr.setRequestHeader(header, value);
            // }
          if ((method === 'POST' || method === 'PUT') && headers) {
                for (const key in headers) {
                    xhr.setRequestHeader(key, headers[key]);
                }
            }

            xhr.onload = function () {
                // This is called even on 404 etc
                // so check the status
                /*para no reseteo de aplicacion si ya se cargo */
                if (xhr.status >= 200 && xhr.status<300 || xhr.status === 400) {
               // if (xhr.status ===200 || xhr.status === 400) {
                    // Resolve the promise with the response text
                    try {
                      //console.log('[NetworkStatus] ajax onload status 200');

                      //if (url.indexOf('player/getmedia') > -1) {
                      //  // Esta informacion solo es relevante para dashboard
                      //  console.log('==> XHR headers')
                      //  const arr = xhr.getAllResponseHeaders().split('\r\n');

                      //  let headers = arr.reduce(function (acc, current, i) {
                      //    var parts = current.split(': ');
                      //    acc[parts[0]] = parts[1];
                      //    return acc;

                      //  }, {});

                      //  window.headersPGM = headers;
                      //}
                      if(xhr.status === 200 && Utils.isJson(xhr.response) &&JSON.parse(xhr.response).status != 200 && _this.options.showErrorModal){
                        _this.handleError(handleResolve, handleReject,xhr);
                      }else{
                        if(Utils.isJson(xhr.response)){
                          resolve(JSON.parse(xhr.response));
                        } else{
                          resolve(xhr.response);
                        }
                      }
                    }
                    catch (e) {
                        //console.log('[NetworkStatus] ajax onload catch error> ' + xhr.responseText);
                        resolve(xhr.responseText);
                    }
                } else {
                    // Otherwise reject with the status text
                    // which will hopefully be a meaningful error
                  try {
                    let response = JSON.parse(xhr.responseText)
                    if (xhr.status >= 400 && response && (response.errors || response.error) ) {
                      resolve(response);
                    }
                    reject(Error(xhr.statusText));
                  }catch(e) {
                    reject(Error(xhr.statusText));
                  }
                }
            };

            // Handle network errors
            xhr.onerror = function () {
                reject(Error("Network Error"));
                console.error("url when error: " + url);
            };

            // Make the request
            xhr.send(params);
        });

        try {
            const response = await promise;
            handleResolve(response);
        } catch (error) {
            console.log('Attempting to retry request');
            _this.handleError(handleResolve, handleReject, error);
        }
    }

    handleRetry(handleResolve, handleReject) {
        this.setConfig();
        return this.tryRequest(this, handleResolve, handleReject);
    }

    requestsToSkip(){
      //array de los request que si fallan no mostra el modal de reintento
      const requests=['check-app-version','epg/version', 'user/loginsso', 'webapi-video/epg', 'user/isloggedin', 'payway/linealchannels', 'user/statuscontrolpin', 'recordings/list', 'services/track'];
      let skip=false;
      requests.forEach(it=>{
        if(this.options.url.includes(it))
          skip=true
      });
      return skip;
    }

    handleError(handleResolve, handleReject, err) {
        if (this.retries === 0) {
          if (typeof window.newrelic === 'object') {
            let error = {
              err,
              url: this.options.url
            }
            console.log('Newrelic Error handleError', error);
            window.newrelic.noticeError(error);
          }
          if(this.options.url.indexOf('webapi-video/pureEpg') !== -1){
            return handleResolve();
          }
          if (this.options && this.options.showModal && !this.requestsToSkip()) {
            this.modal.modalProps = {
              onReject: () => handleReject('Can not get request'),
              onRetry: () => this.handleRetry(handleResolve, handleReject),
              url: this.options.url
            };
            return store.dispatch(this.modal);
          }else if(this.options.url.indexOf('webapi-video/epg') > -1){
            let that = this;
            setTimeout(()=>{
              this.tryRequest(that, handleResolve, handleReject)
             },300000)
          }
            return handleReject();
        }
        this.retries--;
        return this.tryRequest(this, handleResolve, handleReject);
    }

}
