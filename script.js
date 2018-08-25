
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
        alert("Fuck, an error occured: " + error.messsage);
    });
}

function resetPassword () {
    
var auth = firebase.auth();
var emailAddress = auth.currentUser.email;

auth.sendPasswordResetEmail(emailAddress).then(function() {
  // Email sent.
    document.getElementById("passwordHelpBlock").style.display = "block";
}).catch(function(error) {
  // An error happened.
    alert("Fuck, an error occured: " + error.messsage);
});
}

function logOut () {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
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
    
window.onload = function() {
if(window.location.pathname == '/index.html') {
    var whenInput = document.getElementById('when');
    var whereInput = document.getElementById('autocomplete');
    var submitButton = document.getElementById('postButton');  
    var postsLists = document.getElementById('postsLists');
    
    submitButton.addEventListener('click', handleSubmit);

    const postRef = firebase.firestore().collection("posts").orderBy("createdAt", 'desc').limit(5);

    
    postRef.onSnapshot(function(docSnapShot) {
    postsLists.innerHTML = "";
    docSnapShot.forEach(function(doc) {
    post = doc.data();
    post.id = doc.id;
        
    var request = {
      placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      fields: ['name', 'rating', 'formatted_phone_number', 'geometry']
    };
    
    
    var postElement = document.createElement("p");
    var placesDetails = document.createElement("p");
    placesDetails.setAttribute("id", "placesDetailsElement");
        
    postElement.innerHTML = timeConverter(post.when) + " at " + post.where;
    
    postElement.appendChild(placesDetails);
    postsLists.appendChild(postElement);
        
    //MAPPING
    var map;
    var service;
    var infowindow;
    initMap();
    function initMap() {
      var request = {
        query: 'Wild Goose Meeting House',
        fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry'],
      };

      service = new google.maps.places.PlacesService($('#placesDetailsElement').get(0));
      service.findPlaceFromQuery(request, callback);
    }

    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          console.log(place);
        }
      }
    }
        
    $( "#loading" ).hide();
  })
})

    
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
/* stupid loading function
function checkLoad () {
// jQuery methods go here...
    var $amountPosts = $("#postsLists > div").length;
    
    if ($amountPosts > 1)
        {
            $( "#loading" ).hide();
            $( "#postsLists" ).show( "fast" );
        }
    else 
        {
            $( "#loading" ).show( "fast" );
            $( "#postsLists" ).hide();
        }
}
*/
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
    
    /*if (a.year == today.year) {
        var dateDiff = today.getTime() - a.getTime();
        var resultInMinutes = Math.round(dateDiff / 60000);
        var resultInHours = Math.round(dateDiff / 3600000);
        if (resultInHours > 24)
            {
                time =  month + ' ' + date;
            }
        else if (resultInHours > 1)
            {
                time = resultInHours + " hrs";
            }
        else if (resultInMinutes > 59)
            {
                time = resultInHours + " hr";
            }
        else if (resultInMinutes > 0)
            {
                time = resultInMinutes + "m";
            }
        else
            {
                time = "just now";
            }
    }
    else 
    {
        time =  month + ' ' + date + ' ' + year;
    }*/

  return time;
}

