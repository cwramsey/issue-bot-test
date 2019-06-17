import { install } from "source-map-support";
import { config } from "dotenv";
import Octokit from "@octokit/rest";
import logger from "./logger";
import client from "./client";
import userConfig from "./config";
import { isEmpty, size } from 'lodash';

// Setup env variables and source maps
install();

logger.info("Application has been initialized.");
logger.info("Running in mode %s", process.env.NODE_ENV);



async function getIssues(client: Octokit, pageNum: number, maxPerPage: number) {
  //const issues = await client.issues.listForRepo({
  let allIssues: Array<any> = []
  while (true) {
    const { data, status } = await client.issues.listForRepo({
      owner: userConfig.owner,
      repo: userConfig.repo,
      per_page: maxPerPage,
      page: pageNum
    });

    if (status != 200) {
      const error = new Error(`Failed to fetch issues`)
      logger.info("error:", status)
      throw error;
    }

    if (isEmpty(data)) {
      break;
    }

    allIssues = allIssues.concat(data)
    pageNum++
  }

  //fetch reaches the last page
  logger.info("fetch all issus successfully")
  return allIssues;
}

async function getPRs(client: Octokit, pageNum: number, maxPerPage: number) {

  let allPRs: Array<any> = []
  while (true) {
    const { status, data } = await client.pulls.list({
      owner: userConfig.owner,
      repo: userConfig.repo,
      per_page: maxPerPage,
      page: pageNum
    });

    if (status != 200) {
      const error = new Error(`Failed to fetch PRs`)
      logger.info("error:", status)
      throw error;
    }

    if (isEmpty(data)) {
      break;
    }
    allPRs = allPRs.concat(data)
    pageNum++;
  }
  return allPRs;
}


async function createIssues(client: Octokit, index: number) {
  const res = await client.issues.create({
    owner: userConfig.owner,
    repo: userConfig.repo,
    title: index + " test creating issue",
  })
  return res
}

async function addComment(client: Octokit, issue: any, comment: string) {
  const res = await client.issues.createComment({
    owner: userConfig.owner,
    repo: userConfig.repo,
    issue_number: issue.number,
    body: comment
  });
  return res;
}

async function closeIssue(client: Octokit, issue: any) {
  const res = await client.issues.update({
    owner: userConfig.owner,
    repo: userConfig.repo,
    issue_number: issue.number,
    state: "closed"
  })
  return res;
}

async function removeLabel(client: Octokit, name: string) {
  const res = await client.issues.deleteLabel({
    owner: userConfig.owner,
    repo: userConfig.repo,
    name: name
  })
  return res;
}

function isGreaterThan(end: number, begin: number, unit: String, times: String) {
  if (unit === "") {
    return (end - begin) >= Number(times)
  }
  switch (unit) {
    case 'weeks':
      return (end - begin) >= WEEK_MM * Number(times)
    case 'days':
      return (end - begin) >= DAY_MM * Number(times)
    case 'hours':
      return (end - begin) >= HR_MM * Number(times)
    default:
      return true;
  }
}

// go through all labels, check if there is label with prefix, if lableName is empty, check if there is any label
function hasLabelWithPrefix(issue: any, prefix: String) {
  const labelList = issue.labels;
  if (isEmpty(labelList)) {
    return false;
  }

  labelList.forEach((label: any) => {
    const name = label.name;
    if (name.startsWith(prefix)) {
      return true;
    }
  });

  return false;
}

//go through all labels, check if there is label with name
function hasLabelWithName(issue: any, name: String) {
  const labelList = issue.labels;
  if (isEmpty(labelList)) {
    return false;
  }

  labelList.forEach((label: any) => {
    if (label.name == name) {
      return true;
    }
  });

  return false;
}

function hasMoreThanOneTargetLabel(issue: any) {
  if (isEmpty(issue.labels)) {

  }
}
const fetchFreq = userConfig.fetchFreq
const issueMaxNoStateTime = userConfig.issueMaxNoStateTime
const issueMaxWaitTimeToRelease = userConfig.issueMaxWaitTimeToRelease

const WEEK_MM = 604800000
const DAY_MM = 86400000
const HR_MM = 3600000




