import "dotenv/config"
import express, { urlencoded, Request, Response, NextFunction, ErrorRequestHandler } from "express";
import helmet from "helmet";
import cors from "cors"
import bodyParser from "body-parser";

import * as swaggerJson from "./middleware/__generated__/swagger.json";
import * as swaggerUI from "swagger-ui-express";

import { RegisterRoutes } from "./middleware/__generated__/routes";

import connectToDatabase from "./data-layer/adapter/mongodb";

import "reflect-metadata";

import { ValidateError } from "@tsoa/runtime";

export const app = express();

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet())
// app.use(cors())
app.use(cors({ origin: "*" }));

RegisterRoutes(app);
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerJson));

const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ValidateError) {
    console.error("DTO 校验失败字段:\n", JSON.stringify(err.fields, null, 2));
    // 注意要 return，TS 才认这条分支“有返回”
    res.status(422).json({
      message: "DTO validation failed",
      details: err.fields,
    });
    return;
  }
  // 其他错误继续交给 Express 默认处理
  return next(err);
};
app.use(errorHandler);

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDatabase()
    app.listen(port, () =>
      console.log(`Example app listening at http://localhost:${port}`),
    )
  } catch (error) {
    console.error("ERROR Connecting to Database", error)
  }
}
startServer()
