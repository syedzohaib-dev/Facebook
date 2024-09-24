import { auth, createUserWithEmailAndPassword, doc, setDoc, db } from '../utils/firebase.js'

const name = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");
const url = document.querySelector("#url");

const button = document.querySelector("#signupBtn");

button.addEventListener("click", async (e) => {
    e.preventDefault()
    console.log("chal raha hun main");
    if (
        !name.value ||
        !email.value ||
        !password.value ||
        !confirmPassword.value ||
        !url.value
    ) {
        return alert("saari fields chahiye hain apney ko");
    }

    if (password.value != confirmPassword.value)
        return alert("Password is not matching confirm password");

    try {
        //authentication implementationF
        const response = await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );
        console.log(response, "===>> response");

        const {
            user: { uid },
        } = response;

        // return;

        //data store in database

        try {
            const docRef = setDoc(doc(db, "users", uid), {
                name: name.value,
                email: email.value,
                url: url.value
            });
            console.log("Document written with ID: ", docRef.id);
            alert("Registered Successfully");
            setTimeout(() => {
                window.location.href = "../login/login.html";
            }, 2000);
        } catch (e) {
            console.error("Error adding document in firestore database: ", e);
        }
    } catch (error) {
        console.log(error.message, "===>> authentication ka catch");
        alert(error.message);
    }
});


