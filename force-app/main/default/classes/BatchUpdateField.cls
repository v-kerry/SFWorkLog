public class BatchUpdateField implements Database.Batchable<sObject> {
    public final string query;
    public final string field;
    public final string value;

    public BatchUpdateField(string queryInput, string fieldInput, string valueInput){
        query = queryInput;
        field = fieldInput;
        value = valueInput;
    }

    public Database.QueryLocator start(Database.BatchableContext batchContext) {
        return Database.getQueryLocator(query);
    }

    public void execute(Database.BatchableContext batchContext, List<sObject> scope) {
        if(scope.isEmpty()){
            return;
        }
        List<sObject> objectsToUpdate = new List<sObject>();
        for (sObject record : scope) {
            if(record.get(field) == value){
                system.debug('DEBUG:record.get(field): ' + record.get(field) + ' || Value: ' + value);
                continue;
            }
            record.put(field, value);
            objectsToUpdate.add(record);
        }
        if (!objectsToUpdate.isEmpty()) {
            update objectsToUpdate;
        }
    }

    public void finish(Database.BatchableContext batchContext){
        AsyncApexJob batchJob = [SELECT Status, TotalJobItems, JobItemsProcessed, MethodName, NumberofErrors, CreatedBy.Email FROM AsyncApexJob WHERE Id = :batchContext.getJobId()];

        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new List<string> {batchJob.CreatedBy.Email});
        mail.setReplyTo(constants.ADMIN_EMAIL);
        mail.setSenderDisplayName('Batch Processing');
        mail.setSubject('Batch Process ' + batchJob.Status);
        mail.setPlainTextBody('Batch Process has completed. Results: \n' +
                              'Total Records: ' + batchJob.TotalJobItems + '\n' +
                              'Records Processed: ' + batchJob.JobItemsProcessed + '\n' +
                              'Number of Errors: ' + batchJob.NumberofErrors + '\n' +
                              'Ran from context: ' + batchJob.MethodName);

        Messaging.sendEmail(new List<Messaging.SingleEmailMessage> { mail });
    }
}


// BatchUpdateField updateWorkLogStatus = new BatchUpdateField(
// 	'SELECT Work_Log_Status__c FROM Work_Log__c WHERE CreatedDate < LAST_N_DAYS:30',
//     'Work_Log_Status__c',
//     'Final'
// );
// Id batchJobId = Database.executeBatch(updateWorkLogStatus);