/*
POSTMAN API STARTER

This API works in conjunction with the API Starter collecction in Postman to walk you through API basics.
Import the collection into Postman and send a request to the setup endpoint to begin.

This Glitch app is based on hello-express and low-db.

Below you'll see the code for the endpoints in the API after some initial setup processing
  - each endpoint begins "app." followed by get, post, patch, put, or delete, then the endpoint path, e.g. /cat
*/

// server.js
// where your node app starts

const express = require("express");
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup a new database persisted using async file storage
// Security note: the database is saved to the file `db.json` on the local filesystem.
// It's deliberately placed in the `.data` directory which doesn't get copied if someone remixes the project.
var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync(".data/db.json");
var db = low(adapter);

// default cat list
db.defaults({
  cats: [
    { name: "Syd", humans: 17 },
    { name: "Hamish", humans: 3 },
    { name: "Peggy", humans: 5 }
  ]
}).write();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

//setup collection - swap your api url and secret into the collection variables
app.get("/setup", (request, response) => {
  response.status(200).json(
    {
      title: "Welcome to the API Starter collection! 🎓🚀",
      init_note: "If you're using the API Starter template in Postman, click **Visualize**!",
      intro: "This collection will walk you through learning the basics of API operations. "+
      "You will call your own API in Postman and make changes to the API code itself on Glitch. "+
      "Carry out the setup steps to get learning and leave with a starter project you can continue developing! 🏗️",
      info: [
        {
          note: "Make sure you are using the **API Starter** template in Postman. If you aren't, in Postman click __New__ &gt; __Templates__, "+
          "search for 'api starter', select the template and click **Run in Postman**. _Alternatively visit `tbc` in your web browser_.",
          pic: "tbc"
        },
        {
          note: "Open the collection in __Collections__ on the left of the Postman app, select this request again (`GET` 0. Setup API) "+
          "and click **Send**, select **Visualize** then proceed to the next step:"
        },
        {
          note: "Visit the **Postman API Starter** app on Glitch—open `https://glitch.com/~postman-api-starter` in your web browser and **Remix** "+
          "the project. _Sign up for a Glitch account to save your work for later._",
          pic: "https://assets.postman.com/postman-docs/api-starter-remix-glitch.jpg"
        },
        {
          note: "The Postman collection sends requests to the original API, but you can edit it to use your remix. Find the URL for your "+
          "Glitch remix by clicking __Show__ &gt; __In new window__. Copy it from the address bar in your web browser—"+
          "it should have the format `your-app-name.glitch.me`).",
          pic: "tbc"
        },
        {
          note: "Back in Postman, find the __API Starter__ in __Collections__ on the left again, click __...__ &gt; __Edit__.",
          pic: "tbc"
        },
        {
          note: "Select __Variables__ and update the `url` variable values (both initial and current) to match your own Glitch app location. "+
          "__Update__ your collection to save the variable.",
          pic: ""
        },
        {
          note: "In the request address, you will see `{{url}}`—this is a variable reference, hover over it and you should see the address "+
          "for your own Glitch app remix. Try sending this request again to make sure it works, you should see the same response.",
          pic: ""
        },
        {
          note: "Now you're ready to go! In the collection, click the first request `GET` __1. Get one cat__ and click __Send__. "+
          "The __Response__ will guide you through the next steps in the __Body__ tab &gt; __Visualize__! 🎉",
          pic: "tbc"
        }
      ]
    });
  //TODO add postman explore or docs link
  //TODO add glitch images where tbc
  //TODO tell update secret later in pm and g
});

//get a single random cat
//TODO add Having a Postman account will also let you save your changes to the collection.
app.get("/cat", (request, response) => {
  if (request.query.humans) {
    //send back cat with most humans
    var cats = db
      .get("cats")
      .sortBy("humans")
      .value();
    if (request.query.humans === "most")
      response.status(200).json({ leading_cat: cats[cats.length - 1] });
    else if (request.query.humans === "least")
      response.status(200).json({ trailing_cat: cats[0] });
    else
      response
        .status(400)
        .json({
          error:
            "🚧Oops! Check your 'humans' query parameter value—you passed '" +
            request.query.humans +
            "' but it should be either most or least."
        });
  } else {
    var cats = db.get("cats").value(); // Find all cats in the collection
    var randCat = cats[Math.floor(Math.random() * cats.length)];
    //TODO update link to correct collection
    response.status(200).json({
      title: "Get one cat",
      init_note: "If you're using the API Starter template inside Postman - click **Visualize** for a much more informative view of this info!",
      intro: "You made a request to retrieve a cat from the database!",
      info: [
        {
          note: " It uses `GET` method because you are retrieving data. Later you'll use different methods to send data to the API."
        },
        {
          note:
            "The API returned a random cat, including its name and the number of humans it has, like this:",
          json_content: {cat: randCat}
        },
        {
          note: "Notice above and to the right in Postman that the response returned a _200 OK_ **Status** code. "+
            "You can also see the response time and size—hover over them for more detail."
        },
        {
          note: "🔖Before you continue, in the left, open **History** and make sure **Save Responses** is switched on—"+
            "this will let you look back through your requests later. "+
            "💾**Save** your edits as you work on the requests using the button to the top right (it's easier if you sign up for a "+
          "Postman account). _You can import the collection again if you want to start over_."
        },
        {
          note: "In Glitch (in the web browser), **Edit** your remix of the API app and open the `server.js` file. This is the code "+
          "for the endpoints you're calling in Postman. Scroll down to see the different sections. Each endpoint begins `app` then the "+
          "method e.g. `.get` followed by the path e.g. `/cat`. The first endpoint is the `/setup` one you called first to setup your version. "+
          " _Don't worry if you don't understand the JavaScript in Glitch, you should still be able to follow the steps._"
        },
        {
          note: "This is the `app.get('/cat', ...)` request, which you'll "+
          "see has an `if...else` inside it. The if part checks to see if you sent a query parameter named `humans` but in this case you "+
          "didn't, so it returned what's in the else.",
          pic: ""
        }
      ],
      next: "Next try adding the query parameter. In Postman, under the request address, select **Params**."
    });
  }
});

