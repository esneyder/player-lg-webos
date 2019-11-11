class Badges {
  constructor() {
    this.data = {};
  }

  set(data) {
    this.data = data;
  }

  get() {
    return this.data;
  }
}

export default new Badges();
