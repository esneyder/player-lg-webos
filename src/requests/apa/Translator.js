import Apa from './Apa';

class Translator extends Apa {
  constructor(data = {}, country = null) {
    super(data);

    this.country = country;
  }

  getCountry() {
    return this.country;
  }

  setCountry(country) {
    this.country = country;
  }
}

export default new Translator();
