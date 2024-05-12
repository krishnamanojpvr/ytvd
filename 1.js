const express = require("express");
const app = express();
const path = require("path");
const ytdl = require("ytdl-core");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// OUR ROUTES WILL GO HERE
app.get("/", (req, res) => {
	return res.render("index");
});
app.get("/download", async (req, res) => {
	const v_id = req.query.url.split('v=')[1];
    const info = await ytdl.getInfo(req.query.url);
	const filteredFormats = info.formats.filter(format => {
        return format.hasAudio && format.hasVideo && format.container === 'mp4';
    });
	// Find the format with the highest resolution
    const highestResolutionFormat = filteredFormats.reduce((prev, current) => {
        return (parseInt(prev.height) > parseInt(current.height)) ? prev : current;
    });
1
	return res.render("download", {
		url: "https://www.youtube.com/embed/" + v_id,
        // info: info.formats.sort((a, b) => {
        //     return a.mimeType < b.mimeType;
		info: [highestResolutionFormat],
        // }),
	});
// // 2
// 	// res.redirect(highestResolutionFormat.url);

// 	// 3
// 	 // Set the appropriate headers for the file download
// 	 res.setHeader('Content-disposition', 'attachment; filename=' + v_id + '.mp4');
// 	 res.setHeader('Content-type', 'video/mp4');
 
// 	 // Pipe the video stream to the response
// 	 ytdl(req.query.url, {
// 		 format: highestResolutionFormat
// 	 }).pipe(res);
});
app.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});
