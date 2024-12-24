const express = require("express");
const bodyParser = require("body-parser");
const numberToWords = require("number-to-words");
const serverless = require("serverless-http");
require('dotenv').config();
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
const url1 = "mongodb+srv://Balram600:BalramGupta1234@cluster0.uhnbmyk.mongodb.net/?retryWrites=true&w=majority";
const url2 = "mongodb+srv://Balram600:Balram489@serverlessinstance0.imdt2za.mongodb.net/usersDetails?retryWrites=true&w=majority";
const dbName = "usersDetails"; // Get the database name
const dbName2 = "UsersDatabase";
const client = new MongoClient(url1); // Establishing connection with the server
const client1 = new MongoClient(url2);

var person = {};

async function getPerson(req, res, next) {
  console.log(req.body);
  if (req.body.from == 918031406693 || req.body.from == 918031406692) {
    let phone = req.body.to;
    let type = JSON.parse(req.body.extra_params);
    if (type.type == "usersData") {
      try {
        console.log("This is a middleware function");
        const db = client.db(dbName);
        const collection = db.collection("usersData");
        person = await collection.findOne({
          $or: [{ phone: +phone }, { phone: phone + "" }],
        });
      } catch (error) {
        console.error("Error fetching person data:", error);
        res.status(500).send("Internal Server Error");
      }
    }
  } else if (req.body.to == 918031406693 || req.body.to ==918031406692) {
    let phone = req.body.from;
    try {
      console.log("This is a middleware function");
      const db = client.db(dbName);
      const collection = db.collection("usersData");
      person = await collection.findOne({
        $or: [{ phone: +phone }, { phone: phone + "" }],
      });
      // console.log(person);
    } catch (error) {
      console.error("Error fetching person data:", error);
      res.status(500).send("Internal Server Error");
    }
  }
  next();
}

