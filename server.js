const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8080;
const HOSTNAME = "localhost";
const PUBLIC_DIR = "public";

const serverHandler = (request, response) => {
  fs.readdir(PUBLIC_DIR, (err, files) => {
    if (err) {
      response.statusCode = 500;
      console.error("Error reading directory:", err);
      response.end("500 INTERNAL SERVER ERROR");
      return;
    }
    const htmlFiles = files.filter((file) => path.extname(file) === ".html");

    if (htmlFiles.length === 0) {
      response.statusCode = 404;
      console.error("No HTML files found in directory");
      response.end("404 FILE NOT FOUND");
      return;
    }

    const firstHtmlFile = htmlFiles[0];
    const filePath = path.join(PUBLIC_DIR, firstHtmlFile);

    fs.readFile(filePath, "utf-8", (err, file) => {
      if (err) {
        response.statusCode = 500;
        console.error(`Error reading file ${filePath}:`, err);
        response.end("500 INTERNAL SERVER ERROR");
        return;
      }

      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html");
      response.end(file);
    });
  });
};

const server = http.createServer(serverHandler);

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server mounted at http://${HOSTNAME}:${PORT}`);
});
