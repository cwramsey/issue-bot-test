## Get Started

* Add github creds into .env file

**Running locally with SAM:**

To get started with the local development:

* [Install SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* run `tsc` under root folder
* run `sh -x localRun.sh` under root folder, you will see a `sam-test` folder emerges, `cd` into the folder
* run `sam local invoke -e --event.json` 


**Running by uploading .zip file to AWS Lambda:**

* run `tsc` under root folder
* run `sh -x zipAndUpload.sh` under root folder, you will see a `tmp` folder and a test.zip file emerge
* Upload .zip file to AWS Lambda. Function can be triggered by CloudWatch Events and monitored by CloudWatch Logs


**Detailed References:** Explains SAM commands and usage in depth.

* [CLI Commands](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-command-reference.html)
* [SAM Template Specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md)
* [Policy Templates](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-templates.html)