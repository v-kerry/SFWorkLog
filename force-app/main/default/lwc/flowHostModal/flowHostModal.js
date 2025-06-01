import { api, track } from 'lwc';
import LightningModal from 'lightning/modal';

export default class FlowHostModal extends LightningModal {
  @api
  get flowApiName() {
    return this._flowApiName;
  }
  set flowApiName(value) {
    this._flowApiName = value;
  }
  _flowApiName
  
  @api
  flowHeader;
  
  @track
  inputVariables = null;

  handleFinish(event) {
    this.close({
      outputVariables: event.detail?.outputVariables
    });
  }
}