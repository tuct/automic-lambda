# How to Implement Automic Automation Processing Real-Time Serverless events

This folder contains the ae objects required for this example

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

You can use the provided export which contains these objects:
![alt text](https://raw.githubusercontent.com/tuct/automic-lambda/main/ae/assets/ae_content.png "AE content example")


