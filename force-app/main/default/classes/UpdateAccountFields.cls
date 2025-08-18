public class UpdateAccountFields implements Database.Batchable<sObject>{
   public final String Query;
   public final String Field;
   public final String Value;

   public UpdateAccountFields(String q, String f, String v){
             Query=q; Field=f;Value=v;
   }

   public Database.QueryLocator start(Database.BatchableContext bc){
      return Database.getQueryLocator(query);
   }

   public void execute(Database.BatchableContext bc, 
                       List<sObject> scope){
      for(Sobject s : scope){s.put(Field,Value); 
      }      update scope;
   }

   public void finish(Database.BatchableContext bc){

   }

}