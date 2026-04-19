import app from "./src/server";
import { config } from "./src/config/config";

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`server is running on PORT: ${PORT}`);
});