async function savePrevInfo(req, res, next) {
  console.log(req.body.from, "req.body.from");
  if (req.body.from == 918031406693 || req.body.from ==918031406692) {
    console.log(req.body.from, "req.body.from2");
    let type = JSON.parse(req.body.extra_params);
    if (type.type == "usersData") {
      let phone = req.body.to;
      var cdr = req.body;
      
        const result = await client.connect();
        const db = result.db(dbName);
        const collection = db.collection("usersData");
        const collection2= db.collection("usersDataHistory");
        
          let status = cdr.status;
          if (person.prevInfo && person.prevInfo.status === "answered") {
            status = "answered";
          }
          const updateValue = await collection.updateOne(
            { $or: [{ phone: +phone }, { phone: phone + "" }] },
            {
              $set: {
                prevInfo: {
                  lastCall: convertTimestampToDate(cdr.time),
                  duration: cdr.duration,
                  status: status,
                  timestamp: cdr.time,
                },
                direction: cdr.direction,
                setDtmf: "dtmf1",
              },
            }
          );
          console.log(updateValue,'updateValue');
          const updateValue2 = await collection2.insertOne({cdr})
        
      
    }
  } else if (req.body.to == 918031406693 || req.body.to == 918031406692) {
    let phone = req.body.from;
    var cdr = req.body;
    
      const result = await client.connect();
      const db = result.db(dbName);
      const collection = db.collection("usersData");
      const collection2=db.collection('usersDataHistory');
      
        let status = cdr.status;

        if (person?.prevInfo && person?.prevInfo?.status === "answered") {
          status = "answered";
        }
        const updateValue = await collection.updateOne(
          { $or: [{ phone: +phone }, { phone: phone + "" }] },
          {
            $set: {
              prevInfo: {
                lastCall: convertTimestampToDate(cdr.time),
                duration: cdr.duration,
                status: status,
                timestamp: cdr.time,
              },
              direction: cdr.direction,
              setDtmf: "dtmf1",
            },
          }
        );
        const updateValue2 = await collection2.insertOne({cdr})
     
  } else if (req.body.from == 918031406694) {
    let type = JSON.parse(req.body.extra_params);
    if (type.type == "salesData") {
      let phone = req.body.to;
      var cdr = req.body;
      
        const result = await client.connect();
        const db = result.db(dbName);
        const collection = db.collection("salesData");
        const collection2=db.collection('usersDataHistory');
        
          const updateValue = await collection.updateOne(
            { $or: [{ phone: +phone }, { phone: phone + "" }] },
            {
              $set: {
                prevInfo: {
                  lastCall: convertTimestampToDate(cdr.time),
                  duration: cdr.duration,
                  status: cdr.status,
                  timestamp: cdr.time,
                },
                direction: cdr.direction,
              },
            }
          );
          const updateValue2 = await collection2.insertOne({cdr})
        
      
    }
  } else if (req.body.from == 918031406694) {
  // console.log(req.body, "savePrevInfo");
  let type = JSON.parse(req.body.extra_params);
  console.log(type);
  if (type.type == "CallingData2") {
    let phone = req.body.to;
    var cdr = req.body;
   
      const result = await client.connect();
      const db = result.db(dbName);
      const collection = db.collection("CallingData2");
      const collection2 = db.collection("usersDataHistory");
      
        let status = cdr.status;
        if (person?.prevInfo && person?.prevInfo?.status === "answered") {
          status = "answered";
        }
        // { $or: [{ phone: +phone }, { phone: phone + "" }, {_id:ObjectId(type._id)}] },
        const updateValue = await collection.updateOne(
          { _id: new ObjectId(type._id) },
          {
            $set: {
              prevInfo: {
                lastCall: convertTimestampToDate(cdr.time),
                duration: cdr.duration,
                status: status,
                timestamp: cdr.time,
                conversation_uuid: cdr.conversation_uuid,
                cmiuuid: cdr.cmiuuid,
                direction: cdr.direction,
              },
            },
          },
          { upsert: false }
        );
        console.log(updateValue, "updateValue");
  }
  } else if (req.body.to == 918031406694) {
  var cdr = req.body;
  var person2 = {};
  
    const phone=cdr.from;
    const result = await client.connect();
    const db = result.db(dbName);
    const collection = db.collection("CallingData2");
    const collection2 = db.collection("usersDataHistory");
    if (cdr.to == 918031406694) {
      let persons = await collection
        .find({ $or: [{ phone: +phone }, { phone: phone + "" }] })
        .sort({ callTime: -1 })
        .limit(1)
        .toArray();
      if (persons) {
        person2 = persons[0];
      }
      let status = cdr.status;
      if (person?.prevInfo && person?.prevInfo?.status === "answered") {
        status = "answered";
      }
      if(person2?.phone){
        const updateValue = await collection.updateOne(
          { _id: new ObjectId(person2._id) },
          {
            $set: {
              prevInfo: {
                lastCall: convertTimestampToDate(cdr.time),
                duration: cdr.duration,
                status: status,
                timestamp: cdr.time,
                conversation_uuid: cdr.conversation_uuid,
                cmiuuid: cdr.cmiuuid,
                direction: cdr.direction,
              },
            },
          },
          { upsert: false }
        );
        console.log(updateValue)
        
      }
    }
  
}
  next();
}

app.use(getPerson);
app.use(savePrevInfo);

function convertTimestampToDate2(timestamp) {
  var date = new Date(timestamp);
  return date;
}

