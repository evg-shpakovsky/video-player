import { LightningElement, wire, track } from "lwc";
// Import message service features required for subscribing and the message channel
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from "lightning/messageService";
import recordSelected from "@salesforce/messageChannel/PassData__c";

export default class ShowFormDetails extends LightningElement {
    subscription = null;
    @track formDataList = [];
    @wire(MessageContext)
    messageContext;
    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(this.messageContext, recordSelected, (message) => this.handleMessage(message), {
                scope: APPLICATION_SCOPE,
            });
        }
    }
    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
    // Handler for message received by component
    handleMessage(message) {
        const recordData = {
            name: message.recordData.name,
            email: message.recordData.email,
        };
        this.formDataList.push(recordData);
    }
    // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
    connectedCallback() {
        this.subscribeToMessageChannel();
    }
    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }
}
