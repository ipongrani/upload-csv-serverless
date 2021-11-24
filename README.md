# CSV Upload and parse to JSON

`This project is created with Serverless Framework Nodejs 12.x. and Expressjs Web framework.`

## Requirements:
    Nodejs
    express
    multer
    csvtojson
    cors
    serverless-http


## Setup Guide:

Clone this repository with 'git clone' command: ''

Configure the serverless.yml with your own information such as the service name and the region of deployment.

Navigate to the Root folder and install all dependecies via npm command `npm install`.

**Note: add serverless-offline via `npm i serverless-offline --save-dev` for offline testing. Additionally, you can also use `nodemon` to automate hot-refresh upon saving of files. `npm i -g nodemon`**

to start the service offline, navigate to the root folder and then execute the command `nodemon --exec serverless offline`.

### `Routes`

GET /uplaod - returns an HTML message

POST /upload - accepts a csv payload and converts it from a buffer into a csv string and then parsed into Json.



### `Deployment`

Prepare the serverless.yml file and define the functions and its options. Add HTTP to the EVENTS and set CORS option to `true`. Set the PATH to match the route inside the handler.

**Note: This is in assumption that you already have the Serverless CLI installed, if not, please proceed installing this in your machine**

**Please install AWS CLI and setup credentials with `aws configure` command. You can get the access key and Id via the AWS IAM service**

In the Root Directory of the project, run the command `sls deploy -v`

## TROUBLESHOOTING

Common issue encountered when deploying a serverless function is that the API is not accessible. Be sure to check the API Gateway and enable the cors on the function endpoint. 

*Deploy the API after making the changes in the API Gateway service* 


#### `Author: Rani Ipong`
