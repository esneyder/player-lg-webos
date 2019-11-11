import Ajax from './Ajax';

class RequestManager {

  /**
   * [addRequest send request]
   * @type AbstractRequestTask request
   * @return Promise
   */
  // TODO: CHECK HKS param
   static  async addRequest(request) {
     if (!request) {
       console.warn("[RequestManager] addRequest failure trying to add null request");
       return;
     }
    //console.log('[NetworkStatus] addRequest');
    let data = request.getParams();

    if ( typeof data.api_version !== 'undefined' ) {
      if ( data.region === null ) {
        return false
      }
    }

    if (data.isCacheable) {
      delete data.HKS;
      delete data.user_hash;
    }

    delete data.isCacheable;

    let urlCheck=request.getUrl();
    urlCheck = urlCheck.substring(urlCheck.indexOf('//')+2,urlCheck.length);
    urlCheck = urlCheck.substring(0,urlCheck.indexOf('/'));

    //window.appReq.url.indexOf(urlCheck) === -1 ? window.appReq.url.push(urlCheck) : null;

    let ObjCheck=Object.keys(data);

    ObjCheck.map( x => {
        // if(window.appReq.data[x])
        //   window.appReq.data[x].indexOf(data[x]) === -1 ? window.appReq.data[x].push(data[x]) : null;
        // else
          window.appReq.data[x]=[data[x]];
    })

    // TODO SUPER todo por http solo para pruebas de QA ...... se escapa sólo para nagra para que reproduzca
    // Otros DRM servers de providers funcionan también sobre http?
    let laurl = request.replaceProtocol(request.getUrl());

    const xhr = new Ajax({
        url: laurl,
        type: request.getMethod(),
        headers: request.getHeaders(),
        encType: request.getEncType(),
        showModal: request.getShowModal(),
        retries: request.getRetriesNumber(),
        showErrorModal: request.getShowErrorModal(),
        responseType: request.getResponseType(),
        data
    });

    //console.log(xhr);
    if (request.getMethod() === 'POST') {
      console.log('[XHR REQUEST] POST', laurl);
    }
    else {
      const keys = Object.keys(data);
      const parameters = keys.map((key) => {
        return `${key}=${data[key]}`;
      });
      console.info('[XHR REQUEST] GET', laurl + (laurl.indexOf('?') === -1 ? '?' : '&') + parameters.join('&'));
    }

    try{
      let xhrResponse = await xhr;
      //console.log('[XHR RESPONSE]', xhrResponse);
       if(request.isValid(xhrResponse)) {
        return new Promise((resolve, reject) => {
          resolve(xhrResponse);
        });
       }
       throw xhrResponse
    }
    catch(e) {
      console.log('[XHR ERROR]', e);
      return new Promise((resolve, reject)=>{
        if(e.entry){
          e.entry.url = laurl; 
        }
        reject(request.parseErrors(e))
      })
    }
  }
}

export default RequestManager;
