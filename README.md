# Mongoscraper

## Hosted on Heroku
http://mongo-job-scraper.herokuapp.com/

## Github Repo
https://github.com/m-gilman/mongoscraper

## Description of the app
A Mongo Scraper that scrapes articles from a job search website (indeed.com). 

It allows users to save, view, and remove articles, as well as, save, view and remove notes on the articles. 

## Technologies Used
* Node/NPM
* Javascript
* jQuery/AJAX
* Mongo/Mongoose
* Handlebars
* Express
* Body-parser
* Request
* Cheerio.js

## Overview
Clicking on the Search for jobs button runs a scrape of indeed.com. It will bring back job postings and their title, URl (link) and location. 

### Users can click:
* The Star to save the job. 
* The Saved button to go to all saved jobs
#### From the Saved page:
* The Trash Can to delete (unsave) a job
* The Pencil to add notes to a job
#### From the Notes page:
* Add a title
* Add a note
* Save multiple notes on one job
* Delete notes on a particular job


