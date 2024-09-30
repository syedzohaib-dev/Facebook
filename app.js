import {
    doc, getAuth, onAuthStateChanged, signOut, getDoc, db, setDoc, addDoc, collection, query, where, getDocs, deleteDoc,
    storage, ref, uploadBytesResumable, getDownloadURL
} from './utils/firebase.js'
let userDetail;
let userImg;
let userName;
let postUid;
let postUidReceived;
let postIdToBeEdited;

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
    // let inputUrl = document.getElementById('inputUrl').value
    if (!inputText) {
        return alert("Plz Fill Out This Field")
    }
    console.log(inputText, userDetail.uid, userImg, userName)


    // spetial  --------------------------------------------------------------------

    let uploadFile = document.getElementById('uploadFile')
    if (!uploadFile.files[0]) {
        return alert("Please select a file to upload.");
    }
    console.log(uploadFile.files[0])


    const storageRef = ref(storage, `images/${uploadFile.files[0].name}`);

    const uploadTask = uploadBytesResumable(storageRef, uploadFile.files[0]);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed',
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            // Handle unsuccessful uploads
            console.log(error)
            console.log(error.message)

        },
        async () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            let current = new Date()
            let localDate = current.toLocaleString()
            console.log(localDate)

            console.log(userImg)

            try {
                await addDoc(collection(db, "users", userDetail.uid, 'posts'), {
                    inputText: inputText,
                    inputUrl: downloadURL,
                    localDate: localDate,
                    createdBy: userDetail.uid,
                    userImg: userImg,
                    userName: userName,

                    // console.log(inputText, inputUrl, localDate)
                }, { merge: true });
            } catch (error) {
                console.log(error)
            }

        }
    );

    // spetial --------------------------------------------------------------------
}
)
// console.log(userDetail)











const getUserPost = async (userDetail) => {
    try {
        const postsRef = collection(db, 'users', userDetail, 'posts');
        const querySnapShot = await getDocs(postsRef)
        querySnapShot.forEach((doc) => {
            // console.log(doc.data(), doc.id, "Post ka data");

            postUid = doc.id
            postUidReceived = doc.id

            // postUid = userDetail
            // console.log(postUid)

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
                        <div class="editPost"><button type="button" class="editPostBtn"
                         onclick="editHandler(this, '${postUid}')"><i
                                    class="fa-solid fa-ellipsis"></i></button></div>
                        <div class="deletePost">
                        <button type="button" class="deletePostBtn" id="deleteBtn"
                         onclick="deleteHandler(this, '${postUid}')"><i
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
    // return
    try {
        await deleteDoc(doc(db, "users", userDetail.uid, "posts", postUidReceived));
        elem.parentElement.parentElement.parentElement.parentElement.remove();
        console.log("ura diya");
    } catch (error) {
        console.log(error)
        console.log(error.message)
    }

}

window.deleteHandler = deleteHandler;

// Edit ka Function

function editHandler(elem, postUidReceived) {
    console.log(
        elem.parentElement.parentElement//[0].innerHTML,
        ,
        "edit chal raha hai"
    );
    document.querySelector("#updatePostBtn").style.display = "block";
    document.querySelector("#inputBtn").style.display = "none";
    document.querySelector("#inputText").value =
        elem.parentElement.parentElement.nextElementSibling.children[0].innerHTML;
    // postFetchFunction()
    postIdToBeEdited = postUidReceived;
    console.log(postIdToBeEdited)
}

document.querySelector("#updatePostBtn").addEventListener("click", (e) => {
    e.preventDefault()
    console.log("main chal raha hun");
    const inputText = document.querySelector("#inputText").value;
    const uploadFile = document.querySelector("#uploadFile");

    const file = uploadFile.files[0];

    // file upload karney laga hun

    const date = new Date();

    // Create a storage reference from our storage service
    const storageRef = ref(storage, `images/${uploadFile.files[0]}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    let downloadImageUrl;

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
        "state_changed",
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
                case "paused":
                    console.log("Upload is paused");
                    break;
                case "running":
                    console.log("Upload is running");
                    break;
            }
        },
        (error) => {
            // Handle unsuccessful uploads
            console.log(error)
        },
        () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                console.log("File available at", downloadURL);
                downloadImageUrl = downloadURL;

                try {
                    // Add a new document with a generated id.

                    await addDoc(collection(db, "users", userDetail.uid, 'posts', postIdToBeEdited), {
                        inputText: inputText,
                        inputUrl: downloadURL,
                        localDate: localDate,
                        createdBy: userDetail.uid,
                        userImg: userImg,
                        userName: userName,
                    });
                    // 

                    // const docRef = await setDoc(doc(db, "posts", postIdToBeEdited), {
                    //   textData: textData.value,
                    //   imgData: downloadImageUrl,
                    //   authorDetails: {
                    //     name: userDetails.firstName + " " + userDetails.lastName,
                    //     img: userDetails.imgUrl || "",
                    //     uid: userDetails.uid,
                    //   },
                    // });
                    // postFetchFunction();
                } catch (error) {
                    console.log(error, "==>> error bata raha hun");
                }
            });
        }
    );

    // 'file' comes from the Blob or File API
    // try {
    //   const fileUploader = await uploadBytes(storageRef, file);
    //   console.log(fileUploader, "==>> fileUploader");
    // } catch (error) {
    //   console.log(error, "==>> error");
    // }
});

window.editHandler = editHandler;
