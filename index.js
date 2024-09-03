const express = require("express");
const app = express();
const path = require("path");
const ytdl = require("ytdl-core");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// OUR ROUTES WILL GO HERE
app.get("/", (req, res) => {
    res.render("index", { url: null }); // Initialize url as null
});

app.get("/download", async (req, res) => {
  const info = await ytdl.getInfo(req.query.url);
  const filteredFormats = info.formats.filter((format) => {
    return format.hasAudio && format.hasVideo && format.container === "mp4";
  });

  // Find the format with the highest resolution
  const highestResolutionFormat = filteredFormats.reduce((prev, current) => {
    return parseInt(prev.height) > parseInt(current.height) ? prev : current;
  });

  //   return res.render("download", {
  //     url: "https://www.youtube.com/embed/" + v_id,
  //     info: [highestResolutionFormat],
  //   });
  // Redirect to the URL of the highest quality video

  //   res.redirect(highestResolutionFormat.url);

  res.render("index", {
    url: highestResolutionFormat.url,
  });
});
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});