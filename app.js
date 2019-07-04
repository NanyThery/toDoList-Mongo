//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/toDoListDB", {
  useNewUrlParser: true
});

const itemSchema = new mongoose.Schema({ // This is de item schema.
  task: {
    type: String,
    // list: {
    //   type:String,
    //   required: true,
    // }
  },

});

const Item = mongoose.model("Item", itemSchema); // This is the item model. 

const item1 = new Item({
  task: "This is your to-do list",
});

const item2 = new Item({
  task: "Hit the + button to add a new task"
});

const item3 = new Item({
  task: "<-- hit this to delete a task"
});

const defaultArray = [item1, item2, item3];
let comprobacion = [];

Item.find({}, function (err, item) {
  comprobacion = item;
});


app.get("/", function (req, res) {

  const day = date.getDate();

  Item.find({}, function (err, item) { // formula para encontrarlo todo.
    if (item.length === 0) {
      Item.insertMany(defaultArray, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("added succesfully");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "today",
        newListItems: item
      });
    }
  });
});

app.post("/", function (req, res) {

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});