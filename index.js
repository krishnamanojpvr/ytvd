const express = require("express");
const app = express();
const path = require("path");
const ytdl = require("ytdl-core");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/download", async (req, res) => {
    const videoURL = req.query.url;
    const info = await ytdl.getInfo(videoURL);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });

    res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
    ytdl(videoURL, { format: format })
        .pipe(res);
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
