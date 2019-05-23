import { install } from "source-map-support";
import { config } from "dotenv";
import Octokit from "@octokit/rest";
import logger from "./lib/logger";
import client from "./lib/client";

// Setup env variables and source maps
config();
install();

logger.info("Application has been initialized.");
logger.info("Running in mode %s", process.env.NODE_ENV);

async function getIssues(client: Octokit) {
  const issues = await client.issues.listForRepo({
    owner: "cwramsey",
    repo: "issue-testing"
  });

  return issues;
}

getIssues(client)
  .then(response => logger.info("Response is %v", response))
  .catch(logger.error);
