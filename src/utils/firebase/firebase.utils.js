import {initializeApp} from "firebase/app";
import {getAuth, signInWithRedirect, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth';
import {getFirestore, doc, getDoc, setDoc, collection, writeBatch, query, getDocs} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyATNsvtD4Wvt80lEJw_ZAenpw5rIygozwg",
    authDomain: "crwn-clothing-db-c7d7d.firebaseapp.com",
    projectId: "crwn-clothing-db-c7d7d",
    storageBucket: "crwn-clothing-db-c7d7d.appspot.com",
    messagingSenderId: "462166206021",
    appId: "1:462166206021:web:a9c1654b901296bab7e52c"
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);

  const googleProvider = new GoogleAuthProvider();

  //specific to google authenticator
  googleProvider.setCustomParameters({
    prompt: 'select_account',
  });

  //lets authentication service available from firestore
  export const auth = getAuth();

  //allows sign-in w/ google popup & redirect
  export const signInWithGooglePopUp = () => signInWithPopup(auth, googleProvider);
  export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

  //stores all the data into "db"
  export const db = getFirestore();

  export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionRef = collection(db, collectionKey);
    const batch = writeBatch(db);

    objectsToAdd.forEach(object => {
        const docRef = doc(collectionRef, object.title.toLowerCase());
        batch.set(docRef, object);
    });

    await batch.commit();
  };

  export const getCategoriesAndDocument = async () => {
    const collectionRef = collection(db, 'categories');
    const q = query(collectionRef);

    const querySnapshot = await getDocs(q);
    const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
        const {title, items} = docSnapshot.data();
        acc[title.toLowerCase()] = items;
        return acc;
    }, {});
    return categoryMap;
  }

  //funciton that takes data & stores inside firestore
  export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {

    if(!userAuth) return;

    //points to the location of doc for the user
    const userDocRef = doc(db, 'users', userAuth.uid);

    //retrieves the doc that we pointed to before
    const userSnapshot = await getDoc(userDocRef);

    if(!userSnapshot.exists()) {
        const {displayName, email} = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, {
                displayName, email, createdAt, ...additionalInformation
            });
        } catch(error) {
            console.log('error creating the user', error.message);
        }
    }
    return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;
    return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;
    return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => {
    onAuthStateChanged(auth, callback);
}