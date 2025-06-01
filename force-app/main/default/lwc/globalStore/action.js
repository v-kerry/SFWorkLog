export default class Action {
  type;
  payload;

  constructor(type, payload) {
    if (typeof type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property.'
      );
    }    
    this.type = type;
    this.payload = payload;
  }
}