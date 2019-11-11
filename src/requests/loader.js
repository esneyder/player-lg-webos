import RequestManager from '../requests/RequestManager';

import ApaMetadataTask from '../requests/tasks/application/ApaMetadataTask';
import ApaAssetTask from '../requests/tasks/application/ApaAssetTask';
import ApaLegalsTask from '../requests/tasks/application/ApaLegalsTask';
import ApaLauncherTask from '../requests/tasks/application/ApaLauncherTask';
import BadgesTask from '../requests/tasks/application/BadgesTask';
import NavDataTask from '../requests/tasks/application/NavDataTask';
import ContentDataTask from './tasks/content/ContentDataTask';
import ContentSerieTask from './tasks/content/ContentSerieTask';
import GetBookmarkTask from './tasks/user/GetBookmarkTask';
import ContentRecommendationsTask from '../requests/tasks/content/ContentRecommendationsTask';
import PurchaseButtonInfoTask from '../requests/tasks/payway/PurchaseButtonInfoTask';
import PurchaseButtonInfov585Task from '../requests/tasks/payway/PurchaseButtonInfov585Task';
import PlayerGetMediaTask from '../requests/tasks/player/PlayerGetMediaTask';
import VerticalLookUp from '../requests/tasks/search/VerticalLookUpTask';
import Vertical from '../requests/tasks/search/VerticalTask'
import DeviceAttachTask from '../requests/tasks/device/AttachTask';

import StartHeaderInfoTask from '../requests/tasks/user/StartHeaderInfoTask';
import IsLoggedInTask from '../requests/tasks/user/IsLoggedInTask';
import PushSessionTask from '../requests/tasks/user/PushSessionTask';
import UserFavoriteTask from '../requests/tasks/user/UserFavoriteTask';
import LinealChannelsTask from '../requests/tasks/payway/LinealChannelsTask';
import ChannelsTask from '../requests/tasks/epg/ChannelsTask';
import SmartCardLoginTask from '../requests/tasks/user/SmartCardLoginTask';
import authdeviceTask from '../requests/tasks/user/authdeviceTask';
import ActivateControlPinTask from '../requests/tasks/user/ActivateControlPinTask';
import ActivateControlPinWithoutEmailTask from '../requests/tasks/user/ActivateControlPinWithoutEmailTask';
import ChangeControlPinTask from '../requests/tasks/user/ChangeControlPinTask';
import ModifyControlPinTask from '../requests/tasks/user/ModifyControlPinTask';
import UserSeenLastTask from '../requests/tasks/user/UserSeenLastTask';
import CheckControlPinTask from '../requests/tasks/user/CheckControlPinTask';
import RemindControlPinTask from '../requests/tasks/user/RemindControlPinTask';
import RegisterTask from '../requests/tasks/user/RegisterTask';
import LoginTask from '../requests/tasks/user/LoginTask';
import LoginDynaminTask from '../requests/tasks/user/LoginDynamic';
import MusicTask from "../requests/tasks/music/MusicTask";
import Login360Task from '../requests/tasks/user/Login360Task';
import LoginNETTask from '../requests/tasks/user/LoginNETTask';
import CpfQueryTask from '../requests/tasks/user/CpfQueryTask';
import SendPasswordReminderTaks from '../requests/tasks/user/SendPasswordReminderTaks';
import SetTermsAndConditionsTask from '../requests/tasks/user/SetTermsAndConditionsTask';
import WorkflowTask from '../requests/tasks/payway/WorkFlowStartTask';
import ConfirmTask from '../requests/tasks/payway/ConfirmTask';
import AppVersionTask from '../requests/tasks/application/AppVersionTask';
import EpgVersionTask from '../requests/tasks/application/EpgVersionTask';

import AvatarsTask from '../requests/tasks/user/profile/AvatarsTask';
import CreateProfileTask from '../requests/tasks/user/profile/CreateProfileTask';
import DeleteProfileTask from '../requests/tasks/user/profile/DeleteProfileTask';
import ReadProfileTask from '../requests/tasks/user/profile/ReadProfileTask';
import UpdateProfileTask from '../requests/tasks/user/profile/UpdateProfileTask';
// Task para Action Bar
import AddFavoriteTask from '../requests/tasks/user/AddFavoriteTask';
import DeleteFavoriteTask from '../requests/tasks/user/DeleteFavoriteTask';
import AddBlockedChannelsTask from '../requests/tasks/user/AddBlockedChannelsTask';
import DeleteBlockedChannelsTask from '../requests/tasks/user/DeleteBlockedChannelsTask';
import CheckBlockedChannelsTask from '../requests/tasks/user/CheckBlockedChannelsTask';
import ReminderCreateTask from '../requests/tasks/user/ReminderCreateTask';
import ReminderDeleteTask from '../requests/tasks/user/ReminderDeleteTask';
import ReminderListTask from '../requests/tasks/user/ReminderListTask';
import UserControlPinStatusTask from '../requests/tasks/user/UserControlPinStatusTask';

