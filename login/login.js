import { doc, getAuth, signInWithEmailAndPassword } from '../utils/firebase.js'

// let body = document.querySelector('body')
// console.log(spinner)

let login = (e) => {

    e.preventDefault()
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value

    if (!email || !password) {
        alert("All Fields are required")
    }



    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            alert("Login Successfull")
            let spinner = document.querySelector(".spinner")

            spinner.style.display = "inline";

            setTimeout(() => {

                window.location.href = "../index.html"
            }, 1000);
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error)
        });
}

let loginBtn = document.getElementById('loginBtn')

loginBtn.addEventListener('click', login)