function issuesManagement(response: any) {
  const issuesList = response
  const times1 = issueMaxNoStateTime.substring(0, issueMaxNoStateTime.indexOf(' '))
  const unit1 = issueMaxNoStateTime.substring(issueMaxNoStateTime.indexOf(' ') + 1)
  const times2 = issueMaxWaitTimeToRelease.substring(0, issueMaxNoStateTime.indexOf(' '))
  const unit2 = issueMaxWaitTimeToRelease.substring(issueMaxNoStateTime.indexOf(' ') + 1)

  // issue: object

  issuesList.forEach((issue: any) => {

    if (issue.hasOwnProperty('pull_request')) {
      console.log(issue)
    }
    // comment on ticket when no 'State:' labels have been added to an issue in 'issueMaxNoStateTime' weeks: userConfig.askForUpdate
    /* if (isGreaterThan(Date.now(), new Date(issue.created_at).getTime(), unit1, times1) && !hasLabelWithPrefix(issue, 'State:')) {
      //if (true) {
      console.log("create comment now")
      addComment(client, issue, userConfig.askForUpdate)
        .then(response => {
          logger.info("add comment response", response);
        })
        .catch(logger.error)
    }
    // comment on ticket when no updates in 'issueMaxNoStateTime' + 1, asking developer to update: userConfig.askForUpdate
    // if no label or 'State: Awaiting developer information'
    if ((!hasLabelWithName(issue, 'State: Awaiting developer information') || hasLabelWithName(issue, '')) && isGreaterThan(Date.now(), new Date(issue.created_at).getTime(), unit1, times1 + 1)) {
      addComment(client, issue, userConfig.askForUpdate)
        .then(response => {
          logger.info("add comment response", response);
        })
        .catch(logger.error)
    }

    // close ticket with note when in state 'State: Awaiting user information' for X weeks
    if (isGreaterThan(Date.now(), new Date(issue.created_at).getTime(), unit1, times1) && hasLabelWithName(issue, 'State: Awaiting user information')) {
      //if (true) {

      //need to comment on the issue first and then close it
      addComment(client, issue, userConfig.closeIssueNote)
        .then(response => {
          logger.info("add close ticket note", response)
        })
        .catch(logger.error)


      closeIssue(client, issue)
        .then(response => {
          logger.info("close issue response", response)
        })
        .catch(logger.error)
    }

    // close ticket when in state 'State: Awaiting merge to rease branches' for more than 'issueMaxWaitTimeToRelease' time
    if (hasLabelWithName(issue, 'State: Awaiting merge to release branches') && isGreaterThan(Date.now(), new Date(issue.created_at).getTime(), unit2, times2) && !hasLabelWithPrefix(issue, 'Target:')) {
      //if (true) {

      removeLabel(client, "State: Awaiting merge to release branches")
        .then(response => {
          logger.info("remove label", response)
        })
        .catch(logger.error)

      closeIssue(client, issue)
        .then(response => {
          logger.info("close issue", response)
        })
        .catch(logger.error)
    } */
  });
}

function PRsManagement(response: any) {
  const PRList = response
  PRList.forEach((pr: any) => {
    if (isGreaterThan(Date.now(), new Date(pr.created_at).getTime(), "", "1")) {
      //if new PR, add label Target:
      const targetLabel = "Target:"
    }
    if (hasMoreThanOneTargetLabel(pr)) {
      //remove all till one is left
    }
  })

}

async function main() {

  // fetch all issues 
  console.log("starting to fetch issues")
  await getIssues(client, 1, 100)
    .then(response => {
      console.log("all issues length:", size(response))
      issuesManagement(response);
    })
    .catch(logger.error);
  console.log("issues fetch end")

  //fetch all PRs
  /* console.log("starting to fetch PRs");

  await getPRs(client, 1, 100)
    .then(response => {
      console.log("prs: ", response)
      console.log("all PRs length:", size(response))
      PRsManagement(response)
    })
    .catch(logger.error) */

  return null
}

main();

/* for (let i = 30; i < 100; i++) {
  createIssues(client, i)
    .then(response => {
      logger.info("creating issues", response)
      console.log(i)
    })
    .catch(logger.error)
} */

  // entry point for AWS Lambda
/* exports.handler = (event: any) => {
  getIssues(client)
    .then(response => {
      //logger.info("Response is %v", response)
      console.log("Response is: ", response)
    })
    .catch(logger.error);
}
 */