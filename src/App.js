import React, { Component } from "react";
import logo from './logo.svg';
import './App.css';
import Axios from "axios";

const APP_ID = 'com.clarovideo';
const DRM_TYPE = 'playready';
const DRM_SYSTEM_ID = "urn:dvb:casystemid:19219";


class AppVideo extends Component {

  constructor(props) {
    super(props);
    this.sendVideo = this.sendVideo.bind(this);

    this.drmUrl = '';
    this.videoUrl = '';
    this.challenge = '';
    // this.device_id = '846b1383-a3ed-4757-ae22-e52ef7ea5ce2';
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

    const gtm = 'http://mfwktv2lg-api.clarovideo.net/services/player/getmedia?group_id=722390&stream_type=smooth_streaming&preview=0&HKS=l2rhbm8b752gsn5fujco4c8805&api_version=v5.88&authpn=amco&authpt=12e4i8l6a581a&device_category=tv&device_manufacturer=lg&device_model=web0s&device_type=TV&device_id=30da4a42-d086-e54b-60c0-1a398b333aa7&device_name=lg&device_so=webos&region=mexico&format=json&user_id=35944753';
    Axios.get(gtm)
      .then((res) => {
        if (res.status == 200) {

          const videoData = res.data.response;

          let server_url = videoData.media.server_url;
          server_url = 'https://playready-claroglobal-vod-web.clarovideo.net/rightsmanager.asmx?user_id=10644078';
          const video_url = 'http://mxuspss2qro.clarovideo.com/multimediav81/plataforma_vod/MP4/201810/MAH006682_full/MAH006682_full_SS_SS.ism/Manifest';
          const challenge = videoData.media.challenge ? videoData.media.challenge : null;
          let customData;
          if (challenge) {
            customData = btoa('{"customdata":{"token":"0a6a53260e1a4f2ee50be3d09af9dcc8","material_id":"878364"},"device_id":"1d5de6b04b18457c44b5ecb70f1d4a26"}');
          }

          this.web0sInitiatorMsg = this.getXMLInitiator(server_url, customData);
          this.loadWebosDrmClient(video_url, server_url, challenge);
          console.log('video_url, server_url, challenge, customData: ', video_url, server_url, challenge, customData);
          //vid.play();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getXMLInitiator(drmUrl, customData) {
    if (!customData) customData = '';
    let xml_replace = '<?xml version="1.0" encoding="utf-8"?>';
    xml_replace += '<PlayReadyInitiator xmlns="http://schemas.microsoft.com/DRM/2007/03/protocols/">';
    xml_replace += '<LicenseServerUriOverride>';
    xml_replace += '<LA_URL>{{drm_url}}</LA_URL>';
    xml_replace += '</LicenseServerUriOverride>';
    xml_replace += '<SetCustomData>';
    xml_replace += '<CustomData>{{customData}}</CustomData>';
    xml_replace += '</SetCustomData>';
    xml_replace += '</PlayReadyInitiator>';

    xml_replace = xml_replace.replace('{{drm_url}}', drmUrl);
    xml_replace = xml_replace.replace('{{customData}}', customData);

    console.log('DRM XML: ' + xml_replace);

    return xml_replace;
  }


  loadWebosDrmClient(video_url, server_url, challenge) {
    console.log('[WEB0S PLAYER] iniciando loadWebosDrmClient...');

    this.setInitiatorInformation().then((resp) => {
      console.log('[WEB0S PLAYER] success loadWebosDrmClient...', resp[0]);

      this.web0sClientId = resp[0];

      this.sendDRMInformation(server_url, challenge).then(
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

  sendDRMInformation(server_url, challenge) {
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
