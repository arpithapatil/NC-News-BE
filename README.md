# Northcoders News BE

This project is for creating an API for a reddit style news website using Node.js, Express.js, MongoDB and Mongoose.This project is a RESTful API for Northcoders News, a news aggregation site.The link to see the deployed version of the project is [here.](https://arpitha-patil-nc-news-backend.herokuapp.com/)

# SetUp

You will need Node.js v7.9.0 or later npm, git and MongoDB v3.2 or later installed before being able to run this project.

To check if Node.js is installed on your machine open a terminal window and enter:

```
node -v
```
You will also need to check that npm is installed along with node. To check type the following
```
npm -v
```
If you do not have node or npm installed, follow this [guide](https://nodejs.org/en/download/package-manager/).

You will also need git installed on your machine. To check that you have it installed type the following command
```
git --version
```
If you do not have it installed follow this [guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

If you do not have MongoDB already installed, please follow [this guide](https://docs.mongodb.com/manual/installation/)

# Installation

In order to install this project make sure you are in a directory you wish to install in your terminal and run the following command
```
git clone https://github.com/arpithapatil/NC-News-BE.git
```
then navigate into the folder and run
```
npm install
```
In a separate terminal run the following command to connect to the database and keep it running when running the server

```
mongod
```
Open another terminal window, navigate inside the project folder and enter the following command to populate the database: 
```
node seed/seed.js
```
# Running the server

To start the server run the following command
```
npm start
```
This will run the server on PORT 3000 and all endpoints can be found locally on http://localhost:3000 .

# Testing

To run the tests enter the following command 
```
npm t
```
Testing was done using supertest, mocha and chai through a Test Driven Development approach.


# Built With

* [supertest](https://github.com/visionmedia/supertest)
* [mocha](https://mochajs.org/)
* [chai](http://chaijs.com/)
* [express](https://expressjs.com/)
* [mongoDB](https://www.mongodb.com)
* [mongoose](http://mongoosejs.com/)

# Authors

[Arpitha Patil](https://github.com/arpithapatil)