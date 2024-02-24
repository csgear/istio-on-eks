

var express = require("express");
var app = express();
var http = require('http');
var os = require("os");

var responseStatus = 200;

app.get("/catalogDetail", (req, res, next) => {
    let tenant_id = req.header('x-tenant') ?? 'tpm'
    console.log("Product ui received headers: ", tenant_id);
  
    res.status(responseStatus)
    if (responseStatus == 200) {
        console.log("Catalog Detail Get Request Successful");
        res.json({
                 "version":"2",
                 "vendors":[ "Entrust.com", "Microsoft.com" ]
                  } )
    } else {
        console.log("Catalog Detail Get Request has error 500");
        res.json("Error")
   }
});

app.get("/ping", (req, res, next) => {
    res.status(responseStatus)
    if (responseStatus == 200) {
        res.json("Healthy")
    } else {
        console.log("Returning unhealthy");
        res.json("UnHealthy")
   }
});

app.get("/injectFault", (req, res, next) => {
    console.log("host: " + os.hostname() + " will now respond with 500 error.");
    responseStatus=500;
    res.status(500);
    next(new Error("host: " + os.hostname() + " will now respond with 500 error."));
});

app.get("/resetFault", (req, res, next) => {
   console.log("Removed fault injection from host: " + os.hostname());
   responseStatus=200;
   res.json("Removed fault injection from host: " + os.hostname());
});


app.listen(3000, () => {
 console.log("Server running on port 3000");
});