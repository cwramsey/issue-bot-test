import Octokit from "@octokit/rest";
import { config } from "dotenv";

//set up env
config();

const client = new Octokit({
  auth: process.env.AUTH_TOKEN,
  userAgent: "openMPI-bot v1.0",
  baseUrl: "https://api.github.com"
});

export default client;
