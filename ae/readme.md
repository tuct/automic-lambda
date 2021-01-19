# How to Implement Automic Automation Processing Real-Time Serverless events

This folder contains the ae objects required for this example.

It contains:
* Implementation Guide (this document)
* An Automic extract of the Automation Engine objects you will require
* Source for the Lambda function itself (not needed as you can just use the published function in AWS LAMBDA)

To create this in your own environment you will need:

AWS 
* S3 bucket that you will use to upload files 
* KMS to create an encryption key and assign the Lambda function role as a user
* Lambda to deploy and configure the Automic Rest Api function

Automic Automation
* Automic Automation v12.3+ with REST interface accessible from the internet

Required Steps:

* Prepare Automic to be able to receive the Event via rest
* Create/Choose a S3 Bucket
* Create Lambda Function based on template and set it up
  * Make sure password is encrypted
* Its Ready

Here are the individual actions you need to take.

## Serverless App: Automic Automation REST API
To make it easy for you to use this integration, I published a small Function to AWS Lambda that can be easily configured to send any AWS Event in Lambda as a JSON payload to the Automic  Automation REST API.

## Automic Automation Engine: Objects to process S3 event 
Let’s start by creating the required objects to receive the S3 json event and write it to a static VARA object for further processing in the Automation Engine.

You can use the provided export "aws_lambda_ae_content.xml" which contains these objects:
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/ae_content.png "AE content example")

The workflow JOBP.AWS_LAMBDA.S3 is very simple, it uses the Promptset
PRPT.AWS_LAMBDA which only has one parameter &amp;EVENT_JSON# to receive the JSON
payload
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/ae_wf_2.png "Workflow")

and one script SCRI.ADD_FILE_TO_PROCESS that will parse the json into AE variable
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/ae_scri_3.png "Script")

and writes the file to the static Vara VARA.S3.FILES_TO_PROCESS for further processing.

The "test_payload.json" file contains a json payload for a S3 put request to a bucket that can be
used to test the workflow.

### AWS S3 bucket
Choose a region where you want to create your example, here I am using EU Frankfurt (eu-
central-1) and make sure you create all required resources in this region.
First we need to [create a S3 bucket](https://s3.console.aws.amazon.com/s3/bucket/create?region=eu-central-1#) which we will use for this demo.
I called it “automic-aws-lambda-example”, if you choose another name, make sure to also
replace this in the Lambda function we will create
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_bucket_1.png "Bucket")

### AWS Lambda Function and Encryption Key
Next we will create a [AWS Lambda function](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1),
choose “Browse serverless app repository” and search for “automic”
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_lambda_2.png "Create function")

Select autiomic-rest-api and “Deploy” to create the function

In order to use the encryption for the password field we need to create or use an encryption key
in the [Key Management Service](https://eu-central-1.console.aws.amazon.com/kms/home?region=eu-central-1#/kms/keys) (KMS)
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_kms_3.png "KMS")

Use “Symetric” and click “Next”
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_kms_4.png "KMS")
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_kms_5.png "KMS")
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_kms_6.png "KMS")

Now we need to choose administrative and usage permissions.
AWS created a dedicated account for our Lambda function, so we need to assign that here in
step 3 and 4. The name of the role will start with “serverlessrepo-automic-rest-api-”
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_kms_7.png "KMS")

Create the key by clicking “Finish”, you should see something like this
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_kms_8.png "KMS")

You can go back to your [AWS Lambda function](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/functions) now and navigate to “Latest Configuration -&gt;
Environment” and Edit the environment variables.
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_kms_9.png "Environment variables")

Choose “Enable helpers for encryption in transit”, enter the password and only on the password
field press “Encrypt” and select the key we just created
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_kms_10.png "KMS")

Now the password is encrypted and not in plain text anymore
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_kms_11.png "KMS")

Save the Environment variables.
Now we only need to configure the trigger for this function.
Navigate to “Latest configuration -&gt; Trigger” and click “Add trigger”
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_s3_trigger_1.png "Trigger")

Choose “S3”
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_s3_trigger_2.png "Trigger")

And now select the S3 bucket we created before, I did not further restrict the event definition but
if you want you can do so according to your use case.
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_s3_trigger_3.png "Trigger")

![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_s3_trigger_4.png "Trigger")

Good hint by AWS ;) Don’t write to the same S3 bucket or you will end up in the recursive hell
and consume a lot of compute resources!

As soon as the trigger is active you will get a REST call to the Automic REST interface for every
file that is uploaded to the S3 Bucket.

Upload a file to S3
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/aws_s3_uopload.png "Upload to s3 bucket")

The workflow triggered in the Automic Automation Engine
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/ae_result.png "Result in AWI")

You can see the mapped properties from the S3 event in the workflow!


