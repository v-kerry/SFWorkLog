// Build an input box and a <p> tag that updates in real time with the typed value.
// Practice using @track or reactive properties with get/set.

import { LightningElement } from 'lwc';

export default class HelloWorld extends LightningElement {
    firstNameValue = '';
    lastNameValue = '';

    handleFirstNameChange(event) {
        this.firstNameValue = event.detail.value;
    }
    handleLastNameChange(event) {
        this.lastNameValue = event.detail.value;
    }

    get fullName() {
        if(this.firstNameValue && this.firstNameValue.trim() && this.lastNameValue && this.lastNameValue.trim()) {
            return (
                this.firstNameValue.charAt(0).toUpperCase() + this.firstNameValue.slice(1) + 
                ' ' + 
                this.lastNameValue.charAt(0).toUpperCase() + this.lastNameValue.slice(1)
            );
        }else{
            return 'Incomplete Name';
        }
    }
}