//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose")
const _= require('lodash')
require('dotenv/config')



const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));

  mongoose.connect(
    process.env.DB_CONNECTION,
  {useNewUrlParser: true, useUnifiedTopology: true}
  )

const db = mongoose.connection


//Schema
const itemSchema = {name: String}
const listSchema = {name: String, items: [itemSchema ]   }

//Model
const Item = mongoose.model('item',itemSchema)
const List = mongoose.model('list',listSchema)

//collections List
// const itemName = new Item({})




//dynmic route
app.get("/:customList",(req,res)=>{
const customListName = _.capitalize(req.params.customList)

      List.findOne({name: customListName},(err,result)=>{
     if(!err) {
       if(!result){
         const listName = new List({ name:customListName , items:{}})
        listName.save()   
        res.redirect("/" + customListName)
        
       }else{
         res.render("list", {listTitle: result.name, newListItems: result.items});   }
     }
      })

})


//Display Item
app.get("/", function(req, res) {

  Item.find({},(err, foundItem) =>{
    if(foundItem === 0){
    // Item.insertMany([itemName])
    res.redirect('/')
    }
      res.render("list", {listTitle:"Home" , newListItems: foundItem});   
  })
});

// list list
// app.get("/", function(req, res) {

//   List.find({name:{}},(err, lastItem) =>{
//     if(!lastItem){
//     // Item.insertMany([itemName])
//     console.log("k")
//     res.redirect('/')
//     }else{
//        res.render("list", {listTitle: "Home", newListItems: lastItem}); 
//       console.log("l") 
//       }
     
//   })
// });





//Save Item
app.post("/", function(req, res){
  const item = req.body.newItem
  const lists = req.body.list
  const saveItem = new Item({ name:item})
  if(lists === "Home"){
  saveItem.save()
  res.redirect('/')
  }else{
    List.findOne({name:lists},(err, result)=>{
      result.items.push(saveItem) 
      result.save()
      res.redirect('/' +  lists)
    })
  }

});



//Detele Check Item
app.post("/delete", function(req, res) {
  const checkID = req.body.checkid
  const listName = req.body.listName

  if(listName === "Home"){
  Item.findByIdAndRemove(checkID,()=>{
      res.redirect('/')
  })
  }else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkID}}},(err, result)=>{
      if(!err){
        res.redirect('/' + listName)
      }
    })
  }
})



app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
