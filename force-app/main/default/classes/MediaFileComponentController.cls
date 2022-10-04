public without sharing class MediaFileComponentController {
    static string BASE_URL = '/sfc/servlet.shepherd/document/download/';
    static Map<String, String> fileExtensionToTypeMap = new Map<String, String>{ 'MP4' => 'Video', 'MP3' => 'Audio', 'WAV' => 'Audio' }; // We can move this to CMDT

    @AuraEnabled(cacheable=false)
    public static List<ContentDocumentLink> fetchFiles(String recordId) {
        return [
            SELECT LinkedEntityId, ContentDocument.CreatedDate, ContentDocument.Title, ContentDocument.ContentSize, ContentDocument.FileType
            FROM ContentDocumentLink
            WHERE LinkedEntityId = :recordId
        ];
    }

    @AuraEnabled
    public static mediaFileWrapper[] getRelatedMediaFiles(string recordId) {
        mediaFileWrapper[] mediaFileList = new List<mediaFileWrapper>{};
        Set<id> ContentDocumentIds = new Set<id>();

        for (ContentDocumentLink cdl : [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId]) {
            ContentDocumentIds.add(cdl.contentdocumentId);
        }

        ContentDocument[] contentDocList = [
            SELECT
                Id,
                Title,
                FileType,
                FileExtension
                //(SELECT DistributionPublicUrl FROM ContentDistribution WHERE ContentDocumentId = :recordId)
            FROM ContentDocument
            WHERE Id IN :ContentDocumentIds AND FileType IN :fileExtensionToTypeMap.keySet()
        ];

        for (ContentDocument cd : contentDocList) {
            mediaFileWrapper file = new mediaFileWrapper();
            file.name = cd.Title;
            //file.url = cd.ContentDistribution__r.DistributionPublicUrl;
            file.url = BASE_URL + cd.Id;
            System.debug('file.url');
            System.debug(file.url);
            file.type = fileExtensionToTypeMap.get(cd.FileType);
            mediaFileList.add(file);
        }
        System.debug(mediaFileList);
        return mediaFileList;
    }

    public class MediaFileWrapper {
        @AuraEnabled
        public string name;
        @AuraEnabled
        public string url;
        @AuraEnabled
        public string type;
    }
}
