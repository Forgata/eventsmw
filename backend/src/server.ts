import app from "./app.js";
import { ENV } from "./config/env/env.js";
const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`Server is running`);
});
