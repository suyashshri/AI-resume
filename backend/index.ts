import app from "./src/server";
import { reportWorker } from "./src/lib/reportQueue";
import { config } from "./src/config/config";
import { startDBserver } from "./src/db/db";

const PORT = config.PORT;

startDBserver();

app.listen(PORT, () => {
  console.log(`server is running on PORT: ${PORT}`);
  console.log("Report analysis worker started");
});

process.on("SIGTERM", async () => {
  await reportWorker.close();
  process.exit(0);
});