import getAppConfig from '../config/appConfig';
import storage from '../components/DeviceStorage/DeviceStorage';
import store from '../store';
import moment from 'moment';
import Device from "../devices/device";
import env from '../devices/all/env';
import { setLastTouchData } from '../reducers/user';
import { youboraLauncher } from "../config/youboraLoader";
import Metadata from './apa/Metadata';
import Utils from '../utils/Utils'
import localStorage from '../components/DeviceStorage/LocalStorage';
import PureEpgTask from './tasks/epg/PureEpgTask';
import FiltersTask from './tasks/epg/FiltersTask';
import LevelRibbonTask from "./tasks/cms/LevelRibbonTask";
import EpgPersistence from '../AAF/Nepg/EpgPersistence';


/* TODO This if will be removed. */
const platform = Device.getDevice().getPlatform();
const isNagra = platform === 'nagra';
const isAndroid = platform === 'android';

export async function startHeaderInfo() {
    let result;
    try {
        const startHeaderInfoTask = new StartHeaderInfoTask();
        result = await RequestManager.addRequest(startHeaderInfoTask);

        checkSupportedRegion(platform, result.response.region);

        //TODO nagra hardcode solo deberia ser neceario para pruebas.
        let region = (isNagra) ? 'colombia' : result.response.region;

        // Youbora
        window.youboraRegion = region;

        //const regionStorage = storage.getItem('region');
        const regionLoggedStorage = storage.getItem('region');
        const HKS = result.response.session_stringvalue;
        const time = `${result.response.date} ${result.response.time}`;
        let server_time = null;
        console.log('[loader] starheaderinfo time: '+time);
        console.info("[loader] starheaderinfo region", region);

        if(regionLoggedStorage
          && storage.getItem('user_hash')
          && regionLoggedStorage !== region) {

          console.info("[loader] starheaderinfo regionStorage", regionLoggedStorage);
          region = regionLoggedStorage;
          //TODO 3 hrs esta hardcode
          server_time = moment(time).add(0, 'h');
        }
        else {
          server_time = moment(time);
        }
        storage.setItem('region', region);
        //storage.setItem('region', 'argentina');
        storage.setItem('HKS', HKS);
        console.log('[loader] starheaderinfo needsOffset: '+EpgPersistence.needsOffset());
        const timeToSet = EpgPersistence.needsOffset() ? new moment(server_time).utcOffset(EpgPersistence.needsOffset(),true) : server_time;
        storage.setItem('server_time', timeToSet);
        storage.setItem('local_time', moment());

        /* TODO This if will be removed. Android native need to refactor some things */
        if(isAndroid && window.AndroidPlayerInterface){
          window.AndroidPlayerInterface.saveStartHeaderInfo(JSON.stringify(result));
        }

    } catch (err) {
        console.error("[loader] starheaderinfo err", err);
    }

    return new Promise((resolve, reject) => {
        resolve(result);
    });

}

function checkSupportedRegion(platform, region) {
  //Esta funcion revisa si la region esta soportada para aaf, de no se asi redirige hacia
  //la version anterior
  // https://dlatvarg.atlassian.net/browse/STV-4411
  const supportedRegions = ['mexico', 'colombia', 'chile', 'argentina', 'uruguay', 'paraguay', 'ecuador', 'peru', 'honduras', 'nicaragua', 'costarica', 'dominicana', 'panama', 'elsalvador', 'guatemala', 'brasil'];
  const xdk_redirect = getAppConfig().xdk_redirect;
  let isValidLocation = window.location.href.includes('aaf-stbnagra-preprod.clarovideo.net')//remove hardcode QA preprod
  let isXDKRedirect = window.location.href.includes(xdk_redirect)//remove hardcode QA preprod

  if (isXDKRedirect) {
    storage.setItem('xdk', true);
    window.location.href = '/';
  }

  const hasXDKRedirect = storage.getItem('xdk') == 'true';



  if (!supportedRegions.includes(region) && !hasXDKRedirect && !isValidLocation) {

    let urlRedirect = '';
    const environment = env === 'test' ? env : '';
    const version = '392V17'
    const shortVersion = '392'
    const ps4Version = '392V18'	
    switch (platform) {
      case 'samsung':
      case 'sony':
      case 'hisense':
      case 'opera':
        urlRedirect = `http://tv2${platform}${environment}.clarovideo.net/${version}/FRONTEND/`;
        break;
      case 'tizen':
        urlRedirect = `https://${platform}${environment}.clarovideo.net/${version}/FRONTEND/`;
        break;
      case 'ps4':
        urlRedirect = `http://playstation4${environment}.clarovideo.net/${ps4Version}/FRONTEND/`;
        break;
      case 'lg':
      case 'web0s':
        urlRedirect = `http://tv2lg${environment}.clarovideo.net/${shortVersion}/FRONTEND/`;
        break;
      case 'workstation':
        urlRedirect = `http://tv2sony${environment}.clarovideo.net/${version}/FRONTEND/`;
        break;
      case 'android':
      case 'nagra':
        //TODO: Estos dispositivos no tienen un endpoint productivo, no se redireccionan.
        break;
      default:
        break;
    }
    if (urlRedirect !== '') {
      console.log('[loader] Se redirecciona a versión productiva anterior: ' + urlRedirect);
      window.location.replace(urlRedirect);
    }
  }
}

export async function apaMetadata(region = "") {
    let result;
    try {
        const apaMetadataTask = new ApaMetadataTask(region);
        result = await RequestManager.addRequest(apaMetadataTask);
        console.log("[apaMetadata]", result);
        /* TODO This if will be removed. Android native need to refactor some things */
        if(isAndroid && window.AndroidPlayerInterface){
            window.AndroidPlayerInterface.saveApaMetadataTask(JSON.stringify(result));
        }


    } catch (err) {
        console.error("[apaMetadata] err: ", err);
    }
    return new Promise((resolve, reject) => {
        resolve(result);
    });
}

