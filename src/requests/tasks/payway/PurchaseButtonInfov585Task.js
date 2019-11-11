import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';
      
class PurchaseButtonInfov585Task extends AbstractRequestTask {
  constructor(params) {    
    super();    
    this.groupId = params.groupId;
    this.seasonId = params.seasonId;
  }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");
      return `${http}${url}/services/payway/purchasebuttoninfo`;
    }

    getParams() {
      const params = super.getParams();
      return {
        group_id: this.groupId,
        season_id: this.seasonId,
        ...params,        
    };
    }

    success(data, b) {
      this.resolve(data);
    }
  }

export default PurchaseButtonInfov585Task;
               
