// warning this script is entirely janky
// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

var provider = new firebase.auth.GoogleAuthProvider();

const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

function createUser() {
    firebase.auth().createUserWithEmailAndPassword(document.getElementById('inputEmail').value, document.getElementById('inputPassword').value).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    console.log (errorCode);
     //do error stuff
    });

    sendEmailVerification();

}


function sendEmailVerification () {
    var user = firebase.auth().currentUser;

    user.sendEmailVerification().then(function() {
      // Email sent.
        document.getElementById("buttonResendBlock").style.display = "block";
    }).catch(function(error) {
      // An error happened.
        alert(error.messsage);
    });
}

function deleteUser () {
    var user = firebase.auth().currentUser;

    user.delete().then(function() {
      // User deleted.
    }).catch(function(error) {
      // An error happened.
        alert("Error: " + error.messsage);
    });
}

function resetPassword () {

var auth = firebase.auth();
var emailAddress = auth.currentUser.email;

auth.sendPasswordResetEmail(emailAddress).then(function() {
  // Email sent.
    document.getElementById("passwordLoginHelpBlock").style.display = "block";
}).catch(function(error) {
  // An error happened.
    alert("Error: " + error.messsage);
});
}

function logOut () {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
        window.location = '/';
    }).catch(function(error) {
      // An error happened.
      alert("Error: " + error.messsage);
    });
}

function updateProfile () {
    var user = firebase.auth().currentUser;
        user.updateProfile({
      displayName: document.getElementById('inputDisplayName').value
    }).then(function() {
      // Update successful.
        $('buttonUpdateProfile').prop('disabled', true);
    }).catch(function(error) {
      // An error happened.
    });
}

function logInGoogle () {
    // Create an instance of the Google provider object
    var provider = new firebase.auth.GoogleAuthProvider();

    // To apply the default browser preference instead of explicitly setting it.
    firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
     window.location.reload(true);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
        alert("Error: " + errorCode + " - " + errorMessage)
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });

}

function logIn () {
  firebase.auth().signInWithEmailAndPassword(document.getElementById("inputEmail").value, document.getElementById("inputPassword").value)
    .catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode === 'auth/wrong-password') {
    alert('Wrong password.');
  } else {
    alert(errorMessage);
  }
  console.log(error);
});
  $('#loginModal').modal('hide');
}

getLocation();
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude);
}

window.onload = function() {

if(window.location.pathname == '/index.html' || window.location.pathname == '/') {


    var whenInput = document.getElementById('when');
    var whereInput = document.getElementById('autocomplete');
    var submitButton = document.getElementById('postButton');
    var postsLists = document.getElementById('postsLists');

    submitButton.addEventListener('click', handleSubmit);

    const postRef = firebase.firestore().collection("posts").orderBy("createdAt", 'desc').limit(10);

    postRef.onSnapshot(function(docSnapShot) {
    postsLists.innerHTML = "";

    docSnapShot.forEach(function(doc) {
    post = doc.data();
    post.id = doc.id;
    var cardElement = document.createElement("div");
    cardElement.classList.add('card');
    var cardBodyElement = document.createElement("div");
    cardBodyElement.classList.add('card-body');
    $(".card").attr("data-toggle", "modal");
    $(".card").attr("data-target", "#postModal");
    var postElement = document.createElement("p");
    var placesDetails = document.createElement("p");
    placesDetails.setAttribute("id", "placesDetailsElement");
    postElement.innerHTML = timeConverter(post.when) + " at " + post.where;
    postElement.appendChild(placesDetails);
    cardBodyElement.appendChild(postElement);
    cardElement.appendChild(cardBodyElement);
    cardElement.setAttribute("id", post.id);
    cardElement.setAttribute("onclick", "showDetails(this.id)");
    postsLists.appendChild(cardElement);

    // Hide the loading animation
    $( "#loading" ).hide();
  })
})

// Submit entered information to the database

function handleSubmit(e) {
  if (e.type != "click") {
    console.log("it is not a click i guess");
    return;
  }
    const postWhen = chrono.parseDate(whenInput.value);
    const postWhere = whereInput.value;
  submitButton.innerHTML = "Creating...";
  if (post === "") {
    return;
  }
var user = firebase.auth().currentUser;

  db.collection("posts").add({
    author: user.uid,
    when: postWhen,
    where: postWhere,
    createdAt: (new Date()).getTime()
  }).then(function(docRef) {
    submitButton.innerHTML = "Create";
  }).catch(function(error) {
    console.log("ERROR: " + error);
  })
}

}
}


function showDetails (meetupID) {
    //document.getElementById('detailPostElement').style.display = none;
    console.log(meetupID);

    var detailPost = db.collection("posts").doc(meetupID);

    detailPost.get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        document.getElementById('detailHeader').innerHTML = doc.data().where;

    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

}

// Function to display the UNIX timestamp in a human-readable format (Month Day, Year 00:00)

function timeConverter(UNIX_timestamp){
    var a = new Date(0);
    a.setUTCSeconds(UNIX_timestamp.seconds);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = (a.getDate() < 10 ? '0' : '') + a.getDate();
    var hour = a.getHours();
    var min = (a.getMinutes() < 10 ? '0' : '') + a.getMinutes();

    var time =  month + ' ' + date + ', ' + year + '  ' + hour + ':' + min;

  return time;
}
