import { LightningElement, api, wire, track } from "lwc";
// Import message service features required for subscribing and the message channel
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from "lightning/messageService";
import recordSelected from "@salesforce/messageChannel/PassData__c";

export default class VideoPlayer extends LightningElement {
    @api mediaFile;
    @track formDataList = [];
    @wire(MessageContext)
    messageContext;
    isVideoUrl;
    subscription = null;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

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
        this.formDataList = [];
        this.isVideoUrl = false;

        const recordData = {
            videoUrl: message.recordData.videoUrl,
        };

        this.formDataList.push(recordData);
        this.isVideoUrl = true;
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }
}
