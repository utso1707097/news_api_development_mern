import express from "express";
import { config } from "dotenv";
import fileUpload from "express-fileupload";

config();
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public")); //serve static files
app.use(fileUpload());

app.get("/", (req, res) => {
  return res.json({ message: "Hello it's working" });
});

//Import routes
import ApiRoutes from "./routes/api.js";
app.use("/api", ApiRoutes);

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
