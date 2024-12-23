const express = require("express");
const bodyParser = require("body-parser");
const numberToWords = require("number-to-words");
const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const { json } = require("body-parser");
let axios = require("axios");
const mongoose = require("mongoose");
app.use(bodyParser.json());
const { MongoClient, ObjectId } = require("mongodb");

//The MongoClient allows you to connect to a MongoDB server and perform database
//operations, while the ObjectId is used for generating unique identifiers for MongoDB documents.
const url =
  "mongodb+srv://Balram600:BalramGupta1234@cluster0.uhnbmyk.mongodb.net/usersDetails?retryWrites=true&w=majority";
const dbName = "usersDetails"; // this is the name of database in mongoDB Server
const client = new MongoClient(url); //stabalising connection with the server

function convertTimestampToDate(timestamp) {
    var date = new Date(timestamp);
    var options = { month: "numeric", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
}

app.post("/cdr", async (req, res) => {
  var cdr = req.body;
  let result = await client.connect();
  let db = result.db(dbName);
  let collection = db.collection("NBFCDatas2");
  let collection2 = db.collection("usersDataHistory");

  if(cdr.type="cdr"){
    let borrowerPhone=cdr.to+"";
    borrowerPhone=borrowerPhone.slice(2)
    let prevInfo={
        lastCall: convertTimestampToDate(cdr.time),
        duration: cdr.duration,
        status: cdr.status,
        timestamp: cdr.time,
    }
    try {
        let saveStatus = await collection.updateOne({ borrowerPhone: borrowerPhone }, { $set: { telecmiCallStatus: prevInfo } });
        let saveStatus2 = await collection2.insertOne(cdr);
        console.log(saveStatus);
      } catch (error) {
        console.error('Error:', error);
      }
    // let saveStatus = await collection.updateOne({borrowerPhone:borrowerPhone}, {$set:{telecmiCallStatus:prevInfo}});
    // let saveStatus2=await collection2.insertOne(cdr);
  }
  res.send("call in going on");
  console.log(cdr, "cdr");
});

const port = process.env.PORT | 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});