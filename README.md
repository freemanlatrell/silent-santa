# silent-santa
This app is used to randomly generate a Secret Santa list. After the names are selected an email will be sent to each Secret Santa, notifying them of the selections. 

## How to Use
### Require Environment Variables
  - DB_URL - This is the URL to access the Cloudant Database
  - DB_DOC_NAME - This is the name of the document in the database
  - EMAIL_ADDRESS - This is the email address used for sending email notifications
  - EMAIL_PASSWORD - This is the email password for the email address used for sending email notifications
  
### Example Command

```
DB_URL=https://<my-cloudant-url>-bluemix.cloudant.com DB_DOC_NAME=adams_family_list EMAIL_ADDRESS=automatedsecretsanta7@gmail.com EMAIL_PASSWORD=<email-password> name_generator.js 
```   
    