function convertTimestampToDate(timestamp) {
  var date = new Date(timestamp);
  var options = { month: "numeric", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function getNextDate(numberOfDays) {
  const today = new Date();
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + numberOfDays);
  var options = { month: "numeric", day: "numeric", year: "numeric" };
  return nextDate.toLocaleDateString("en-US", options);
}

function getdtmf(dtmf) {
  if (dtmf == "1") {
    setDtmfUser("dtmf1");
    return [
      {
        action: "speak",
        text: `Your ... Bank ... Name ... is ... ${
          person.organization ? person.organization : ""
        } ... and ... your ... Pending ... amount ... is .... Rupees ... ${
          person.pendingAmt ? numberToWords.toWords(+person.pendingAmt) : 0
        }... only`,
      },
      {
        action: "play_get_input",
        file_name:
          "1689677035869nameofbankandnbfcwavfe9b30f0-2557-11ee-a155-59e5d3b0d16d_piopiy.wav",
        max_digit: 1,
        max_retry: 2,
        action_url: "http://ec2-98-84-141-244.compute-1.amazonaws.com:3005/dtmf",
      },
    ];
  } else if (dtmf == "2") {
    // setGetdtmf=getdtmf2;
    setDtmfUser("dtmf2");
    return [
      {
        action: "play_get_input",
        file_name:
          "1689677026335NBFCandbankexplanationwavf8ec1cf0-2557-11ee-a155-59e5d3b0d16d_piopiy.wav",
        max_digit: 1,
        max_retry: 2,
        action_url: "http://ec2-98-84-141-244.compute-1.amazonaws.com:3005/dtmf",
      },
    ];
  } else {
    // setGetdtmf=getdtmf;
    setDtmfUser("dtmf1");
    return getdtmf("1");
  }
}

function getdtmf2(dtmf) {
  if (dtmf == "1") {
    setDtmfUser("dtmf3");
    userDenied(false);
    return [
      {
        action: "play_get_input",
        file_name:
          "1689677010094requestforpaymentindayswavef3cb660-2557-11ee-a155-59e5d3b0d16d_piopiy.wav",
        max_digit: 1,
        max_retry: 2,
        action_url: "http://ec2-98-84-141-244.compute-1.amazonaws.com:3005/dtmf",
      },
    ];
  } else if (dtmf == "2") {
    // setGetdtmf=getdtmf;
    setDtmfUser("dtmf1");
    setRelief("0");
    userCallAgain(true);
    userDenied(false);
    return [
      { 
        action: "play",
        file_name:
          "1689676993914ThanksYourforfuthercallsetupwave59713d0-2557-11ee-a155-59e5d3b0d16d_piopiy.wav",
      },
    ];
  } else if (dtmf == "3") {
    // setGetdtmf=getdtmf;
    setDtmfUser("dtmf1");
    setRelief("0");
    userDenied(true);
    userCallAgain(false);
    return [
      {
        action: "play",
        file_name:
          "1689676983992wrongpeoplewavdfaddd00-2557-11ee-a155-59e5d3b0d16d_piopiy.wav",
      },
    ];
  } else {
    return getdtmf2("1");
  }
}

function getdtmf3(dtmf) {
  // setGetdtmf=getdtmf;
  setDtmfUser("dtmf1");
  if (dtmf == "1" || "2" || "3" || "4" || "5" || "6") {
    setRelief(dtmf);
    userDenied(false);
    userCallAgain(false);
    return [
      {
        action: "play",
        file_name:
          "1689677001071ThankYoumessageifheisreadytopaywave9db9b50-2557-11ee-a155-59e5d3b0d16d_piopiy.wav",
      },
    ];
  }
}

async function setRelief(dtmf) {
  const result = await client.connect();
  const db = result.db(dbName);
  const collection = db.collection("usersData");
  if (dtmf == "0") {
    const updateValue = await collection.updateOne(
      { _id: person._id },
      { $set: { reliefDate: "" } }
    );
  } else if (dtmf == "1") {
    const updateValue = await collection.updateOne(
      { _id: person._id },
      { $set: { reliefDate: getNextDate(0) } }
    );
  } else if (dtmf == "2") {
    const updateValue = await collection.updateOne(
      { _id: person._id },
      { $set: { reliefDate: getNextDate(3) } }
    );
  } else if (dtmf == "3") {
    const updateValue = await collection.updateOne(
      { _id: person._id },
      { $set: { reliefDate: getNextDate(7) } }
    );
  } else if (dtmf == "4") {
    const updateValue = await collection.updateOne(
      { _id: person._id },
      { $set: { reliefDate: getNextDate(10) } }
    );
  } else if (dtmf == "5") {
    const updateValue = await collection.updateOne(
      { _id: person._id },
      { $set: { reliefDate: getNextDate(15) } }
    );
  } else if (dtmf == "6") {
    const updateValue = await collection.updateOne(
      { _id: person._id },
      { $set: { reliefDate: getNextDate(20) } }
    );
  }
}

async function userDenied(flag) {
  const result = await client.connect();
  const db = result.db(dbName);
  const collection = db.collection("usersData");
  const updateValue = await collection.updateOne(
    { _id: person._id },
    { $set: { denied: flag } }
  );
}

async function userCallAgain(flag) {
  const result = await client.connect();
  const db = result.db(dbName);
  const collection = db.collection("usersData");
  const updateValue = await collection.updateOne(
    { _id: person._id },
    { $set: { callDiscuss: flag } }
  );
}

async function setDtmfUser(dtmfStr) {
  const result = await client.connect();
  const db = result.db(dbName);
  const collection = db.collection("usersData");
  const updateValue = await collection.updateOne(
    { _id: person._id },
    { $set: { setDtmf: dtmfStr } }
  );
}

app.post("/cdr", async (req, res) => {
  var cdr = req.body;
  res.send("call in going on");
  console.log(cdr, "cdr");
});

// app.post("/answerecdr", async (req, res) => {
//   var cdr = req.body;
//   let phone = req.body.from.trim();
//   const db = client.db(dbName);
//   const collection = db.collection("usersData");
//   let person1 = await collection.findOne({
//     $or: [{ phone: +phone }, { phone: phone + "" }],
//   });
 
//   if (person1)
//     res.send([
//       {
//         action: "play",
//         file_name:
//           "1689677048969nbfcandbankintrofordefaulterswav0667cdc0-2558-11ee-a155-59e5d3b0d16d_piopiy.wav",
//         },
//       {
//         action: "param",
//         text: `{ "type": "usersData" }`,
//       },
//       {
//         action: "play_get_input",
//         file_name:
//           "1689677035869nameofbankandnbfcwavfe9b30f0-2557-11ee-a155-59e5d3b0d16d_piopiy.wav",
//         max_digit: 1,
//         max_retry: 2,
//         action_url: "http://ec2-98-84-141-244.compute-1.amazonaws.com:3005/dtmf",
//       },
//     ]);
//   else {
//     res.send([
//       {
//         action: "param",
//         text: `{ "type": "salesData" }`,
//       },
//       {
//         action: "play_get_input",
//         file_name:
//           "1690876772203Salescallwav592d90f0-3041-11ee-9d37-33aa719412c2_piopiy.wav",
//         max_digit: 1,
//         max_retry: 2,
//         action_url: "http://ec2-98-84-141-244.compute-1.amazonaws.com:3005/dtmf",
//       },
//     ]);
//   }
//   console.log(cdr, "cdr");
// });

app.post("/answerecdr", async (req, res) => {
  var cdr = req.body;
  console.log(cdr, "answer cdr");
  let phone = req.body.from;
  if (typeof req.body.from === 'string') {
    phone = req.body.from.trim();
}
  const db = client.db(dbName);
  const collection = db.collection("usersData");
  const result2 = await client.connect();
  const db2 = result2.db(dbName);
  const collection2 = db2.collection("CallingData2");
  let person1 = await collection.findOne({
    $or: [{ phone: +phone }, { phone: phone + "" }],
  });
  let person2 = {};
  if (cdr.to == " 918031406694") {
    let persons = await collection2
      .find({
        $or: [
          { phone: +phone },
          { phone: phone + "" }
        ],})
      .sort({ callTime: -1 })
      .limit(1)
      .toArray();
    if (persons) {
      person2 = persons[0];
    }
  }

  if (req.body.to == 918031406693 || req.body.to == 918031406692) {
    res.send([
      {
        action: "param",
        text: `{ "type": "usersData" }`,
        
      },
      {
        action: "play",
        file_name:
          "1689677048969nbfcandbankintrofordefaulterswav0667cdc0-2558-11ee-a155-59e5d3b0d16d_piopiy.wav",
      },

      {
        action: "play_get_input",
        file_name:
          "1689677035869nameofbankandnbfcwavfe9b30f0-2557-11ee-a155-59e5d3b0d16d_piopiy.wav",
        max_digit: 1,
        max_retry: 2,
        action_url: "http://ec2-98-84-141-244.compute-1.amazonaws.com:3005/dtmf",
      },
    ]);
  } else if (req.body.to == 918031406694) {
    res.send([
      {
        action: "param",
        text: "{type=CallingData2}",
      },
      {
        action: "record",
        //"_id":person2._id   file_name:"1689677048969nbfcandbankintrofordefaulterswav0667cdc0-2558-11ee-a155-59e5d3b0d16d_piopiy.wav",
      },
      {
        action: "bridge",
        duration: 300,
        timeout: 20,
        from: 918031406694,
        loop: 2,
        connect: [
          {
            type: "pstn",
            number: +person2.uPhone,
          },
        ],
      },
    ]);
  } else {
    res.send([
      {
        action: "param",
        text: `{ "type": "salesData" }`,
      },
      {
        action: "play_get_input",
        file_name:
          "1690876772203Salescallwav592d90f0-3041-11ee-9d37-33aa719412c2_piopiy.wav",
        max_digit: 1,
        max_retry: 2,
        action_url: "http://ec2-98-84-141-244.compute-1.amazonaws.com:3005/dtmf",
      },
    ]);
  }
});

app.post("/dtmf", async (req, res) => {
  var dtmf = req.body;
  console.log(dtmf, "dtmf");
  let type = JSON.parse(req.body.extra_params);
  if (type.type == "salesData") {
    const result = await client.connect();
    const db = result.db(dbName);
    const collection = db.collection("salesData");
    const updateValue = await collection.updateOne(
      { $or: [{ phone: +dtmf.to }, { phone: dtmf.to + "" }] },
      { $set: { dtmf: dtmf.dtmf } }
    );
    console.log(updateValue);
  } else {
    if (person?.setDtmf == "dtmf1") {
      res.send(getdtmf(dtmf.dtmf));
    } else if (person.setDtmf == "dtmf2") {
      res.send(getdtmf2(dtmf.dtmf));
    } else if (person.setDtmf == "dtmf3") {
      res.send(getdtmf3(dtmf.dtmf));
    }
  }
});

app.post("/webhookwhatsapp", async(req, res)=>{//pratyush
  const messageEvent = req.body;
  console.log("Received WhatsApp Message Event:", messageEvent);
  let result = await client1.connect();
  let db = result.db(dbName);
  let db2= result.db(dbName2);
  const collection1=db.collection("WhatsappDetails");
  // const collection2=db.collection("NBFCDatas2");
  const collection3=db.collection("WhatsappReply");
  // const collection4=db2.collection("AllWhatsappInfo");
  const collection5=db2.collection("disputeUploads");

  let phone = messageEvent.payload.destination;
  const phoneNumber = phone;
  let sanitizedPhoneNumber;
  if (messageEvent.payload.destination) {
    sanitizedPhoneNumber = phoneNumber.substring(2);
  }

  // const updateValue1 = await collection2.updateOne(
  //   {
  //     $or: [
  //       { borrowerPhone: +sanitizedPhoneNumber },
  //       { borrowerPhone: sanitizedPhoneNumber + "" },
  //     ],
  //   },
  //   {
  //     $set: {
  //       whatsAppStatus: messageEvent.payload.type,
  //     },
  //   }
  // );

  // const docToUpdate = await collection2
  //   .find({
  //     $or: [
  //       { borrowerPhone: +sanitizedPhoneNumber },
  //       { borrowerPhone: sanitizedPhoneNumber + "" },
  //     ],
  //   })
  //   .sort({ timeStamp: -1 })
  //   .limit(1)
  //   .next(); // Retrieve the document

    const docToUpdate2 = await collection5
    .find({
      $or: [
        { borrowerPhone: +sanitizedPhoneNumber },
        { borrowerPhone: sanitizedPhoneNumber + "" },
      ],
    })
    .sort({ timeStamp: -1 })
    .limit(1)
    .next();


//   if (docToUpdate) {
//     await collection2.updateOne(
//       { _id: docToUpdate._id }, // Filter by the document's _id
//       {
//         $set: {
//           whatsAppStatus: messageEvent.payload.type,
//         },
//       }
//     );
  
  // console.log(updateValue1);
  
  
  const AddValue = await collection1.insertOne({
    ...messageEvent.payload,
    prevWhatsappInfo: {
      Phone: messageEvent.payload.destination,
      Status: messageEvent.payload.type,
      Date: convertTimestampToDate(Date()),
    },
  });

  if (messageEvent.type === "message") {
    let phone = messageEvent.payload.source;
    const phoneNumber = phone;
    const extractNumber = phoneNumber.substring(2);
    const getDetails = await collection5.findOne({
      borrowerPhone: extractNumber,
    });
    // Create a new Date object with the timestamp
    const date = new Date(messageEvent.timestamp);
    // Format the date as a string
    const formattedDate = date.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }); 
    const AddReply = await collection3.insertOne({
      Phone: messageEvent.payload.source,
      Reply:
        messageEvent.payload.type === "image" ||
        messageEvent.payload.type === "file" ||
        messageEvent.payload.type === "audio" ||
        messageEvent.payload.type === "video"
          ? messageEvent.payload.payload.url
          : messageEvent.payload.payload.text,
      time: formattedDate,
      email: getDetails?.email,
      loanId: getDetails?.loanId,
      Name: getDetails?.borrowerName,
      Email: getDetails?.borrowerEmail,
      Address: getDetails?.borrowerAddress,
      Amount: getDetails?.claimAmount,
    });
  }
  res.status(200).send("Thank you for reaching out! Our team will get back to you soon.");

  if(docToUpdate2){
    await collection5.updateOne(
      { _id: docToUpdate2._id }, // Filter by the document's _id
      {
        $set: {
          whatsAppStatus: messageEvent.payload.type,
        },
      }
    );

    // const checkExist = await collection4.findOne({docTimeStamp:docToUpdate2?.timeStamp,destination:messageEvent?.payload?.destination,Status:messageEvent?.payload?.type});
    // if(!checkExist){
    //   await collection4.insertOne({
    //     docTimeStamp:docToUpdate2?.timeStamp,
    //     Status:messageEvent?.payload?.type,
    //     destination:messageEvent?.payload?.destination,
    //     timeStamp:messageEvent?.timestamp
    //   });
    // }
  }
});

