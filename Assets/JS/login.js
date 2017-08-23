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


// Add login event
$(".btnLogin").onclick = function(){

	const txtEmail = document.getElementById('txtEmail');
console.log(txtEmail);

const txtPassword = document.getElementById('txtPassword');
console.log(txtPassword);

const btnLogin = document.getElementById('btnLogin');
console.log(btnLogin);

const btnSignUp = document.getElementById('btnSignUp');
console.log(btnSignUp);

	// Get email and pw
	const email = txtEmail.value;
	const pass = txtPassword.value;
	const auth = firebase.auth();
	// Sign in
	const promise = auth.signInWithEmailAndPassword(email, pass)
	promise.catch(e => console.log(e.message));

}




}());

