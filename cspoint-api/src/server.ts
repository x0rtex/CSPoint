import { app } from "./index";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, (error) => {
  if (error) {
    console.error("Error starting server:", error.message);
    process.exit(1); // Exit the process with an error code
  } else {
    console.log("Server is running on port", PORT);
  }
});
