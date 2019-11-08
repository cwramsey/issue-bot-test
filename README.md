## OpenMPI Github Bot

This bot helps to automate the lifecycle management of issues/PRs.

## Get Started

* Add github creds into .env file
* Set DRYRUN mode in Enviromment Variables in AWS Lambda

## Usage

**Running via AWS CodePipeline**

Commit to Github repo will trigger the AWS CodeBuild, which uploads the build artifacts to S3. AWS CodeDeploy will

deploy the latest version to AWS Lambda, the platform the bot runs in.

**Running locally with SAM:**

To get started with the local development:

* [Install SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* run `tsc` under root folder
* run `sh -x localRun.sh` under root folder, you will see a `sam-test` folder emerges, `cd` into the folder
* run `sam local invoke -e --event.json` 


**Running by uploading .zip file to AWS Lambda:**

* run `tsc` under root folder
* run `sh -x zipForLambda.sh` under root folder, you will see a `tmp` folder and a test.zip file emerges
* Upload .zip file to AWS Lambda. Function can be triggered by CloudWatch Events and monitored by CloudWatch Logs
* Dryrun mode can be configured via environment variables in AWS Lambda console. 


**Detailed References:** 

* [CLI Commands](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-command-reference.html)
* [SAM Template Specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md)
* [Policy Templates](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-templates.html)
* [GitHub Robot Tasks]
(https://github.com/open-mpi/ompi/wiki/GitHub-Robot-Tasks)