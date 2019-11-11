import AbstractRequestTask from "../AbstractRequestTask";
import Device from "../../../devices/device";

class StartHeaderInfoTask extends AbstractRequestTask {
    constructor(HKS = "") {
        super();

        this.HKS = HKS;
    }

    getHeaders() {
        return {};
    }

    getParams() {
        const params = super.getParams();

        const HKS = this.HKS || params.HKS;

        return {
          HKS,
          authpn: params.authpn,
          authpt: params.authpt,
          format: params.format
        };
    }

    getUrl() {
        return `${Device.getDevice().getConfig().end_point_apa}services/user/startheaderinfo`;
    }

    success(data, b) {
        this.resolve(data);
    }
}

export default StartHeaderInfoTask;
