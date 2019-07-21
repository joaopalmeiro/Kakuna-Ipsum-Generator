// Require express and create an express application instance
const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");
const app = express();

// Require the express routes defined in router.js
// This variable holds the application routing logic
const routes = require("./router");

// Define the hostname and port where the server can be found
const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// Define the directory where static files are found
// It tells Express where to look when serving static assets (such as images, html, and css files)
app.use(express.static("public"));

// Specify the routes to be used for our application
app.use(routes);

// Begin accepting connections to the specified port
app.listen(port, () => {
  // Display server location information to the console
  console.log(`Server is listening at http://${hostname}:${port}/`);
});
