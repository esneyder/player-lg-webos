import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class ContentDataTask extends AbstractRequestTask {
  constructor(groupId = "") {
    super();

    this.groupId = groupId;
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/content/data`;
  }

  getParams() {
    const params = super.getParams();
    return {
      group_id: this.groupId,
      ...params,
      // user_hash: "",
    };
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default ContentDataTask;
