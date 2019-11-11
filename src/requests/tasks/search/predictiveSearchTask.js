import AbstractRequestTask from "../AbstractRequestTask";
import Metadata from '../../apa/Metadata';
import DeviceStorage from '../../../components/DeviceStorage/DeviceStorage';
import Launcher from "../../apa/Launcher";
import Utils from '../../../utils/Search';

class predictiveSearchTask extends AbstractRequestTask {
  constructor(parameters) {
    super();
    this.customParameters = parameters;
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
          // Resultados de Picardia return '34469';
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

  getParams() {
    const params = super.getParams();
    const epg_version = DeviceStorage.getItem('epgVersion');
    let APA =this.APAFilters();
    if(APA)
      this.customParameters.filterlist = APA;

    this.customParameters.epg_version = epg_version;

    return Object.assign({}, params, this.customParameters, Utils.getQuantity());
  }

  getUrl() {
    const http = "https://";
    const url = Launcher.get("akamai_mfwk");

    return `${http}${url}/services/search/predictive`;
  }

  success(data, b) {
    this.resolve(data);
  }
}

export default predictiveSearchTask;
