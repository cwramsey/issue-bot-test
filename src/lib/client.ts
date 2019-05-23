import Octokit from "@octokit/rest";

const client = new Octokit({
  auth: process.env.AUTH_TOKEN,
  userAgent: "openMPI-bot v1.0",
  baseUrl: "https://api.github.com"
});

export default client;
