import { LightningElement, api } from 'lwc';
import { registerReceiver, ACTION_TYPE } from 'c/globalStore';


export default class FlowHost extends LightningElement {
  @api
  flowApiName;
  @api
  get inputVariables() {
    return this._inputVariables;
  }
  set inputVariables(value) {
    this._inputVariables = value;
    if (this.isConnected && value !== undefined) {
      this.flowStart = true;
    }
  }
  _inputVariables;
  @api
  get currentStep() {
    return this._currentStep;
  }
  set currentStage(value) {
    this._currentStep = value
  }
  _currentStep;
  isConnected;

  @api
  steps = [];
  @api
  flowFinish = '';
  flowStart = false;

  connectedCallback() {
    this.isConnected = true;
    this.unregisterReceiver = registerReceiver(command =>
      this.handleCommand(command)
    );
    if (this._inputVariables !== undefined) {
      this.flowStart = true;
    }
  }

  disconnectedCallback() {
    if (typeof this.unregisterReceiver === 'function') {
      this.unregisterReceiver();
    }
    this.flowStart = false;
  }

  handleStatusChange(event) {
    if (event.detail.currentStage) {
      this._currentStep = event.detail.currentStage.name;
    }
    if (event.detail.status === 'FINISHED') {
      if (this.steps.length > 0) {
        this._currentStep = this.steps.slice(-1).value;
      }
      this.dispatchEvent(
        new CustomEvent('finish', {
          detail: {
            outputVariables: event.detail?.outputVariables
          }
        })
      );
    }
  }

  handleCommand(command) {
    const { type, payload } = command;
    if (type === ACTION_TYPE.NavigateCancel) {
      this.dispatchEvent(new CustomEvent('finish'));
      return;
    }
    if (type === ACTION_TYPE.BeforeNavigateFinish) {
      this._currentStep = payload.stage;
    }
  }
}