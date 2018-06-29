//Dependencies
const express = require('express');
const cheerio = require('cheerio');
const app = express();
const db = require('../models');


let scrapeURL = "https://www.indeed.com/jobs?q=web+developer&l=Plano%2C+TX";


// A GET route for scraping the website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get(scrapeURL).then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every div with a class of "result", and do the following:
        $("div .result").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children(".jobtitle")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            result.companyName = $(this)
                .children('.sjcl')
                .children('.company')
                .text();
            result.location = $(this)
                .children('.sjcl')
                .children('.location')
                .text();
            result.summary = $(this)
                .children('.paddedSummaryExperience')
                .children('table')
                .find('.summary')
                .text();
            result.experience = $(this)
                .children('.paddedSummaryExperience')
                .find('.experience')
                .text();

            // Create a new Job using the `result` object built from scraping
            db.Job.create(result)
                .then(function (dbJob) {
                    // View the added result in the console
                    console.log(dbJob);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });

        // If we were able to successfully scrape and save a Job, send a message to the client
        // res.send("Scrape Complete");
        res.redirect('/')
    });
});


module.exports = app;
