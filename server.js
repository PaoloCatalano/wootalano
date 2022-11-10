//cSpell:disable
import express from "express";
//per avere questa sintassi, rinomina il tipo di file in .mjs oppure inserisci   "type": "module", nel package.json
//cSpell:enable
const app = express();

//error
import "express-async-errors"; //no need of try catch block

// dotenv
import dotenv from "dotenv";

//connect to db
import db from "./db/connect.js";
// CORS
// import cors from "cors";

//morgan
import morgan from "morgan";

//auth
import authUser from "./middleware/auth.js";

// routers
import authRouter from "./routes/authRoutes.js";
import jobRouter from "./routes/jobRoutes.js";

//middleware
import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";

// after building the client
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

//sanitizing
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import { StatusCodes } from "http-status-codes";

dotenv.config();

//app.use(cors()); una possibile soluzione per autorizzare la connessione front con back end (l'altra é PROXY in front-end)

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// arrivare al __dirname (non di default se usi module syntax: import ... from '...')
const __dirname = dirname(fileURLToPath(import.meta.url));

//rendere disponibile il front-end come static file
// only when ready to deploy
app.use(express.static(path.resolve(__dirname, "./client/build")));

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

//real routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authUser, jobRouter);

app.get("/api/v1", (req, res) => {
  res.status(StatusCodes.OK).send('<a href="/">Welcome</a>');
});

//dare accesso a index.html del client come front-end per ogni richiesto GET escluse quelle del router del server (API)!
// only when ready to deploy
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

//ADESSO, per farlo partire basta avviare SOLO il server! con "node server"

//error routes
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await db(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
