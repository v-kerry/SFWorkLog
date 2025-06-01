import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FlowHostModal from 'c/flowHostModal';
import flowConfig from './flowConfig';

export default class MailroomButtonLauncher extends NavigationMixin(LightningElement) {

  handleClick(event) {
    const buttonLabel = event.detail.value;
    const { flowApiName, flowHeader, redirectToRecord, displayConfirmationToast } = (flowConfig[buttonLabel] || {});
    if (!flowApiName) {
      return;
    }
    FlowHostModal.open({ flowApiName, flowHeader }).then(result => {
      if (!result) {
        return;
      }
      if (displayConfirmationToast) {
          this.notifyUser('Success', 'Operation completed successfully.', 'success');
      }
      if (redirectToRecord && Array.isArray(result?.outputVariables)) {
        const recordId = result.outputVariables.find(outputVar => outputVar.name === 'targetRecordId')?.value;
        if (recordId) {
          this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
              recordId,
              actionName: 'view',
          }});
        }
      }
    });
  }

  notifyUser(title, message, variant) {
    const toastEvent = new ShowToastEvent({
        title,
        message,
        variant
    });
    this.dispatchEvent(toastEvent);
  }
}