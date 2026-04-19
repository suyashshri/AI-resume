import app from "./src/server";
import { config } from "./src/config/config";
import { startDBserver } from "./src/db/db";

const PORT = config.PORT;

startDBserver();

app.listen(PORT, () => {
  console.log(`server is running on PORT: ${PORT}`);
});
