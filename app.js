const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  console.log(firstName + " " + lastName + " " + email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us8.api.mailchimp.com/3.0/lists/d93e909ec96";
  const options = {
    method: "POST", // Method for post request
    auth: "mindlessfeats:c0ffc527fd59e9192ae09100bb2255ef-us8", // Authenticating to mailchimp servers using API key to post data. Format - "anystring:apikey"
  };

  // Have to make a constant to store the request to mailchimp servers and pass jsonData as a parameter
  const request = https.request(url, options, function (response) {
    console.log(response.statusCode);
    response.on("data", function (data) {
      console.log(JSON.parse(data)); // Logging the data in JSON format from mailchimp servers
    });

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });

  request.write(jsonData); // Writing the data to mailchimp servers
  request.end();
});

// Redirecting to home page if failure occurs
app.post("/failure-redirect", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT, function () {
  console.log("App running on port 3000");
});

// c0ffc527fd59e9192ae09100bb2255ef-us8 - APIkey
// 93e909ec96 - list id
