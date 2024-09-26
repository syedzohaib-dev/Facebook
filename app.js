import { doc, getAuth, onAuthStateChanged, signOut, getDoc, db, setDoc, addDoc, collection, query, where, getDocs, deleteDoc } from './utils/firebase.js'
let userDetail;
let userImg;
let userName;
let postUid;

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
        userImg = url
        userName = name

        let userImgIcon = document.getElementById('userImgIcon')
        userImgIcon.src = url
        let inputKaLogo = document.getElementById('inputKaLogo')
        inputKaLogo.src = url
        document.getElementById('navusername').innerHTML = name

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
        getUserPost(userDetail.uid)



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
    console.log(inputText, inputUrl, userDetail.uid, userImg, userName)
    let current = new Date()
    let localDate = current.toLocaleString()
    console.log(localDate)

    console.log(userImg)

    try {
        await addDoc(collection(db, "users", userDetail.uid, 'posts'), {
            inputText: inputText,
            inputUrl: inputUrl,
            localDate: localDate,
            createdBy: userDetail.uid,
            userImg: userImg,
            userName: userName,

            // console.log(inputText, inputUrl, localDate)
        }, { merge: true });
    } catch (error) {
        console.log(error)
    }
})
// console.log(userDetail)

const getUserPost = async (userDetail) => {
    try {
        const postsRef = collection(db, 'users', userDetail, 'posts');
        const querySnapShot = await getDocs(postsRef)
        querySnapShot.forEach((doc) => {
            console.log(doc.data(), "Post ka data");

            postUid = userDetail
            console.log(postUid)

            // const { postKiImg } = doc.data()
            // console.log(postKiImg)
            document.getElementById('mainContainerPost').innerHTML += `
             <div class="post">
                <div class="topLine">
                    <div class="userorname">
                        <div class="userLogoPost"><img
                                src="${doc.data().userImg}"
                                alt=""></div>
                        <div class="userName">
                            <p class="postCreater">${doc.data().userName}</p>
                            <p class="postTime">${doc.data().localDate}</p>
                        </div>
                    </div>
                    <div class="function">
                        <div class="editPost"><button type="button" class="editPostBtn"><i
                                    class="fa-solid fa-ellipsis"></i></button></div>
                        <div class="deletePost"><button type="button" class="deletePostBtn" id="deleteBtn" onclick="deleteHandler(this, '${postUid}')"><i
                                    class="fa-solid fa-xmark"></i></button> </div>
                    </div>
                </div>
                <div class="postText">
                    <p>${doc.data().inputText}</p>
                </div>
                <div class="postImg">   <img class="img-fluid" src="${doc.data().inputUrl}" alt="">
                          </div>
                <div class="bottomLine">
                    <div class="likePost"><i class="fa-regular fa-thumbs-up" style="font-size: 1.4rem;"></i> Like</div>
                    <div class="commentPost"><i class="fa-regular fa-comment" style="font-size: 1.4rem;"></i> Comment
                    </div>
                    <div class="sharePost"><i class="fa-solid fa-share" style="font-size: 1.4rem;"></i> Share</div>
                </div>
            </div>
            
            `
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
    }

}

async function deleteHandler(elem, postUidReceived) {
    console.log(elem, postUidReceived);
    console.log(elem.parentElement.parentElement.parentElement.parentElement);

    console.log(postUidReceived, "delete chal raha hai");
    return
    await deleteDoc(doc(db, "posts", postUidReceived));
    elem.parentElement.parentElement.parentElement.remove();
    console.log("ura diya");
}

window.deleteHandler = deleteHandler;
