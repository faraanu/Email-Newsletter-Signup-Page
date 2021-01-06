const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");



const app = express(); // app constant is equal to a new instance of express

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); // specefies a static foler for all css/image files

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const audienceID = "085dd911ec";
    const server = "us17";
    const key = ""; // Deleted Key For GitHub

    const url = "https://" + server + ".api.mailchimp.com/3.0/lists/" + audienceID +"?skip_merge_validation=false&skip_duplicate_check=false";

    const data = {
        members: [{ // Since theres only 1 person being added at a time the members array has 1 element
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName        
                }
            }]
    };

    const jsonData = JSON.stringify(data);

    const options = {
        method: "POST",
        auth: "faraan:" + key

    }

    const request = https.request(url, options, function(response){
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else if ( response.statusCode >=400) {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
    
    
    request.write(jsonData);
    request.end();
    

});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});