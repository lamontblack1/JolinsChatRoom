// Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAItQs2KtkI5j3pM3FN8yxN_ZnFLyifruI",
    authDomain: "service-storage-acc7a.firebaseapp.com",
    databaseURL: "https://service-storage-acc7a-default-rtdb.firebaseio.com",
    projectId: "service-storage-acc7a",
    storageBucket: "service-storage-acc7a.appspot.com",
    messagingSenderId: "10223659033",
    appId: "1:10223659033:web:6b998588ce24ad03796288"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Create a variable to reference the database
  let db = firebase.database()
  //add a notification that the player connected
  
  //connections to store player info and messages and notifications
  // let playerInfoRef = db.ref("/players")
  let messageListRef = db.ref("/Jolin/messages")
  
  //set up connection monitor and read connections
  let connectionsListRef = db.ref("Jolin/connections");
    // '.info/connected' is a special location provided by Firebase that is updated every time
    // the client's connection state changes.
    // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
    let connectedPlayers= db.ref(".info/connected");
  //create variables to store user names, choices, user wins and losses
  

  var audioElement = document.createElement("audio");

  // Set it's source to the location
  audioElement.setAttribute("src", "ding-sound-effect_2.mp3");


  $("#btnSend").on("click", function() {
    if (($("#messageInput").val() !== "") && ($("#nameInput").val() !== "")) {
      let messageToSend = $("#messageInput").val()
      pushMessage($("#nameInput").val(), messageToSend)
      $("#messageInput").val("")
    }
    else {
        alert("Type your name in the top box to be able to send a message!")
    }
  });

// When the client's connection state changes keep track of connections
connectedPlayers.on("value", function(snap) {
  // If they are connected..
  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsListRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
    //add a notification that the player disconnected
  }
});

connectionsListRef.on("value", function(snap) {
  //update the number of connections
//   intConnections = snap.numChildren()
//   console.log("connections: " + intConnections)
  //If this instance is first connection, it is player1, if second connection, player2. otherwise too many people
  
    
});


function pushMessage(player, messageToPost) {
  messageListRef.push({
    playerName: player,
    message: messageToPost,
    messageTime: firebase.database.ServerValue.TIMESTAMP
  });
}

messageListRef.on("child_added", function(snapshot) {
  // console.log(snapshot.val());
  // console.log(snapshot.val().playerName);
  // console.log(snapshot.val().message);
  let dateVal = snapshot.val().messageTime
  let msgTimeStamp = moment(dateVal).format("MMM D hh:mm:ss")
  // console.log(msgTimeStamp);
  let msgPlayerName = snapshot.val().playerName
  let msgMessage = snapshot.val().message;

  if (msgPlayerName === ($("#nameInput").val())) {
    $("#messagesBox").prepend(
        "<div class='row mb-2'><div class='col-6'></div><div class='col-6'>" + 
        "<div class='card' style='background-color: #f5dadf;'><div class='card-header'>" + msgPlayerName + "  .  .  .  .  .  .  .  .  " + msgTimeStamp + "</div>" +
        "<div class='card-body'><h5 class='card-title'>" + msgMessage +"</h5>" +
        "</div></div>" +
        "</div>" +
        "</div>"
    )
  }
  else {
      audioElement.play();
    
      $("#messagesBox").prepend(
          "<div class='row mb-2'><div class='col-6' style='float: left;'>" + 
          "<div class='card' style='background-color: #FFE5D9;'><div class='card-header'>" + msgPlayerName + "  .  .  .  .  .  .  .  .  " + msgTimeStamp + "</div>" +
          "<div class='card-body'><h5 class='card-title'>" + msgMessage +"</h5>" +
          "</div></div>" +
          "</div>" +
          "</div>"
      )

  }
  
  

  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});