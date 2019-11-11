import AbstractRequestTask from "../AbstractRequestTask";
import Launcher from '../../apa/Launcher';
import FilterList from "../../../utils/FilterList";
import DeviceStorage from "../../../components/DeviceStorage/DeviceStorage";

class VerticalLookUp extends AbstractRequestTask {
  constructor(value = "", field = "", from = 0, quantity = 20) {
    super();

    this.value = value;
    this.field = field;
    this.from = from;
    this.quantity = quantity;
  }

  getHeaders() {
    return {};
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");
    return `${http}${url}/services/search/verticallookup`;
  }

  getParams() {
    const params = super.getParams();
    const epg_version = DeviceStorage.getItem('epgVersion');
    let filterlist = FilterList.getFilter();
    filterlist = filterlist && filterlist.filterlist ? filterlist.filterlist : '';    
    return {
      ...params,
      value: this.value,
      field: this.field,
      from: this.from,
      epg_version,
      quantity: this.quantity,
      filterlist
    };
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default VerticalLookUp;