export async function apaAsset(region = "") {
    let result;
    try {
        const apaAssetTask = new ApaAssetTask(region);
        result = await RequestManager.addRequest(apaAssetTask);

        /* TODO This if will be removed. Android native need to refactor some things */
        if(isAndroid && window.AndroidPlayerInterface ){
            window.AndroidPlayerInterface.saveApaAssetTask(JSON.stringify(result));
        }


    } catch (err) {
        console.error("[apaAsset] err: ", err);
    }
    return new Promise((resolve, reject) => {
        resolve(result);
    });
}

export async function apaLegals(region = "") {
    let result;
    try {
        const apaLegalsTask = new ApaLegalsTask(region);
        result = await RequestManager.addRequest(apaLegalsTask);

        /* TODO Not yet implemented on android */
        // if(isAndroid && window.AndroidPlayerInterface ){
        //     window.AndroidPlayerInterface.saveApaLegalsTask(JSON.stringify(result));
        // }


    } catch (err) {
        console.error("[apaLegals] err: ", err);
    }
    return new Promise((resolve, reject) => {
        resolve(result);
    });
}

export async function apaLauncher(region = "") {
    let result;
    try {
        const apaLauncherTask = new ApaLauncherTask(region);
        result = await RequestManager.addRequest(apaLauncherTask);

    } catch (err) {
        console.error("[apaLauncher] err ", err);
        result = err;
    }
    //console.error("[loader.apaLauncher] ", result);
    return new Promise((resolve, reject) => {
        resolve(result);
    });
}

export async function badges(region = "") {
  let result;
  try {
    const badgesTask = new BadgesTask(region);
    result = await RequestManager.addRequest(badgesTask);
  } catch (err) {
    console.error("Error calling middleware badges: ", err);
  }
  return new Promise((resolve, reject) => {
    resolve(result);
  });
}


export async function fetchFavoriteLoader(user, filterList = null) {
    let result;
    const p = {
        user_hash: user.session_userhash,
        lasttouch: user.lasttouch ? user.lasttouch.favorited : null,
      //TODO: esto se platico con Rich y hasta la definicion final se quedara tentativamente asi.
        filterlist: filterList ? filterList : '30849',
    }

    try {
        let params = new UserFavoriteTask(p);
        result = await RequestManager.addRequest(params);
    } catch(err) {
        console.error("Error calling fetchFavoriteLoader: ", err);
    }
    return new Promise((resolve, reject) => {
        resolve(result);
    });
}

export async function pushSession(user_id) {
  let result;
  try{
    const pushSessionTask = new PushSessionTask(user_id);
    result = await RequestManager.addRequest(pushSessionTask);
    return new Promise((resolve, reject) => {
      resolve(result);
    });
  } catch (err) {
    console.error("Error PushSessionTask: ", err);
    return new Promise((resolve, reject) => {
      reject(err);
    })
  }
}

export async function isLoggedIn() {

    let result;
    try {
        const isLoggedInTask = new IsLoggedInTask(true);
        result = await RequestManager.addRequest(isLoggedInTask);

        if (storage.getItem("IsLogOut")) {
          storage.unsetItem('IsLogOut');
          result.response.is_user_logged_in = 0;
        }

        if (result && result.response && result.response.region)
        {
        // Youbora
        window.youboraRegion = result.response.region;

          const user_hash = result.response.session_userhash;
          const regionUser = result.response.region;
          const sub_region = result.response.subregion;
          const regionStorage = storage.getItem('region');
          user_hash && storage.setItem('user_hash', user_hash);
          sub_region && storage.setItem("sub_region",sub_region);
          if(EpgPersistence.isEnabled()){
            EpgPersistence.setSubRegion(sub_region);
          }

            if (regionUser !== regionStorage) {
                storage.setItem('region', regionUser);
                console.info("[loader] isloggedin region", regionUser);
                window.location.href='/'
            }

            // Youbora: data para youbora
            if(result.response && Array.isArray(window.youboraParams) && window.youboraParams.length > 0){
                console.log("[result.response]", result.response);
                if(result.response.paywayProfile && result.response.paywayProfile.paymentMethods){
                    result.response.paywayProfile.paymentMethods.map( item => {
                        window.youboraParams[0].value += (window.youboraParams[0].value.length===0 ) ? item.user_category : '-'+item.user_category;
                    });
                }
                window.youboraParams[4].value = result.response.email || "";
                window.youboraParams[8].value = result.response.region || "";

                console.log("IsLoggedInTask result.response", result.response);
            }

        }

        // Youbora
        window.youboraUserId = result.response.user_id;
        youboraLauncher();

        if(isAndroid && window.AndroidPlayerInterface){
          window.AndroidPlayerInterface.saveIsLoggedIn(JSON.stringify(result));
        }

    } catch(err) {
        console.error("Error calling isLoggedInTask: ", err);
    }
    return new Promise((resolve, reject) => {
        resolve(result);
    });
}

