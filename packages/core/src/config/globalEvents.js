export default class globalEvents {
  static events = [];

  static registerEvent(name, func) {
    this.events = [...this.events, { name, func }];
  }

  static getEvents(name) {
    return this.events.filter((c) => c.name === name);
  }

  static invokeEvents(name, params) {
    const events = this.getEvents(name);
    if (events) {
      events.forEach((event) => {
        event.func(params);
      });
    }
  }
}
