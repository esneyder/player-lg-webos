import Apa from './Apa';

class Legals extends Apa {
	get(key, region, defaultText = null) {
		const dataString = this.data && this.data.translations;
		let dataDefault = null;
		try{
			dataDefault = JSON.parse(defaultText);
		}catch(e){
		}
		let response = dataDefault && dataDefault.language ? ( dataDefault.language[region] ? dataDefault.language[region] : dataDefault.language['default']) : key;
		try{
			let data =JSON.parse(dataString);
			data = data.language[region];
				if( data && typeof data[key] === 'string' ){
					return data[key];
				}else{
					return response;
				}
		}catch (e){
			return response;
		}
	    return response;
	}
}

export default new Legals();
