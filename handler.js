'use strict';



// import required packages
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const multer = require('multer');
const csvtojson = require('csvtojson')
const AWS = require('aws-sdk');
const s3 = new AWS.S3();




// Setup a temporary storage in memory for the result
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const app = express();


// setup cors and body parsers
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**
 * Below are the routes we are setting up as endpoints
 * 
 * Note: The routes created below should also be defined in the serverless.yml
 * 
 */

/* Upload with multer */
app.get('/upload', (req, res, next) => {
  res.status(200).send("<h1>Please POST your CSV Files</h1>");
});



/* Upload with multer */
app.post('/upload', upload.array('csv', 1),  (req, res, next) => {

  /**
   * Multer will attach the multipart file inside req.files and in the form of an array
   */
 
  // if files array has items inside, proceed
  if (req.files.length > 0)
  {
    console.log('file received')
    // convert the buffer to string format
    const csvString = req.files[0].buffer.toString()
    const resultSet = []
    let _filename = '';

    return csvtojson({noheader:false, trim:true, output:'json'})
                      .fromString(csvString)
                      .subscribe((obj)=>{
                        /**
                         * The API is processing the data line by line so a collection of the lines will be needed: 
                         * ie. pushing the lines to the rersultSet
                         */
                        resultSet.push(obj)
                      })
                      .then(() => {
                        /**
                         * After all the lines have been processed, send back the result to the user
                         */

                        // perform upload with a promise
                        _filename = `public-uploaded-csv/${Date.now()}.json`
                        return s3.upload({ Bucket: 'upload-csv-app',
                                            Key: _filename,
                                            Body: JSON.stringify(resultSet),
                                            ContentType: "application/json",
                                            ACL:'public-read' }).promise()
                                  
                        
                      })
                      .then(() => {
                        //return the result back
                        return res.status(200).send({objLink: _filename, resultSet});
                      })
                      .catch(error => {
                        // handle errors
                        console.log('error at csvtojson: ', error)
                        return res.status(502).send({message: 'please report to administrator'})
                      })
  } 
  else
  {
    // if there are no attachments, return 404
    return res.status(404).send({message: 'No CSV File Found!'})
  }
  

});





/* Upload with s3 */
app.get('/upload/s3',upload.array('csv', 1), (req, res, next) => {
  res.status(200).send("<h1>This will be an implementation using s3 please POST request to /upload </h1>");
});





module.exports.main = serverless(app);


