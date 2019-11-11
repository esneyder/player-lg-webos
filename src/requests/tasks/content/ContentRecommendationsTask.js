import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class ContentRecommendations extends AbstractRequestTask {

    constructor(groupId = {}, quantity = 10, filterlist = "31032,30978") {
        super();

        this.groupId = groupId;
        this.quantity = quantity;
        this.filterlist = filterlist;
    }

    getHeaders() {
        return {};
    }

    getUrl() {
      const http = "https://";
      const url = Launcher.get("akamai_mfwk");
      return `${http}${url}/services/content/recommendations`;
    }

    getParams() {
        const params = super.getParams();
        const newParams = {
          group_id: this.groupId,
          quantity: this.quantity,
          order_id: "ASC",
          order_way: "ASC",
          filterlist: this.filterlist
        };

        return { ...params, ...newParams };
    }

    success(data, b) {
        this.resolve(data);
    }
}

export default ContentRecommendations;
