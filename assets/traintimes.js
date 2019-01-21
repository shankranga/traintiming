//Initialize Firebase
var config = {
  apiKey: "AIzaSyAyWIgFrtzIFBkg9NsaeCjRAkMX7mdrglI",
  authDomain: "train-times-2-c4252.firebaseapp.com",
  databaseURL: "https://train-times-2-c4252.firebaseio.com",
  projectId: "train-times-2-c4252",
  storageBucket: "train-times-2-c4252.appspot.com",
  messagingSenderId: "585000146792"
};
firebase.initializeApp(config);

var database = firebase.database();

//Submit Train Button

$("#submit").on("click", function(event) {
  event.preventDefault();

  //User Input
  var train = $("#train-name")
    .val()
    .trim();
  var destination = $("#destination")
    .val()
    .trim();
  var firstTime = $("#first-time")
    .val()
    .trim();
  var frequency = $("#frequency")
    .val()
    .trim();

  //local train data

  var newTrain = {
    train: train,
    dest: destination,
    first: firstTime,
    freq: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };

  database.ref().push(newTrain);

  //Console logs
  console.log(newTrain.train);
  console.log(newTrain.destination);
  console.log(newTrain.firstTime);
  console.log(newTrain.frequency);

  //Alert
  alert("Train Information Added");

  //text box clear

  $("#train-name").val("");
  $("#destination").val("");
  $("#first-time").val("");
  $("#frequency").val("");
});
//Add to database and add new row
database.ref().on(
  "child_added",
  function(snapshot) {
    var sv = snapshot.val();
    var trackF = sv.freq;
    var trainTime = sv.first;

    var convertFirstTime = moment(trainTime, "hh:mm").subtract(1, "years");

    var timeNow = moment();

    var difference = moment().diff(moment(convertFirstTime), "minutes");

    var leftOver = difference % trackF;

    var timeTilNext = trackF - leftOver;

    var nextTrain = moment()
      .add(timeTilNext, "minutes")
      .format("HH:mm");

    //console logs

    var arr = [sv.train, sv.dest, sv.freq, nextTrain, timeTilNext];
    $("#train-name").text(sv.train);
    $("destination").text(sv.dest);
    $("#frequency").text(sv.freq);
    $("#train-coming").text(nextTrain);
    $("#tilnext-train").text(timeTilNext);

    var tableRow = $("<tr>");

    for (var i = 0; i < arr.length; i++) {
      var tableData = $("<td>");
      tableData.text(arr[i]);
      tableRow.append(tableData);
    }

    $("tbody").append(tableRow);
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);
