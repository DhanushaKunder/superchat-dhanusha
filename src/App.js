import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAfI20DY5GO-hP2XBIiHtv6yM1dqq0HAfU",
    authDomain: "superchat-dhanusha.firebaseapp.com",
    projectId: "superchat-dhanusha",
    storageBucket: "superchat-dhanusha.appspot.com",
    messagingSenderId: "642523542685",
    appId: "1:642523542685:web:e7753c3d7e0473dbd85074"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
      <h1>💬</h1>
        <SignOut />
        
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <h1> Welcome to Superchat App!!</h1>
    </>
  )

}
function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type a message" />

      <button type="submit" disabled={!formValue}>Send</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'data:image/jpeg;base64,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'}  alt="loading"/>
      <p>{text}</p>
    </div>
  </>)
}


export default App;
