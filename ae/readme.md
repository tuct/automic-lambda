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