app.post("/emailwebhook", async(req, res)=>{
  try {
    const response = req.body;
    let result = await client1.connect();
    let db = result.db(dbName);
    let db2= result.db(dbName2);
    //Database Connection
    // const collectionNBFC= db.collection("NBFCDatas2");
    const collection1=db.collection("DetailEmailInformation");
    // const EmailCollection=db.collection("EmailData");
    // const collection4=db2.collection("AllEmailInfo");
    const collectionDispute=db2.collection("disputeUploads");
    //Email taken from webhook
    let email = response.email;
    // Map response.event to status
    let status;
    if (
      ["opened", "unique_opened", "unsubscribed"].includes(
        response.event
      )
    ) {
      status = "Read";
    } else if (response.event === "delivered"|| response.event==="request") {
      status = "Delivered";
    } else {
      status = "Undelivered";
    }
    const AddValue = await collection1.insertOne({
      prevBrevoInfo: {
        Email: response.email,
        Status: response.event,
        Subject: response.subject,
        DateTime: response.date,
        templateID: response.template_id
      }
    });
    // const addingToEmail=await EmailCollection.updateOne(
    //   { email: email },
    //   {
    //     $set: {
    //      Status:response.event
    //     }
    // });
    //Data Finding in NBFCDatas2 to store status
    // const docToUpdate = await collectionNBFC.find({ borrowerEmail: email })
    //   .sort({ timeStamp: -1 })
    //   .limit(1)
    //   .next();
    //Data Finding in disputeUploads to store status
    const docToUpdate1 = await collectionDispute.find({ borrowerEmail: email })
      .sort({ timeStamp: -1 })
      .limit(1)
      .next();
   //If Data finds we store status inside it
    // if(docToUpdate){
    // const updateValue = await collectionNBFC.updateOne(
    //   { _id: docToUpdate._id  },//1234
    //   {
    //     $set: {
    //       prevBrevoInfo: {
    //         Status: status,
    //         Subject: response.subject,
    //         DateTime: response.date,
    //         templateID: response.template_id
    //       }
    //     }
    //   }
    // );
    // }
    //If Data finds we store status inside it
    if(docToUpdate1){
      const updateValue1 = await collectionDispute.updateOne(
        { _id: docToUpdate1._id  },//1234
        {
          $set: {
            prevBrevoInfo: {
              Status: status,
              Subject: response.subject,
              DateTime: response.date,
              templateID: response.template_id
            }
          }
        }
      );
      //Store inside AllEmailInfo collection
      // await collection4.insertOne({
      //   docTimeStamp:docToUpdate1.timeStamp,
      //   prevBrevoInfo: {
      //     Status: status,
      //     Subject: response.subject,
      //     DateTime: response.date,
      //     templateID: response.template_id
      //   }
      // })
      }
  } catch (error) {
    console.error("Error handling webhook:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/NewWebhookEmail", async(req, res)=>{
  try {
    const response = req.body;
    const collection = await SaveInCollection("EmailInformation","usersDetails");
    //Email taken from webhook
    let email = response.email;
    // Map response.event to status
    let status;
    if (
      ["opened", "unique_opened", "unsubscribed",].includes(
        response.event
      )
    ) {
      status = "Read";
    } else if (response.event === "delivered" || response.event ==  "request") {
      status = "Delivered";
    } else {
      status = "Undelivered";
    }

    const AddValue = await collection.insertOne({
      prevBrevoInfo: {
        Email: response.email,
        Status: response.event,
        Subject: response.subject,
        DateTime: response.date,
        templateID: response.template_id
      }
    });
      //
  } catch (error) {
    console.error("Error handling webhook:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// const port = process.env.PORT | 5000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
module.exports.handler = serverless(app);