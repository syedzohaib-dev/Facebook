import {
    auth,
    onAuthStateChanged,
    doc,
    getDoc,
    db,
    setDoc,
    uploadBytesResumable,
    getDownloadURL,
    collection,
    query,
    where,
    getDocs,
    ref,
    storage,
    addDoc,
} from "../utils/firebase.js";

let userId; //khali variable for future use
let userData;
let userDetail;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // console.log(user)
        const uid = user.uid;
        // console.log(uid)


        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        userDetail = docSnap.data()
        userDetail.uid = uid

        const { email, name, url } = docSnap.data()
        console.log(email, name, url)
        // userImg = url
        // userName = name

        let profileImg = document.getElementById('profileImg')
        profileImg.src = url

        document.getElementById('userNameCard').innerHTML = name
        document.getElementById('userImgCard').src = url
        document.getElementById('userEmailCard').innerHTML = email

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
      



        // ... 
    } else {
        // User is signed out
        // ...
        alert('User Not Exist')
        window.location.href = './signup/signup.html'
    }
});
