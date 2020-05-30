const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(express.json({ extended: true }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/link", require("./routes/link.routes"));
app.use("/t", require("./routes/redirect.routes"));

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = config.get("port") || 3001;

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (e) {
    console.log("Server error: ", e.message);
    process.exit(1);
  }
}

start();

const server = app.listen(PORT, () =>
  console.log(`Server started on PORT: ${PORT}...`)
);

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("uncaughtException", (error) => {
  console.log(error.message);
});