//get all cats
app.get("/cats", (request, response) => {
  var dbCats = [];
  var cats = db.get("cats").value(); // Find all cats in the collection
  console.log(cats);
  response.status(200).json({
    message:
      "This response includes an array—click Visualize above and then scroll to see it displayed as a chart",
    cats: cats
  });
});

//generic get error
app.get("/*", (request, response) => {
  response.status(400).json({
    error:
      "🚧Oops this isn't a valid endpoint! "+
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});

//protect everything after this by checking for the secret
app.use((req, res, next) => {
  const apiSecret = req.get("cat_key");
  if (!apiSecret || apiSecret !== process.env.SECRET) {
    res.status(401).json({
      error: "🚫Unauthorized - your secret needs to match the one on the server!"
    });
  } else {
    next();
  }
});

// removes entries from users and populates it with default users
app.get("/reset", (request, response) => {
  // removes all entries from the collection
  db.get("cats")
    .remove()
    .write();
  console.log("Database cleared");

  // default users inserted in the database
  var cats = [
    { name: "Syd", humans: 17 },
    { name: "Hamish", humans: 3 },
    { name: "Peggy", humans: 5 }
  ];

  cats.forEach(cat => {
    db.get("cats")
      .push({ name: cat.name, humans: cat.humans })
      .write();
  });
  console.log("Default cats added");
  response.redirect("/");
});

// removes all entries from the collection
app.get("/clear", (request, response) => {
  // removes all entries from the collection
  db.get("cats")
    .remove()
    .write();
  console.log("Database cleared");
  response.redirect("/");
});

// creates a new entry in the users collection with the submitted values
app.post("/cat", (request, response) => {
  if (request.body.name && request.body.humans) {
    db.get("cats")
      .push({ name: request.body.name, humans: request.body.humans })
      .write();
    console.log("New cat inserted in the database");
    response.status(200).json({ status: "Cat added", cat: request.body });
  } else
    response
      .status(400)
      .json({ error: "🚧Bad request - please check your cat body data!" });
});

//update cat human field
app.patch("/cat", (request, response) => {
  if (request.query.name && request.body.humans) {
    db.get("cats")
      .find({ name: request.query.name })
      .assign({ humans: request.body.humans })
      .write();
    response.status(201).json({
      status: "Updated",
      cat: request.query.name,
      humans: request.body.humans
    });
  } else
    response
      .status(400)
      .json({ error: "🚧Bad request - please check your data!" });
});

//update entire cat
app.put("/cat", (request, response) => {
  if (
    request.query.current_name &&
    request.body.humans &&
    request.body.new_name
  ) {
    db.get("cats")
      .find({ name: request.query.current_name })
      .assign({ name: request.body.new_name, humans: request.body.humans })
      .write();
    response.status(201).json({
      status: "Updated",
      cat: request.query.new_name,
      humans: request.body.humans
    });
  } else
    response
      .status(400)
      .json({ error: "🚧Bad request - please check your data!" });
});

//delete cat
app.delete("/cat", (request, response) => {
  if (request.query.name) {
    db.get("cats")
      .remove({ name: request.query.name })
      .write();
    response.status(200).json({ status: "Deleted", cat: request.query.name });
  } else
    response
      .status(400)
      .json({ error: "🚧Bad request - please check your data!" });
});

//errors
app.post("/*", (request, response) => {
  response.status(400).json({
    error:
      "🚧Oops this isn't a valid endpoint! "+
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});
app.put("/*", (request, response) => {
  response.status(400).json({
    error:
      "🚧Oops this isn't a valid endpoint! "+
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});
app.patch("/*", (request, response) => {
  response.status(400).json({
    error:
      "🚧Oops this isn't a valid endpoint! "+
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});
app.delete("/*", (request, response) => {
  response.status(400).json({
    error:
      "🚧Oops this isn't a valid endpoint! "+
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
 