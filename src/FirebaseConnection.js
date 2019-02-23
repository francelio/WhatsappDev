import firebase from 'firebase';

 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyDlW3ngu9yrHm9nquMBGvr1981danaX6ns",
    authDomain: "devsapp-b5056.firebaseapp.com",
    databaseURL: "https://devsapp-b5056.firebaseio.com",
    projectId: "devsapp-b5056",
    storageBucket: "devsapp-b5056.appspot.com",
    messagingSenderId: "534431524409"
  };
  firebase.initializeApp(config);

export default firebase;

