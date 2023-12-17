const fs = require("fs/promises");

const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");

dotenv.config({ path: "./config.env" });

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json({ limit: "10kb" }));

app.get("/api", async (req, res) => {
    try {
        const data = await fs.readFile("./data/questions.json");
        const jsonData = JSON.parse(data);
        res.status(200).json({
            status: "success",
            data: jsonData,
        });
    } catch (err) {
        console.error("Error reading the JSON file:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});
