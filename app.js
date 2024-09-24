import { doc, getAuth, onAuthStateChanged, signOut, getDoc, db, setDoc, addDoc, collection, getMultipleDataFromFirebase } from './utils/firebase.js'
let userDetail;
const auth = getAuth();

let logoutBtn = document.getElementById('logoutBtn')

let logOut = () => {
    signOut(auth).then(() => {
        alert("Logout Successfull")
    }).catch((error) => {
        // An error happened.
        console.log(error)
    });
}
logoutBtn.addEventListener('click', logOut)

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


        let userImgIcon = document.getElementById('userImgIcon')
        userImgIcon.src = url
        document.getElementById('navusername').innerHTML = name

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }

        fetchPostFromFirebase()

        // ... 
    } else {
        // User is signed out
        // ...
        alert('User Not Exist')
        window.location.href = './signup/signup.html'
    }
});
let inputBtn = document.getElementById('inputBtn')
// let mainContainerPost = document.getElementById('mainContainerPost')

inputBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    let inputText = document.getElementById('inputText').value
    let inputUrl = document.getElementById('inputUrl').value
    console.log(inputText, inputUrl, userDetail.uid)
    let current = new Date()
    let localDate = current.toLocaleString()
    console.log(localDate)


    try {
        await addDoc(collection(db, "users", userDetail.uid, 'posts'), {
            inputText: inputText,
            inputUrl: inputUrl,
            localDate: localDate,
            createdBy: userDetail.uid,
            // console.log(inputText, inputUrl, localDate)
        }, { merge: true });
    } catch (error) {
        console.log(error)
    }
})
// console.log(userDetail)

const fetchPostFromFirebase = async () => {
    console.log("FETCHING POST FROM FIREBASE")
    try {
        const getPostFromFirebase = await getMultipleDataFromFirebase(`users/${userDetail.uid}/posts`)
        console.log(getPostFromFirebase)    
    } catch (error) {
        console.log(error)
    }

}


