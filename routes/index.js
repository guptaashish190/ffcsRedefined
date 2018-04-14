var express = require("express");
var path = require("path");

var ffcsData = require(path.join(__dirname, "../models/ffcsMongo.model"));

var router = express.Router();

//Index Page
router.get("/", (req, res) => {

  res.sendFile(path.join(__dirname, "../public/index.html"));

});

router.post("/getit", (req, res) => {
  var searchString = req.body.search.toUpperCase();
  var type = req.body.type;
  if (type == "Course Code") {
    ffcsData.find({
      CODE: searchString
    }, function(err, extract) {
      res.send(extract);
    });
  } else {
    ffcsData.find({
      FACULTY: searchString
    }, function(err, extract) {
      res.send(extract);
    });
  }
});

//Autocomplete Post (Incomplete)
router.post("/autoComplete", (req, res) => {
  var tempSearchVal = req.body.tempSearch.toUpperCase();
  var typeString = req.body.type;
  if (tempSearchVal != "") {
    if (typeString == "Course Code") {
      ffcsData.distinct("CODE", {
        CODE: RegExp("^" + tempSearchVal)
      }, function(err, extract) {
        res.send(extract);
      });
    } else {
      ffcsData.distinct("FACULTY", {
        FACULTY: RegExp("^" + tempSearchVal)
      }, function(err, extract){
        res.send(extract);
      });
    }
  } else {
    res.send({});
  }
});
router.post("/addElement", (req, res) => {
  var addElementId = req.body.id;
  ffcsData.findOne({
    _id: addElementId
  }, function(err, extract) {
    res.send(extract);
  });
});
router.post("/getEmbedded",(req,res)=>{
  var code = req.body.courseCode;
  var fac = req.body.faculty;
  ffcsData.find({CODE:code,FACULTY:fac},function(err,extract){
    res.send(extract);
  });
});
module.exports = router;
