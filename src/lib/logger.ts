import * as fs from "fs";
import * as path from "path";

export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

function writeToFile(message: string) {
  const logDir = path.resolve(process.cwd(), "logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  const filePath = path.join(logDir, `${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(filePath, message + "\n");
}

export function log(level: LogLevel, context: string, error?: any) {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${level}] [${context}]`;
  let output = base;

  if (error instanceof Error) {
    output += ` ${error.message}\n${error.stack}`;
  } else if (typeof error === "string") {
    output += ` ${error}`;
  } else if (error) {
    output += ` ${JSON.stringify(error, null, 2)}`;
  }

  // فقط لاگ به کنسول dev
  if (process.env.NODE_ENV !== "production") {
    console.log(output);
  }else {
    console.log(output);
  }


  // لاگ به فایل
  writeToFile(output);
}
