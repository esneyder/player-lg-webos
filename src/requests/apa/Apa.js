class Apa {
  constructor(data) {
    this.data = {};

    this.add(data);
  }

  add(data) {
    this.data = Object.assign({}, this.data, data);
  }

  remove(key) {
    if (this.data[key]) {
      delete this.data[key];
    }
  }

  all() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }

  replaceAll(data) {
    this.setData(data);
  }

  get(key, defaultText = null) {
    if(this.data && this.data[key] !== undefined){
      if( typeof this.data[key]==='string' && this.data[key].trim()===''){
        return defaultText; 
      }
      return this.data[key];
    }
    return defaultText !== null ? defaultText : key;
  }

  set(key, value) {
    this.data[key] = value;
  }
}

export default Apa;
