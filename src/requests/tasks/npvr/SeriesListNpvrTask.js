import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';

class SeriesListNpvrTask extends AbstractRequestTask {
  constructor({ userToken, serieId, seasonId, groupId, language }) {
    super();

    this.groupId = groupId;
    this.serieId = serieId;
    this.seasonId = seasonId;
    this.language = language;
    this.userToken = userToken;
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/recordings/series/list`;
  }

  getParams() {
    const params = super.getParams();
    const extraParams = {
      user_token: this.userToken,
      serie_id: this.serieId,
      season_id: this.seasonId,
      group_id: this.groupId,
      language: this.language,
    };
    return { ...params, ...extraParams };
  }

  getShowModal() {
    return false;
  }
}

export default SeriesListNpvrTask;