export async function loginDynamic(email) {
  let result;
  try {
    const loginDynaminTask = new LoginDynaminTask(email);
    result = await RequestManager.addRequest(loginDynaminTask);
    const music_token = result.response.profile.token;

    storage.setItem('music_token', music_token);
  } catch(err) {
    console.error("Error calling loginDynamicTask: ", err);
  }
  return new Promise((resolve, reject) => {
    resolve(result);
  });
}

export async function editMusicUserProfile(user, userTV) {
  let result;
  try {
    const email = userTV.email;
    const name = userTV.firstname;
    const lastName = userTV.lastname;
    const bornDate = userTV.bornDate || '01/01/1912';
    const sex = userTV.sex || 'M';
    const headers = {
      "Content-Type": "application/json",
    }
    const editMusicUserTask = new MusicTask('settings/editUserProfileSTV', user, {method: 'POST',email, name, lastName, bornDate, sex, countryCode: user.countryCode}, headers);
    result = await RequestManager.addRequest(editMusicUserTask);
  } catch(err) {
    console.error("Error calling editMusicUserProfile: ", err);
  }

  return new Promise((resolve, reject) => {
    resolve(result);
  });
}

export async function UserSeenLast(group_id) {
  let result;
  try {
    const UserSeenLastTask1 = new UserSeenLastTask(group_id);
    result = await RequestManager.addRequest(UserSeenLastTask1);
    return new Promise(resolve => {
      resolve(result.response);
    })
  } catch(err) {
    console.error("Error calling UserSeenLast: ", err);
    return new Promise((resolve, reject) => {
      reject(err);
    })
  }
}

