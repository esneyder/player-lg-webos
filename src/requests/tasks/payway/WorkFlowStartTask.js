import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class WorkflowTask extends AbstractRequestTask {
    constructor(params = {
        groupId: "",
        offerId: "",
        linkworkflowstartParams: {},

    }) {
        super();

        this.groupId = params.groupId;
        this.offerId = params.offerId;
        this.linkworkflowstartParams = params.linkworkflowstartParams;
    }

    getUrl() {
        const http = "https://";
        const url = Launcher.get("akamai_mfwk");
        return `${http}${url}/services/payway/workflowstart`;
    }

    getParams() {

        const params = super.getParams();       

        if (this.groupId === undefined) {
            //suscripcion desde registro                
            console.log(this.linkworkflowstartParams);
            return {
                ...this.linkworkflowstartParams,
                ...params,
            };
        }
        else {            
            return {
                group_id: this.groupId,
                offer_id: this.offerId,
                object_type: "G",
                ...params,
            };
        }
    }

    success(data, b) {
        this.resolve(data);
    }
}

export default WorkflowTask;
