import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';
import DeviceStorage from "../../../components/DeviceStorage/DeviceStorage";
import Metadata from "../../apa/Metadata";
import FilterList from "../../../utils/FilterList";

class VerticalLookUp extends AbstractRequestTask {
  constructor(value = "", field = "", provider_id ="", from = 0, quantity = 20) {
    super();

    this.value = value;
    this.field = field;
    this.from = from;
    this.quantity = quantity;
    this.provider_id= provider_id;
  }

  APAFilters(){
    let filters=Metadata.get("byr_filterlist_configuration");
    let region=DeviceStorage.getItem("region");

    try{
      filters=JSON.parse(filters);
      if(filters)
        filters=filters[region];
      if(filters)
      {
        filters=filters['filterlist'];
      }
      if(filters) {
        return filters

      }
    }
    catch(e)
    {
      return null
    }
    return null
  }

  getHeaders() {
    return {};
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/search/vertical`;
  }

  getParams() {
    const epg_version = DeviceStorage.getItem('epgVersion');
    const params = super.getParams();
    return {
      ...params,
      value: this.value,
      field: this.field,
      from: this.from,
      quantity: this.quantity,
      epg_version,
      provider_id: this.provider_id ? this.provider_id : '2', // default AMCO --> https://dlatvarg.atlassian.net/wiki/spaces/GCV/pages/204078641/search+vertical+V6
      filterlist: this.APAFilters()
    };
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default VerticalLookUp;
