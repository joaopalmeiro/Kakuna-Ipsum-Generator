// Require the necessary modules
const loremIpsum = require("./generator.js");
const querystring = require("querystring");
const fs = require("fs");

// Require express and create an express router object
// Create a router instance in order to properly manage the routes and their handlers
// (a route handler is the function that gets executed for a specific route)
const express = require("express");
const router = express.Router();

// Route that serves index.html
router.get("/", (request, response) => {
  response.setHeader("Content-Type", "text/html");
  // Capture the contents of index.html in a variable
  let fileContents = fs.readFileSync("./public/index.html", {
    encoding: "utf8"
  });
  // Send a response to the client with the index.html file
  response.write(fileContents);
  response.end();
});

// Route that generates the lorem ipsum text and reloads a modified index.html
router.post("/", (request, response) => {
  // The callback to request.on() gets called once data is received from the client
  // and that data is stored in the inputValue variable
  request.on("data", function(inputValue) {
    // Convert the POST data into a readable string
    let query = inputValue.toString(); // i.e. numberOfParagraphs=3
    // Parse the query into a key/value pair and store the value of numberOfParagraphs
    // in a variable
    let numberOfParagraphs = querystring.parse(query).numberOfParagraphs;
    // Generate the lorem ipsum text with the getAllParagraphs function
    let loremIpsumText = loremIpsum.getAllParagraphs(numberOfParagraphs);
    // Capture the contents of index.html in a variable
    let fileContents = fs.readFileSync("./public/index.html", {
      encoding: "utf8"
    });
    // Replace the placeholder <div> with the lorem ipsum text
    fileContents = fileContents.replace(
      '<div class="placeholder-div"></div>',
      loremIpsumText
    );
    response.setHeader("Content-Type", "text/html");
    // Send a response to the client with the modified index.html file
    response.write(fileContents);
    response.end();
  });
});

module.exports = router;
