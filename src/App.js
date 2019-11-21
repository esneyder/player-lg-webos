import React, { Component } from "react";
import logo from './logo.svg';
import './App.css';
import Axios from "axios";
const qs = require('querystring')

const APP_ID = 'com.clarovideo';
const DRM_TYPE = 'playready';
const DRM_SYSTEM_ID = "urn:dvb:casystemid:19219";


class AppVideo extends Component {

  constructor(props) {
    super(props);
    this.sendVideo = this.sendVideo.bind(this);
    this.webOS = window.webOS;

    this.unloadWebosDrmClient = this.unloadWebosDrmClient.bind(this);
    this.loadWebosDrmClient = this.loadWebosDrmClient.bind(this);
    this.setInitiatorInformation = this.setInitiatorInformation.bind(this);
    this.loadDrmClient = this.loadDrmClient.bind(this);
    this.sendDRMInformation = this.sendDRMInformation.bind(this);
    this.subscribeLicensingError = this.subscribeLicensingError.bind(this);
    this.getXMLInitiator = this.getXMLInitiator.bind(this);
    this.setVideoSource = this.setVideoSource.bind(this);

    this.web0sClientId = '';
    this.web0sReady = false;
    this.mediaType = "application/vnd.ms-sstr+xml";
    this.web0sInitiatorMsg = '';
    /**
     application/vnd.ms-sstr+xml;mediaOption=%7B%22option%22%3A%7B%22drm%22%3A%7B%22type%22%3A%22playready%22%2C%22clientId%22%3A%22N5FWuG1Afg%22%7D%2C%22transmission%22%3A%7B%22playTime%22%3A%7B%22start%22%3A500%7D%7D%7D%7D
     */
  }

  componentDidMount() {
    const vid = document.getElementById('vid');

    // Add listeners
    vid.addEventListener("loadedmetadata", function () {
      console.log('[loadedmetadata]');
    });
    vid.addEventListener("waiting", function () {
      console.log('[waiting]');
    });

    vid.addEventListener("timeupdate", function (e) {
      console.log('[timeupdate]', e);
    });

    vid.addEventListener("seeking", function () {
      console.log('[seeking]');
    });

    vid.addEventListener("seeked", function () {
      console.log('[seeked]');
    });

    vid.addEventListener("playing", function () {
      console.log('[playing]');
    });

    vid.addEventListener("error", function (e) {
      console.log('[error]', e);
    });

    vid.addEventListener("ended", function () {
      console.log('[ended]');
    });

    vid.addEventListener("canplay", function () {
      console.log('[canplay]');
    });

    vid.addEventListener("durationchange", function (e) {
      console.log('[durationchange]', e);
    });

    vid.addEventListener("ratechange", function () {
      console.log('[ratechange]');
    });

    setTimeout(() => {
      this.sendVideo();
    }, 2000);
  }

