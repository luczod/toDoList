import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import dotenv from "dotenv";
import router from "./routes/index.js";
import helmet from "helmet";
import { randomBytes } from "node:crypto";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3008;

function nonceMiddleware(_, res, next) {
  res.locals.nonce = randomBytes(16).toString("base64");
  next();
}

app.use(nonceMiddleware);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrcElem: [
          (_, res) => `'nonce-${res.locals.nonce}'`,
          "https://cdn.jsdelivr.net/npm/sweetalert2@11.15.9/dist/sweetalert2.all.min.js",
        ],
        imgSrc: [
          "https://img.icons8.com/nolan/64/todo-list.png",
          `http://localhost:${PORT}/assets/img/bg.jpg`,
        ],
      },
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    name: "sessionId",
    secret: "change-me",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
    },
  })
);

// Static files
app.disable("x-powered-by");
app.use(express.static("public"));

// Handlebars setup
app.set("views", join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

// Root route
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
