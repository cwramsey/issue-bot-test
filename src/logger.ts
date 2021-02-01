import { createLogger, format, transports } from "winston";

const consoleFormatter =
  process.env.NODE_ENV === "dev"
    ? format.combine(format.colorize(), format.simple(), format.prettyPrint())
    : format.combine(format.colorize(), format.simple());

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "openMPI-github-bot" },
  transports: [
    new transports.Console({
      format: consoleFormatter
    })
  ]
});

export default logger;
