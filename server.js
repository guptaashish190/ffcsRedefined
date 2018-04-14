var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongoose = require("mongoose");
var routes = require("./routes/index");
var app = express();

//Connect to mongodb
mongoose.connect("mongodb://localhost:27017/ffcdDB", (err) => {
  if (err){
    console.log("Error Connecting to the db: " + err);
  }else{
    console.log("Successfully connected to db");
  }
});

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Morgon Middleware
app.use(morgan("dev"));

//Routes
app.use("/",routes);

//Use static files
app.use(express.static(__dirname + "/public"));

//Port Number
var PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log("Server started at port: " + PORT);
});
