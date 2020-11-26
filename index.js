/**
 * This Function allows you to send any AWS event to the automic event engine as json via rest.
 * 
 * A) Configure the automic connection in the enviroment of the function
 * 
 * username: <Client>/<username>/<department, e.g: 100/AUTOMIC/AUTOMIC
 * ae_rest_endpoint: <uri to rest>/ae/api/v1/<client>, eg:'https://rest.35.244.234.8.xip.io/ae/api/v1/100'
 * ae_workflow: name of the workflow that will be called e.g'JOBP.AWS_LAMBDA.S3' 
 * the workflow will get the event payload as &EVENT_JSON# input!
 * To encrypt your password use the following steps:
 * 
 * 1. Create or use an existing KMS Key - http://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html
 * 
 * 2. Expand "Encryption configuration" and click the "Enable helpers for encryption in transit" checkbox
 * 
 * 3. Paste <PASSWORD> into the password environment variable and click "Encrypt"
 * 
 * 4. Give your function's role permission for the `kms:Decrypt` action 
 * 
 * B) Add a trigger to the function, the full payload will be send to the ae workflow defined in the first step.
 * 
 *  
 */


"use strict";
const AWS = require('aws-sdk');
const axios = require('axios');
const axiosRetry = require('axios-retry');
AWS.config.update({ region: 'eu-central-1' });

const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME;
const ae_rest_endpoint = process.env['ae_rest_endpoint'];
const ae_workflow = process.env['ae_workflow'];
const username = process.env['username'];
const password_encrypted = process.env['password'];

let password;
let ae_rest;


async function processEvent(event) {
    let payload = {
      "object_name": ae_workflow,
      "execution_option": "execute",
      "inputs": { 
        "&EVENT_JSON#|json": event
      }
    }
    const response = await ae_rest.post('/executions',payload)
    .then(function (response) {
      // handle success
      return {
        statusCode: 200,
        data: response.data       
      }
    })
    .catch(function (error) {
      // handle error
      return {
        statusCode: 400,
        data: error       
      }
    });   
    return response;
}

exports.handler = async (event, context) => {
    if (!password) {
        // Decrypt code should run once and variables stored outside of the
        // function handler so that these are decrypted once per container
        const kms = new AWS.KMS();
        try {
            const req = {
                CiphertextBlob: Buffer.from(password_encrypted, 'base64'),
                EncryptionContext: { LambdaFunctionName: functionName },
            };
            const data = await kms.decrypt(req).promise();
            password = data.Plaintext.toString('ascii');
            //init rest client for AE
            ae_rest = axios.create({
                baseURL: ae_rest_endpoint,
                timeout: 5000,
                headers: {'Content-Type': 'application/json'},
                auth: {
                    username: username,
                    password: password
                  },
              });
            axiosRetry(ae_rest, { retries: 5 });
            axiosRetry(ae_rest, { retryDelay: axiosRetry.exponentialDelay});
        } catch (err) {
            console.log('Decrypt error:', err);
            throw err;
        }
    }
    return processEvent(event,context);
};

