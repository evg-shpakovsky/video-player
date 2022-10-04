import { LightningElement, wire } from "lwc";

// Import message service features required for publishing and the message channel
import { publish, MessageContext } from "lightning/messageService";
import passData from "@salesforce/messageChannel/PassData__c";

export default class GetFormDetails extends LightningElement {
    name;
    email;
    @wire(MessageContext)
    messageContext;

    handleNameInputChange(event) {
        this.name = event.target.value;
    }
    handleEmailInputChange(event) {
        this.email = event.target.value;
    }
    // Respond to UI event by publishing message
    submitForm() {
        const formData = {
            name: this.name,
            email: this.email,
        };
        const payload = { recordData: formData };
        //Publish the message channel by passing the data
        publish(this.messageContext, passData, payload);
    }
}
