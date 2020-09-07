# Node.JS file serving CMS
A file-serving CMS built in node.js and using MySQL.

## What can it do?

Well, it allows users to browse, download, preview and review files. That's pretty much it.

Here's a quick list of current features:
* Preview/Browse files
* Download files
* View reviews
* Search for files
* Can "like" reviews
* Can create reviews

It cannot, but would like it to be able in future to:
* Allow you to upload files
* Store your favourite tags
* Be able to follow tags and accounts

## Running it

### Requirements

* Have Node.js, NPM, MySQL server and elasticsearch installed
* Have MySQL server and elasticsearch running

### Instructions

1. Run `npm install` from the root directory to install node dependencies.
2. Install sample database:
    - Run `mysql` from command line.
    - Run `source docs/sample-db.sql` to import database and users.
3. Run `npm start` in the root directory to start the software.
4. The software should start running at http://localhost.

## Config

You can change settings like site name, database details and others in /config.js.

