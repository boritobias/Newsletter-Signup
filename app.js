const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
require('dotenv').config();

const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => res.sendFile(`${__dirname}/signup.html`))

app.post('/', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);

  const options = {
    url: "https://us4.api.mailchimp.com/3.0/lists/94a390c0e7",
    method: "POST",
    headers: {
      "Authorization": `susumoa ${process.env.APIKEY}`
    },
    body: jsonData
  }

  request(options, (error, response, body) => {
    if (error) {
      res.sendFile(`${__dirname}/failure.html`)
    } else {
      if (response.statusCode == 200) {
        res.sendFile(`${__dirname}/success.html`)
      } else {
        res.sendFile(`${__dirname}/failure.html`)
      }
    }
  })

})

app.post("/failure", (req, res) => res.redirect("/"));


app.listen(process.env.PORT || 3000, ()=>console.log("Server is running"))
