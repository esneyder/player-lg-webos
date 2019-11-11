import Apa from './Apa';
import Translator from './Translator';

class Metadata extends Apa {
  setData(data) {
    super.setData(data);

    try {
      const translations = JSON.parse(data.translations);

      for (const country in translations.language) {
        Translator.setData(translations.language[country]);
        Translator.setCountry(country);
      }
    } catch (e) {
      console.error('Metadata.set(data) - The "translations" key in Metadata is not a valid json');
      return null;
    }
  }

  replaceAll(data) {
    this.setData(data);
  }
}

export default new Metadata();
