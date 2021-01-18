followed:
https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-template-publishing-applications.html


sam package \
>     --template-file template.yaml \
>     --output-template-file packaged.yaml \
>     --s3-bucket automic-lambda-publish


sam publish \
    --template packaged.yaml \
    --region eu-central-1