import { api, track, wire, LightningElement } from "lwc";
import getRelatedMediaFiles from "@salesforce/apex/MediaFileComponentController.getRelatedMediaFiles";
// Import message service features required for publishing and the message channel
import { publish, MessageContext } from "lightning/messageService";
import passData from "@salesforce/messageChannel/PassData__c";

export default class MediaFileComponent extends LightningElement {
    @api recordId; // = "a015g00000hULVZAA4";
    @track mediaFiles;
    @track mediaFile;

    @track videoUrl;
    @api
    myColumns = [
        { label: "File name", fieldName: "name", type: "text" },
        { label: "Type", fieldName: "type", type: "text" },
        { label: "url", fieldName: "url", type: "text" },
        {
            label: "Action",
            type: "button-icon",
            typeAttributes: { iconName: "utility:play", name: "play", title: "Action", iconAlternativeText: "Play" },
        },
    ];

    get acceptedFormats() {
        return [".pdf", ".png", ".jpg", ".mp4"];
    }

    connectedCallback() {
        this.getRelatedFile();
    }

    async getRelatedFile() {
        await getRelatedMediaFiles({ recordId: this.recordId })
            .then((result) => {
                this.mediaFiles = result;
                this.mediaFile = result[0];
                this.error = undefined;
            })
            .catch((error) => {
                console.log("error" + error);
                this.mediaFiles = undefined;
                this.error = error;
            });

        //this.mediaFiles = Object.assign({}, this.mediaFiles, newMediaFiles);
    }

    handleUploadFinished() {
        this.connectedCallback();
    }

    @wire(MessageContext)
    messageContext;

    // Respond to UI event by publishing message
    playFile(event) {
        this.videoUrl = event.detail.row.url;

        const formData = {
            videoUrl: this.videoUrl,
        };

        const payload = { recordData: formData };
        //Publish the message channel by passing the data
        publish(this.messageContext, passData, payload);
    }
}
