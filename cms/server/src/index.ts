import "dotenv/config"
import express, { urlencoded} from "express";
import helmet from "helmet";
import cors from "cors"
import bodyParser from "body-parser";

import * as swaggerJson from "./middleware/__generated__/swagger.json";
import * as swaggerUI from "swagger-ui-express";

import { RegisterRoutes } from "./middleware/__generated__/routes";

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
app.use(cors())

RegisterRoutes(app);

app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerJson));

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);