  sendVideo() {

    let gtm= '';

    // AMCO
    gtm = 'http://aws-east-microfwk-silo-web.clarovideo.net/services/player/getmedia?HKS=HKSRANDOM220196685&api_version=v5.88&region=mexico&device_manufacturer=windows&device_category=web&device_model=html5&device_type=html5&device_name=web_Chrome_1&device_id=PLYAUT220196685&authpt=11s4e5l6a381e&authpn=accedo&user_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzM3NjIwMDEsImV4cCI6MTU3ODk0NjMwMSwidXNyIjp7InVzZXJfaWQiOiIzNTk3MzQ5MyIsInVzZXJfdHlwZSI6IkNNWEFNQ08iLCJ1c2VybmFtZSI6ImFtY29wcnVlYmFzLmF1dC5wbHkrdHJrYW1jb18yOUBnbWFpbC5jb20iLCJlbWFpbCI6ImFtY29wcnVlYmFzLmF1dC5wbHkrdHJrYW1jb18yOUBnbWFpbC5jb20iLCJmaXJzdG5hbWUiOiJhdXRvbWF0aW9uIiwibGFzdG5hbWUiOiJkbGEiLCJjb3VudHJ5X2NvZGUiOiJNWCIsInJlZ2lvbiI6Im1leGljbyIsImFjY2VwdGVkX3Rlcm1zIjoxLCJnYW1pZmljYXRpb25faWQiOiI1YzUzM2E1NmE4YjM4MzExN2UxZTliMTYiLCJwYXJlbnRfaWQiOiIzNTk3MzQ5MyIsImFjY291bnQiOm51bGwsImFkbWluIjp0cnVlfX0.V2ls2yWQGXZ1aAyKel8RHxGZY7RZ9ZCEgbvcfk5776Y&payway_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzM3NjE3MDIsImV4cCI6MTU3Mzg0ODEwMiwicGdzIjp7InVzZXJfaWQiOiIzNTk3MzQ5MyIsInBfdXNlcl9pZCI6IjM1OTczNDkzIiwib2ZmZXJpZCI6IjE0MzI3NTY1IiwicHVyY2hhc2VpZCI6IjQ1MjYyODk2NCIsImdyb3VwIjoiNTI5MDU0IiwicGxheSI6MSwiY19kaXNwX3AiOiI1In19.NrPFjFaOfzMGnM-lR7Iod5h-1r5j_J38nojHrygGUPA&stream_type=smooth_streaming&group_id=529054';

    // NOW
    //gtm = 'https://aws-sa-east-1-netf-web.clarovideo.net/services/player/getmedia?HKS=(nop8g4k7qwfdsy0f15w8mzwyv6)&api_version=v5.87&region=brasil&device_manufacturer=windows&device_category=web&device_model=html5&device_type=html5&device_name=web_Chrome_1&device_id=PLYAUT432659409&authpt=5facd9d23d05bb83&authpn=net&stream_type=smooth_streaming&group_id=793613&user_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvbWZ3a3dlYm54MS1hcGkuY2xhcm92aWRlby5uZXQiLCJleHAiOjE1NzkwMjYzMTgsIm5iZiI6MTU3Mzg0MjMxOCwiaWF0IjoxNTczODQyMzE4LCJqdGkiOiJCME4yT00wRU40M0YzM0poaFVIeXJwWCtOdkozN0VpRlgwcmhEK0NGblgwPSIsInVzciI6eyJ1c2VyX2lkIjoiNDAzMTc4ODMiLCJ1c2VyX3R5cGUiOiJDQVJOT1ZJUCIsInVzZXJuYW1lICI6InBsYXllcjMyMzQxNTVAbmV0ZmxleC5jb20iLCJlbWFpbCI6InBsYXllcnFhMDE5QGFtY28ubXgiLCJmaXJzdG5hbWUiOiJmaXJzdG5hbWUiLCJsYXN0bmFtZSI6Imxhc3RuYW1lIiwiY291bnRyeV9jb2RlIjoiQVIiLCJyZWdpb24iOiJhcmdlbnRpbmEiLCJhY2NlcHRlZF90ZXJtcyI6MSwiZ2FtaWZpY2F0aW9uX2lkIjoiNWRhZGZlNDE1Yzg5MDA1MDBjNTlmMmYwIiwicGFyZW50X2lkIjoiNDAzMTc4ODMiLCJhY2NvdW50IjpudWxsLCJhZG1pbiI6dHJ1ZX19.3UA3kNjc7QiT0mo5bUKB9UOcwH0RvCkw_8qCjgRHj7g&payway_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODM3NTU2ODAsImlhdCI6MTU3Mzg0MjM1OSwiaXNzIjoicGF5bWVudHNlcnZpY2UvbGl2ZWNoYW5uZWxzIiwiYXVkIjoicGxheWVyLXNlcnZpY2UiLCJzdWIiOiJwYWNrYWdlIiwicGdzIjp7InVzZXJJZCI6IjQwMzE3ODgzIiwib2ZmZXJJZCI6Ijg4NzY4ODc2IiwicHVyY2hhc2VJZCI6ImM3NmRmOTYxLWUzNzEtNDRlZC05ODNkLWYxMmUyYTcwM2QwMCIsInBsYXkiOjEsIm9iamVjdElkIjo0MDEyLCJtYXhTdHJlYW1zIjowLCJtYXhEZXZpY2VzIjo1LCJucHZyU3RvcmFnZSI6MzAsInRpbWVzaGlmdCI6NjAsImdyb3VwcyI6WyI3OTM1OTgiLCI3OTM2MTMiLCI3OTM1NDkiLCI3OTM2MTIiLCI3OTQ3MzUiLCI3OTQ3MTUiLCI3OTQ3NTQiLCI3OTQ3NzMiLCI3OTQ3NzIiLCI3OTQ3NzEiXX19.ks_-KMEzglqwTGkeH4bsMy9qZyEOexL5QwPmtSCvoCg';
    
    Axios.post(gtm)
      .then((res) => {
        if (res.status == 200) {

          const data = res.data;
          let server_url = data.response.media.server_url;
          let video_url = data.response.media.video_url;
          let jsonChallenge = JSON.parse(data.response.media.challenge);
          let customData = {};

          switch (parseInt(data.response.group.common.extendedcommon.media.proveedor.id)) {
            case 1: //AMCO
              customData = {
                "customdata": jsonChallenge,
                "device_id": data.entry.device_id
              }
              break;
            case 2: //FOXV2
              break;
            case 3: //FOXV3
              break;
            case 4: //HBO
              break;
            case 5: //NOGGIN
              break;
            case 6: //CRACKLE
              break;
            case 7: //PICARDIA
              break;
            case 8: //INDY
              break;
            case 9: //EDYE
              break;
            case 10: //NOW
              customData = {
                "privateData": jsonChallenge.token,
                "deviceUniqueId": data.entry.device_id
              }
              break;
            case 11: //PARAMOUNT
              break;
          }
          this.web0sInitiatorMsg = this.getXMLInitiator(server_url, customData);
          this.loadWebosDrmClient(video_url, server_url, customData);
          console.log('video_url, server_url, customData: ', video_url, server_url, JSON.stringify(customData));
          return res;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getXMLInitiator(server_url, customData) {
    let xml_replace = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<PlayReadyInitiator xmlns="http://schemas.microsoft.com/DRM/2007/03/protocols/">' +
        '<LicenseServerUriOverride>' +
          '<LA_URL>{{server_url}}</LA_URL>' +
        '</LicenseServerUriOverride>'+
        '<SetCustomData>' +
          '<CustomData>{{customData}}</CustomData>' +
        '</SetCustomData>' +
    '</PlayReadyInitiator>'

    xml_replace = xml_replace.replace('{{server_url}}', server_url);
    xml_replace = xml_replace.replace('{{customData}}', btoa(JSON.stringify(customData)));

    console.log('DRM XML: ' + xml_replace);

    return xml_replace;
  }


  loadWebosDrmClient(video_url, server_url, customData) {
    console.log('[WEB0S PLAYER] iniciando loadWebosDrmClient...');

    this.setInitiatorInformation().then((resp) => {
      console.log('[WEB0S PLAYER] success loadWebosDrmClient...', resp[0]);

      this.web0sClientId = resp[0];

      this.sendDRMInformation(server_url, customData).then(
        () => {
          this.web0sReady = true;
          this.setVideoSource(video_url, server_url, this.mediaType);
        }
      ).catch((msg) => {
        console.log('[WEB0S PLAYER] error en las promesas en sendDRMInformation', msg);
        //this._onError(onRenderError, 'Error when sending DRM information');
      });
    }).catch((msg) => {
      console.log('[WEB0S PLAYER] error en las promesas en loadWebosDrmClient', msg);
      //this._onError(onRenderError, 'Error when set DRM initiator information');
    });
  }



  setInitiatorInformation() {
    return new Promise((resolve, reject) => {
      this.loadDrmClient().then((clientId) => {
        console.log('[WEB0S PLAYER] resueltas todas las promesas en setInitiatorInformation', clientId);
        let resp_alt = [];
        resp_alt.push(clientId);
        resolve(resp_alt);
      }).catch((msg) => {
        console.log('[WEB0S PLAYER] error en las promesas en setInitiatorInformation');
        reject(msg);
      });
    });
  }

  loadDrmClient() {
    console.log("[WEB0S PLAYER] init loadDRMClient");
    return new Promise((resolve, reject) => {
      let requestt = this.webOS.service.request("luna://com.webos.service.drm", {
        method: "load",
        parameters: {
          "drmType": DRM_TYPE,
          "appId": APP_ID
        },
        onSuccess: (result) => {
          let clientId = result.clientId;
          window.clientId = clientId;
          console.log("[WEB0S PLAYER] DRM Client is loaded successfully, clientId: ", clientId);
          resolve(clientId);
        },
        onFailure: (result) => {
          console.log("[WEB0S PLAYER] loadDrmClient [" + result.errorCode + "] " + result.errorText);
          var err = result.errorCode + "<>" + result.errorText;
          // Do something for error handling
          reject(err);
        }
      });
    });
  }

  sendDRMInformation(server_url, customData) {
    const _parameters = {
      "clientId": this.web0sClientId,
      "msgType": 'application/vnd.ms-playready.initiator+xml',
      "msg": this.web0sInitiatorMsg,
      "drmSystemId": DRM_SYSTEM_ID
    };

    console.log('[WEB0S PLAYER] Entrando a sendDRMInformation method, _parameters: ', _parameters);
    return new Promise((resolve, reject) => {
      let msgId = '';

      let requestt = this.webOS.service.request("luna://com.webos.service.drm", {
        method: "sendDrmMessage",
        parameters: _parameters,
        onSuccess: (result) => {
          this.web0sMsgId = msgId = result.msgId;
          let resultCode = result.resultCode;
          let resultMsg = result.resultMsg;
          console.log("[WEB0S PLAYER] Message ID: " + this.web0sMsgId);
          console.log("[WEB0S PLAYER]  [" + resultCode + "] " + resultMsg);
          if (resultCode != 0) {
            this.subscribeLicensingError(this.web0sClientId, result.msgId);
            reject(resultMsg);
          }
          else {
            resolve(result);
          }
        },
        onFailure: (result) => {
          console.log("[WEB0S PLAYER] ERROR en sendDRMINFORMATION");
          console.log(result);
          this.subscribeLicensingError(this.web0sClientId, msgId);
          var resultCode = 'Error';
          reject(resultCode);
        }
      });
    });
  }

  subscribeLicensingError(clientId, msgId) {
    let requestt = this.webOS.service.request("luna://com.webos.service.drm", {
      method: "getRightsError",
      parameters: {
        "clientId": this.web0sClientId,
        "subscribe": true
      },
      onSuccess: (result) => { // Subscription Callback
        console.log('[WEB0S PLAYER] ingresando a subscribeLicensingError success:');
        console.log(result);
      },
      onFailure: (result) => {
        console.log('[WEB0S PLAYER] subscribeLicensing Error ERROR:');
        console.log(result);
      }
    });
  }

  unloadWebosDrmClient() {
    console.log('[WEB0S PLAYER] unloadWebosDrmClient init');
    if (this.web0sClientId) {
      console.log('[WEB0S PLAYER] unloadWebosDrmClient init 1');
      let requestt = this.webOS.service.request("luna://com.webos.service.drm", {
        method: "unload",
        parameters: { "clientId": this.web0sClientId },
        onSuccess: (result) => {
          console.log("[WEB0S PLAYER] DRM Client is unloaded successfully.");
        },
        onFailure: (result) => {
          console.log('[WEB0S PLAYER] Fail to unload LG DRM client');
        }
      });
    }
  }

  setVideoSource(video_url, server_url, type) {
    console.log('[WEB0S PLAYER] INIT WEB0S Player setVideoSource');
    let source = document.createElement("source");
    let options = {};
    options.option = {};
    let mediaOption = '';
 
    if (server_url) {
      options.option.drm = {};
      options.option.drm.type = DRM_TYPE;
      options.option.drm.clientId = this.web0sClientId;
    }


    console.log("[WEB0S PLAYER] NO hay starttime> setting default 500");
    options.option.transmission = {};
    options.option.transmission.playTime = {};
    options.option.transmission.playTime.start = 500;

    mediaOption = escape(JSON.stringify(options));
    //source.setAttribute('type', 'application/vnd.ms-sstr+xml;mediaOption=' + mediaOption);
    source.setAttribute('type', type + ';mediaOption=' + mediaOption);

    // console.log("[WEB0S] HTML5 player __addSourceToVideoPlayready: " + mediaOption);
    // console.log("[WEB0S] HTML5 player __addSourceToVideoPlayready: " + this.WEBOSClientId);
    // console.log("[WEB0S] HTML5 player __addSourceToVideoPlayready: " + this.WEBOSReady);
    // console.log("[WEB0S] HTML5 player __addSourceToVideoPlayready: " + type);
    // console.log("[WEB0S] HTML5 player startTime play: " + this._playTimeStart);

    source.setAttribute('src', video_url);
    source.id = "Html5PlayerSource_full";

    let vid = document.getElementById('vid');
    try {
      vid.innerText = '';
      vid.appendChild(source);
      vid.load();
      setTimeout(function () {
        console.log('**** SEND PLAY ');
        vid.play();
      }, 2000);

    } catch (e) {
      console.error(e);
    }

    console.log('******* <<<<<<<<<<< END WEB0S PLAYER setVideoSource');
  }

  render() {

    const v1 = 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Big_Buck_Bunny_4K.webm';
    const v3 = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';

    return (
      <div className="App">
        <video id="vid" muted className="videoo" controls>
        </video>
      </div>
    );
  }
}


function App() {
  const appVideo = new AppVideo(null);
  return appVideo;
}

export default App;