//jshint esversion:6

const express = require("express");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose")

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todo',{useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection



const itemSchema = {
  name : { type: String, required: true}
}

const Item = mongoose.model('item',itemSchema)

const itemName = new Item({ name: "cellphone"})




//Display Item
app.get("/", function(req, res) {

  Item.find({},(err, foundItem) =>{
    if(foundItem === 0){
    // Item.insertMany([itemName])
    res.redirect('/')
    }
      res.render("list", {listTitle: day, newListItems: foundItem});   
  })
const day = date.getDate();
});



//Save Item
app.post("/", function(req, res){
  const item = req.body.newItem;
  ItemName = new Item({ name:item})
  ItemName.save()
  res.redirect('/')
});



//Detele Check Item
app.post("/delete", function(req, res) {
  const checkID = req.body.checkid
  Item.findByIdAndRemove(checkID,()=>{
    
  })
  res.redirect('/')
})



app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
