// const auth = firebase.auth();

// auth.signInWithEmailAndPassword(email, pass);

// auth.creatUserWithEmailAndPassword(email, pass);

// auth.onAuthStateChanged(firebaseUser => {});

(function(){

// Initialize Firebase
const config = {
    apiKey: "AIzaSyB0-qMVAZlma3NqGdeNa52flabRwVIKyuk",
    authDomain: "clemapper.firebaseapp.com",
    databaseURL: "https://clemapper.firebaseio.com",
    storageBucket: "clemapper.appspot.com",
};  

firebase.initializeApp(config);

// Get elements
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const butnSignUp = document.getElementById('btnSignUp');

// Add login event
btnLogin.addEventListener('click', e=> {
	// Get email and pw
	const email = txtEmail.value;
	const pass = txtPassword.value;
	const auth = firebase.auth();
	// Sign in
	const promise = auth.signInWithEmailAndPassword(email, pass)
	promise.catch(e => console.log(e.message));

});


}());

