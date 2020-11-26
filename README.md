# Execute Automic Automation

This Function allows you to send any AWS event to the automic event engine as json via rest.
 
## Configure the automic connection 

You need to set the connection to the automic automation engine in the enviroment of the function.

```yaml
ae_rest_endpoint: 'https://rest.35.244.234.8.xip.io/ae/api/v1/100'
ae_workflow: 'JOBP.AWS_LAMBDA.S3'
username: '100/AUTOMIC/AUTOMIC'
password: ''
```

The client is encoded in the url and the username. The ae_workflow e.g' JOBP.AWS_LAMBDA.S3' 
will be called and get the event payload as &EVENT_JSON# as input!

To encrypt your password use the following steps:

- Create or use an existing KMS Key - <http://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html>
- Expand "Encryption configuration" and click the "Enable helpers for encryption in transit" checkbox
- Paste 'your ae password' into the password environment variable and click "Encrypt"
- Give your function's role permission for the `kms:Decrypt` action or Add the role created for the function as a key ser in KMS
  
## Add a trigger to the function

Now you can choose a trigger that will invoke the ae workflow.

The full payload will be send to the ae workflow defined in the first step.