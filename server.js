const Sentry = require("@sentry/node");
const { ProfilingIntegration } = require("@sentry/profiling-node");
const helmet = require("helmet");
const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: '.env' });

// const {notFound , errorHandler} = require("./middlewares/errorHandler");

// express app
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(helmet());

// app.use(notFound);
// app.use(errorHandler);


//sentry initialization//////

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

mongoose
  .connect(
    process.env.MONGODB_URL)
  .then(() => {
    app.listen(3000, () => {
      console.log(`http://localhost:3000/`);
      console.log("data connected")
    });
  })
  .catch((err) => {
    console.log(err);
  });