export async function linealChannels(userId = null) {
    let result;
    try {
        const linealChannelsTask = new LinealChannelsTask(userId);
        result = await RequestManager.addRequest(linealChannelsTask);

        // Youbora
        if(Array.isArray(window.youboraParams) && window.youboraParams.length > 0){
            if(result && result.response && result.response.paqs && result.response.paqs.paq){
                result.response.paqs.paq.map( item =>{
                    // if(item.key) window.youboraParams[1].value += (window.youboraParams[1].value.length===0) ? item.key : '-'+item.key;
                    // if(item.key) window.youboraParams[2].value = item.key;
                    if(item.paymentmethod && item.paymentmethod.gateway) window.youboraParams[5].value = item.paymentmethod.gateway;
                });
            }
        }


        return new Promise((resolve, reject) => {
            // For debug:
            //result = {"entry":{"HKS":"rpl4p8ks6cnp9o87a8m81p3uh6","api_version":"v5.8","authpn":"amco","authpt":"12e4i8l6a581a","device_category":"tv","device_manufacturer":"sony","device_model":"sony","device_type":"tv","device_id":"cacddd6d-d6b3-11a8-25ea-b6cba4f568aa","device_name":"sony","device_so":"default","region":"mexico","format":"json","user_id":"19258976"},"response":{"paqs":{"paq":[{"name":"TVGRT","offerid":"","purchaseid":"","play":"1","npvrstorage":"","timeshift":"","payway_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxOTI1ODk3NiwibmFtZSI6IlRWR1JUIiwib2ZmZXJpZCI6IiIsInB1cmNoYXNlaWQiOiIiLCJwbGF5IjoiMSIsIm9iamVjdF9pZCI6IiIsIm5wdnJzdG9yYWdlIjoiIiwidGltZXNoaWZ0IjoiIiwiZ3JvdXBzIjoiNzU1NDAyLDczOTQ4OSw3MjUyMDksNzE3MDI0In0.zYugVLCdIBaUEFJqfqjGDsSj5xPxF8Y3y2YZK2XjkQU","groups":"755402,739489,725209,717024"},{"name":"FOX","offerid":"14327208","purchaseid":"259955052","play":"1","npvrstorage":"24","timeshift":"24","payway_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxOTI1ODk3NiwibmFtZSI6IkZPWCIsIm9mZmVyaWQiOiIxNDMyNzIwOCIsInB1cmNoYXNlaWQiOiIyNTk5NTUwNTIiLCJwbGF5IjoiMSIsIm9iamVjdF9pZCI6IjI2ODAiLCJucHZyc3RvcmFnZSI6IjI0IiwidGltZXNoaWZ0IjoiMjQiLCJncm91cHMiOiI3NjI3NTQsNzYyNzg1LDc2MjgwMCw3NjI3NjksNzYyNzg4LDc2Mjc2OCw3NjI3NzAsNzYyNzg3LDc2MjgwMiw3NjI3ODYsNzYyODAxLDc1Mzk5NCw3NDY0NzgsNzQ1NzM2LDc0NTgzMiw3NDU5MjEsNzQ1OTIwLDc0NTkzOSJ9.lDZpKtkPLITMHtSobInnNoLkNK-VC-HtS4af1oTjlr0","groups":"762754,762785,762800,762769,762788,762768,762770,762787,762802,762786,762801,753994,746478,745736,745832,745921,745920,745939"},{"name":"HBO","offerid":"14327084","purchaseid":"261780866","play":"1","npvrstorage":"","timeshift":"","payway_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxOTI1ODk3NiwibmFtZSI6IkhCTyIsIm9mZmVyaWQiOiIxNDMyNzA4NCIsInB1cmNoYXNlaWQiOiIyNjE3ODA4NjYiLCJwbGF5IjoiMSIsIm9iamVjdF9pZCI6bnVsbCwibnB2cnN0b3JhZ2UiOiIiLCJ0aW1lc2hpZnQiOiIiLCJncm91cHMiOiI3NTA5MTEifQ.xR3-7oPm3iiPm4Zy-W8s63jA3Iv6hP82kbENKiJc4Hk","groups":"750911"}]}},"status":"0","msg":"OK"};
            resolve(result);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
}

export async function listChannels() {
  let result;
  try {
    const listChannelsTask = new ChannelsTask();
    result = await RequestManager.addRequest(listChannelsTask);
    return new Promise((resolve, reject) => {
      resolve(result);
    });
  } catch (err) {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  }
}

export async function activateControlPin(params = {}) {
    let result;
    try {
        const activateControlPinTask = new ActivateControlPinTask(params);
        result = await RequestManager.addRequest(activateControlPinTask);
        return new Promise((resolve, reject) => {
            resolve(result);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
}

export async function activateControlPinWithoutEmail(params = {}) {
  let result;
  try {
    const activateControlPinWithoutEmailTask = new ActivateControlPinWithoutEmailTask(params);
    result = await RequestManager.addRequest(activateControlPinWithoutEmailTask);
    return new Promise((resolve, reject) => {
      resolve(result);
    });
  } catch (err) {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  }
}

export async function changeControlPin(params = {}) {
    let result;
    try {
        const changeControlPinTask = new ChangeControlPinTask(params);
        result = await RequestManager.addRequest(changeControlPinTask);
        return new Promise((resolve, reject) => {
            resolve(result);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
}

export async function checkControlPin(params = {}) {
    let result;
    try {
        const checkControlPinTask = new CheckControlPinTask(params);
        result = await RequestManager.addRequest(checkControlPinTask);
        return new Promise((resolve, reject) => {
            resolve(result);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
}

export async function remindControlPin(params = {}) {
    let result;
    try {
        const remindControlPinTask = new RemindControlPinTask(params);
        result = await RequestManager.addRequest(remindControlPinTask);
        return new Promise((resolve, reject) => {
            resolve(result);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
}

export async function modifyControlPin(params = {}) {
    let result;
    try {
        const modifyControlPinTask = new ModifyControlPinTask(params);
        result = await RequestManager.addRequest(modifyControlPinTask);
        return new Promise((resolve, reject) => {
            resolve(result);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
}

export async function register(params = {}) {
    let result;
    try {
        params = Utils.encodeParams(params);
        const registerTask = new RegisterTask(params);
        result = await RequestManager.addRequest(registerTask);

        return new Promise((resolve, reject) => {
            resolve(result);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
}

export async function login(params = {}) {
    let result;
    try {
        const loginTask = new LoginTask(params);
        result = await RequestManager.addRequest(loginTask);
        console.log("IsLoggedInTask LoginTask", result);

        // Youbora
        window.youboraRegion = result.response.region;
        window.youboraUserId = result.response.user_id;
        youboraLauncher();

        // Youbora: data para youbora
        if(result.response && Array.isArray(window.youboraParams) && window.youboraParams.length > 0){
            console.log("[result.response]", result.response);
            if(result.response.paywayProfile && result.response.paywayProfile.paymentMethods){
                result.response.paywayProfile.paymentMethods.map( item => {
                    window.youboraParams[0].value += (window.youboraParams[0].value.length===0 ) ? item.user_category : '-'+item.user_category;
                });
            }

            window.youboraParams[4].value = result.response.email || "";
            window.youboraParams[8].value = result.response.region || "";

            console.log("IsLoggedInTask result.response", result.response);
        }


        return new Promise((resolve, reject) => {
            resolve(result);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
}

export async function login360(params = {}) {
    let result;
    try {
        const login360Task = new Login360Task(params);
        result = await RequestManager.addRequest(login360Task);
        return new Promise((resolve, reject) => {
            resolve(result);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
}

export async function loginNET(params = {}) {
    let result;
    try {
        const loginNETTask = new LoginNETTask(params);
        result = await RequestManager.addRequest(loginNETTask);
        return new Promise((resolve, reject) => {
            resolve(result);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
}

export async function CpfQuery(params = {}) {
    let result;
    try {
        const cpfQueryTask = new CpfQueryTask(params);
        result = await RequestManager.addRequest(cpfQueryTask);
        return new Promise((resolve, reject) => {
            resolve(result);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
}

export async function sendPasswordReminder(params = {}) {
    let result;
    try {
        const sendPasswordReminderTaks = new SendPasswordReminderTaks(params);
        result = await RequestManager.addRequest(sendPasswordReminderTaks);
        return new Promise((resolve, reject) => {
            resolve(result);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
}

export async function setTermsAndConditions(params = {}) {
    let result;
    try {
        const setTermsAndConditionsTask = new SetTermsAndConditionsTask(null, params);
        result = await RequestManager.addRequest(setTermsAndConditionsTask);
        return new Promise((resolve, reject) => {
            resolve(result);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
}

export async function workflowstart(params = {}) {
    let result;
    try {
        const workflowTask = new WorkflowTask(params);
        result = await RequestManager.addRequest(workflowTask);
        return new Promise((resolve, reject) => {
            resolve(result);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
}

export async function paywayConfirm (url, params = {}) {
    let result;
    try {
        const confirmTask = new ConfirmTask(url, params);
        result = await RequestManager.addRequest(confirmTask);
        return new Promise((resolve, reject) => {
            resolve(result);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
}

export async function smartCardLogin() {
    let result;
    try {
        const smartCardLoginTask = new SmartCardLoginTask();
        result = await RequestManager.addRequest(smartCardLoginTask);
      //  const HKS = result.response.data.session_stringvalue;
       // storage.setItem('HKS', HKS);

      if(result && result.response && result.response.data)
      {
        storage.setItem('region', result.response.data.region);
        // storage.setItem('region',result.response.region);
        storage.setItem('user_hash', result.response.data.session_userhash);
      }
    } catch(err) {
        console.error("Error calling smartCardLoginTask: ", err);
    }
    return new Promise((resolve, reject) => {
        if (result && result.status === "0") {
            resolve(result);
        } else {
            reject(result);
        }
    });
}



export async function authdevice(params = {}) {
  let result;
  try {
    const authdevicenTask = new authdeviceTask(params);
    result = await RequestManager.addRequest(authdevicenTask);
    console.log('authdeviceTask',result)
    if(result && result.response && result.response.data)
    {
      storage.setItem('region', result.response.data.region);
      // storage.setItem('region',result.response.region);
      storage.setItem('user_hash', result.response.data.session_userhash);
    }
  } catch(err) {
    result=err;
    console.error("Error calling auth: ", err);
  }
  return new Promise((resolve, reject) => {
    if (result && result.status === "0") {
      resolve(result);
    } else {

      reject(result);
    }
  });
}

export async function navData() {
    let result;
    try {
        const navDataTask = new NavDataTask();
        result = await RequestManager.addRequest(navDataTask);
    } catch (err) {
        console.error("Error calling navData: ", err);
    }
    return new Promise((resolve, reject) => {
        if (result && result.status === "0") {
            resolve(result.response.nodes);
        } else {
            reject(result);
        }
    });
}

export async function contentData(groupId = "") {
  let result;
  try {
    const contentDataTask = new ContentDataTask(groupId);
    result = await RequestManager.addRequest(contentDataTask);
  } catch(err) {
    console.error("Error calling contentData: ", err);
  }
  return new Promise((resolve, reject) => {
    if(result && result.status === "0") {
      resolve(result.response);
    } else {
      reject(result);
    }
  });
}

export async function contentSerie(groupId = "") {
  let result;
  try {
    const contentSerieTask = new ContentSerieTask(groupId);
    result = await RequestManager.addRequest(contentSerieTask);
  } catch(err) {
    console.error("Error calling contentSerie: ", err);
  }
  return new Promise((resolve, reject) => {
    if(result && result.status === "0") {
      resolve(result.response);
    } else {
      reject(result);
    }
  });
}

export function getBookmark(groupId = "") {
  let result;
  try {
    const getBookmarkTask = new GetBookmarkTask(groupId);
    result = RequestManager.addRequest(getBookmarkTask);
  } catch(err) {
    console.error("Error calling getBookmark: ", err);
  }
  return result
}

export async function purchaseButtonInfo(groupId = "") {
  let result;
  try {
    const purchaseButtonInfoTask = new PurchaseButtonInfoTask(groupId);
    result = await RequestManager.addRequest(purchaseButtonInfoTask);
  } catch(err) {
    console.error("Error calling purchaseButtonInfo: ", err);
  }
  return new Promise((resolve, reject) => {
    if(result && result.status === "0") {
      resolve(result.response);
    } else {
      reject(result);
    }
  });
}

export async function PurchaseButtonInfov585(params) {
  let result;
  try {

    const purchaseButtonInfov585Task = new PurchaseButtonInfov585Task(params);
    result = await RequestManager.addRequest(purchaseButtonInfov585Task);

  } catch (err) {
    console.error("Error calling PurchaseButtonInfov5_85: ", err);

    if (err.completeError && err.completeError.response) {
      return new Promise((resolve, reject) => {
        resolve(err.completeError.response);
      });
    }
    
  }
  return new Promise((resolve, reject) => {
    if (result && result.status === "0") {
      resolve(result.response);
    } else {
      reject(result);
    }
  });
}

export async function contentRecomendations(groupId = "", quantity = 10) {
  let result;
  try {
    let filterlist_configuration = JSON.parse(Metadata.get('byr_filterlist_configuration','{}'));
    let filterListByRegion = {filterlist: ''};
    if(filterlist_configuration && !Utils.isEmpty(filterlist_configuration)){
        const region = localStorage.getItem('region');
        filterListByRegion = filterlist_configuration[region] ? filterlist_configuration[region] : filterlist_configuration['default'];
    }
    const contentRecommendationsTask = new ContentRecommendationsTask(groupId, quantity, filterListByRegion.filterlist);
    result = await RequestManager.addRequest(contentRecommendationsTask);
  } catch (err) {
    console.error("Error calling contentRecomendations: ", err);
  }
  return new Promise((resolve, reject) => {
    if (result && result.status === "0") {
      resolve(result.response.groups || []);
    } else {
      reject(result);
    }
  });
}

export async function playerGetMedia(groupId = "", contentId = "", isTrailer = false, streamType = "", startTime = "", endTime = "", payway_token = "", showErrorModal) {
  let result;
  try {
    const playerGetMediaTask = new PlayerGetMediaTask(groupId, contentId, isTrailer, streamType, startTime, endTime, payway_token, showErrorModal);
    result = await RequestManager.addRequest(playerGetMediaTask);
    console.info("[loader.playerGetMedia]", result);
  } catch(err) {
    console.error("Error calling playerGetMedia: ", err);
    result = err;
  }
  return new Promise((resolve, reject) => {
    console.info("[loader.playerGetMedia]", result);
    // Hardcoded para max devices o cualquier error 400 de pgm
    // result = {"entry":{"group_id":"753994","stream_type":"smooth_streaming","preview":"0","HKS":"41kcjksnq9p6mnjsjti1127hk6","api_version":"v5.82","authpn":"amco","authpt":"12e4i8l6a581a","device_category":"tv","device_manufacturer":"hisense","device_model":"hisense","device_type":"tv","device_id":"4480b11c-9530-ce6e-faae-d18e13a88079","device_name":"hisense","device_so":"2.4.2","region":"mexico","format":"json"},"status":400,"errors":[{"message":"You have reached the maximum number of devices in your account","code":"PLY_DEV_00006","exception":"L2luZXRwdWIvc2VydmljZXMvc3JjL0FtY28vRGV2aWNlLnBocCA0MzU="}]};

    if(result.status == "200" || result.status == "400" || result.status == 500) {
        if(result.status == "200") {
            // Guardar entry para manejar errores durante pérdida de internet mientras el player esta reproduciendo
            result.response.entry = result.entry;
          resolve(result.response);

          if (result.response && result.response.user && result.response.user.lasttouch) {
            store.dispatch(setLastTouchData(result.response.user.lasttouch));
          }

        }
        if(result.status == "400" || result.status == 500) {
            resolve(result);
        }
    } else {
      reject(result);
    }
  });
}

export async function verticalLookUp(value, field, from, quantity) {
  let result;
  try {
    const verticalLookUpTask = new VerticalLookUp(value, field, from, quantity);
    result = await RequestManager.addRequest(verticalLookUpTask);
  } catch(err) {
    console.error("Error calling verticalLookUp: ", err);
  }
  return new Promise((resolve, reject) => {
    if(result.status == "0") {
      resolve(result.response.groups);
    } else {
      reject(result);
    }
  });
}

export async function verticalSearch(value, field, from, quantity) {
  let result;
  try {
    const verticalTask = new Vertical(value, field, from, quantity);
    result = await RequestManager.addRequest(verticalTask);
  } catch (err) {
    console.error("Error calling vertical: ", err);
  }
  return new Promise((resolve, reject) => {
    if (result.status == "0") {
      resolve(result.response.groups);
    } else {
      reject(result);
    }
  });
}


export async function vertical(value, field, provider_id, from, quantity) {
  let result;
  try {
    const verticalTask = new Vertical(value, field, provider_id, from, quantity);
    result = await RequestManager.addRequest(verticalTask);
  } catch(err) {
    console.error("Error calling verticalLookUp: ", err);
  }
  return new Promise((resolve, reject) => {
    if(result.status == "0") {
      resolve(result.response.groups);
    } else {
      reject(result);
    }
  });
}

export async function deviceAttach(groupId) {
  let result;
  try {
    const deviceAttachTask = new DeviceAttachTask(groupId);
    result = await RequestManager.addRequest(deviceAttachTask);
    return Promise.resolve(result.response);
  } catch(err) {
    console.error("Error calling deviceAttach: ", err);
    return Promise.reject(err);
  }
}

export async function getAppVersion() {
  let result;
  try {
    const appVersionTask = new AppVersionTask();
    result = await RequestManager.addRequest(appVersionTask);
    return Promise.resolve(result.response);
  } catch(err) {
    console.error("Error calling appVersionTask ", err);
    return Promise.reject(err);
  }

}

export async function getEpgVersionFromService() {
  let result;
  try {
    const epgVersionTask = new EpgVersionTask();
    result = await RequestManager.addRequest(epgVersionTask);
    if(result && result.response && result.response)
      return Promise.resolve(result.response);
    else
      return Promise.resolve(null);
  } catch(err) {
    console.error("[EpgVersionStatus] Error calling epgVersionTask ", err);
    return Promise.resolve(null);
  }

}

export async function getAvatar() {
  let result;
  try {
    const avatarsTask = new AvatarsTask();
    result = await RequestManager.addRequest(avatarsTask);
    if (result && result.response && result.response)
      return Promise.resolve(result.response);
    else
      return Promise.resolve(null);
  } catch (err) {
    console.error("[getAvatar] Error calling AvatarsTask ", err);
    return Promise.resolve(err);
  }
}
export async function createProfile(params) {
  let result;
  try {
    const createProfileTask = new CreateProfileTask(params);
    result = await RequestManager.addRequest(createProfileTask);
    return Promise.resolve(result);
  } catch (err) {
    console.error("[createProfile] Error calling createProfileTask ", err);
    return Promise.resolve(err);
  }
}
export async function deleteProfile(params) {
  let result;
  try {
    const deleteProfileTask = new DeleteProfileTask(params);    
    result = await RequestManager.addRequest(deleteProfileTask);    
    return Promise.resolve(result);
  } catch (err) {
    console.error("[deleteProfile] Error calling deleteProfileTask ", err);
    return Promise.resolve(err);
  }
}
export async function readProfile(params) {
  let result;
  try {
    const readProfileTask = new ReadProfileTask(params);
    result = await RequestManager.addRequest(readProfileTask);
    if (result && result.response && result.response)
      return Promise.resolve(result.response);
    else
      return Promise.resolve(null);
  } catch (err) {
    console.error("[readProfile] Error calling readProfileTask ", err);
    return Promise.resolve(err);
  }
}
export async function updateProfile(params) {
  let result;
  try {
    const updateProfileTask = new UpdateProfileTask(params);   
    result = await RequestManager.addRequest(updateProfileTask);    
    return Promise.resolve(result);
  } catch (err) {
    console.error("[updateProfile] Error calling updateProfileTask ", err);
    return Promise.resolve(err);
  }
}

export async function addFavorite(groupId) {
  let result;
  try {
    const addFavoriteTask = new AddFavoriteTask(groupId);
    result = await RequestManager.addRequest(addFavoriteTask);
    return Promise.resolve(result);
  } catch (err) {
    console.error("[addFavorite] Error calling AddFavoriteTask ", err);
    return Promise.resolve(err);
  }
}

export async function deleteFavorite(groupId) {
  let result;
  try {
    const deleteFavoriteTask = new DeleteFavoriteTask(groupId);
    result = await RequestManager.addRequest(deleteFavoriteTask);
    return Promise.resolve(result);
  } catch (err) {
    console.error("[deleteFavorite] Error calling DeleteFavoriteTask ", err);
    return Promise.resolve(err);
  }
}

export async function blockChannel(groupId) {
  let result;
  try {
    const addBlockedChannelsTask = new AddBlockedChannelsTask(groupId);
    result = await RequestManager.addRequest(addBlockedChannelsTask);
    return Promise.resolve(result);
  } catch (err) {
    console.error("[blockChannel] Error calling addBlockedChannelsTask ", err);
    return Promise.resolve(err);
  }
}

export async function unblockChannel(groupId) {
  let result;
  try {
    const deleteBlockedChannelsTask = new DeleteBlockedChannelsTask(groupId);
    result = await RequestManager.addRequest(deleteBlockedChannelsTask);
    return Promise.resolve(result);
  } catch (err) {
    console.error("[unblockedChannel] Error calling DeleteBlockedChannelsTask ", err);
    return Promise.resolve(err);
  }
}

export async function checkBlockedChannel(groupId) {
  console.log('GCR api.checkBlockedChannel', groupId);
  let result;
  try {
    const checkBlockedChannelsTask = new CheckBlockedChannelsTask(groupId);
    result = await RequestManager.addRequest(checkBlockedChannelsTask);
    return Promise.resolve(result);
  } catch (err) {
    console.error("[checkBlockedChannel] Error calling CheckBlockedChannelsTask ", err);
    return Promise.resolve(err);
  }
}

export async function createReminder(eventId, expDate, typeEvent, channelId) {
  let result;
  try {
    const reminderCreateTask = new ReminderCreateTask(eventId, expDate, typeEvent, channelId);
    result = await RequestManager.addRequest(reminderCreateTask);
    return Promise.resolve(result);
  } catch (err) {
    console.error("[createReminder] Error calling ReminderCreateTask ", err);
    return Promise.resolve(err);
  }
}

export async function deleteReminder(reminderId) {
  let result;
  try {
    const reminderDeleteTask = new ReminderDeleteTask(reminderId);
    result = await RequestManager.addRequest(reminderDeleteTask);
    return Promise.resolve(result);
  } catch (err) {
    console.error("[deleteReminder] Error calling ReminderDeleteTask ", err);
    return Promise.resolve(err);
  }
}

export async function getReminders() {
  let result;
  try {
    const reminderListTask = new ReminderListTask();
    result = await RequestManager.addRequest(reminderListTask);
    return Promise.resolve(result);
  } catch (err) {
    console.error("[getReminders] Error calling ReminderListTask ", err);
    return Promise.resolve(err);
  }
}

export async function getPinStatus() {
  let result;
  try {
    const userControlPinStatusTask = new UserControlPinStatusTask();
    result = await RequestManager.addRequest(userControlPinStatusTask);
    return Promise.resolve(result);
  } catch (err) {
    console.error("[getPinStatus] Error calling userControlPinStatusTask ", err);
    return Promise.resolve(err);
  }
}


export async function getPureEpg(params) {
  let result;
  try {
    const pureEpgTask = new PureEpgTask(params);
    result = await RequestManager.addRequest(pureEpgTask);
    if(result && result.response)
      return Promise.resolve(result.response);
    else
      return Promise.resolve(null);
  } catch(err) {
    console.error("[getPureEpg] Error calling getPureEpg ", err);
    return Promise.resolve({});
  }
}

export async function getFilters(params) {
  let result;
  try {
    const filtersTask = new FiltersTask(params);
    result = await RequestManager.addRequest(filtersTask);
    if(result && result.response)
      return Promise.resolve(result.response);
    else
      return Promise.resolve(null);
  } catch(err) {
    console.error("[getPureEpg] Error calling getPureEpg ", err);
    return Promise.resolve({});
  }
}

export async function getLevel(url, params) {
  let result;
  try {
    const levelTask = new LevelRibbonTask(url, params);
    result = await RequestManager.addRequest(levelTask);
    if(result && result.response)
      return Promise.resolve(result.response);
    else
      return Promise.resolve(null);
  } catch(err) {
    console.error("[getPureEpg] Error calling getPureEpg ", err);
    return Promise.resolve({});
  }
}
