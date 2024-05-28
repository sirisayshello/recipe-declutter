import express from "express";
import router from "./server.js";

const PORT = 3001;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", router);

app.use("*", (req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
