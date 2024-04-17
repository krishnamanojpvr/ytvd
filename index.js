const express = require("express");
const app = express();
const path = require("path");
const ytdl = require("ytdl-core");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// OUR ROUTES WILL GO HERE
app.get("/", (req, res) => {
	console.log("/ ROUTE");
	return res.render("index");
});
app.get("/download", async (req, res) => {
	console.log("/download ROUTE");
	if (!req.query.url) {
		return res.status(400).send('URL query parameter is required');
	}
	console.log(req.query.url)
    const info = await ytdl.getInfo(req.query.url);	
	console.log(info)
	const filteredFormats = info.formats.filter(format => {
        return format.hasAudio && format.hasVideo && format.container === 'mp4';
    });
	console.log(filteredFormats)
	// Find the format with the highest resolution
    const highestResolutionFormat = filteredFormats.reduce((prev, current) => {
        return (parseInt(prev.height) > parseInt(current.height)) ? prev : current;
    });
	console.log(highestResolutionFormat)

	 // Set the appropriate headers for the file download
	 res.setHeader('Content-disposition', 'attachment; filename=video.mp4');
	 res.setHeader('Content-type', 'video/mp4');
	 console.log("headers are set");
 
	 // Pipe the video stream to the response
	 ytdl(req.query.url, {
		 format: highestResolutionFormat
	 }).pipe(res);
	 console.log("piping started");
});
app.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});
