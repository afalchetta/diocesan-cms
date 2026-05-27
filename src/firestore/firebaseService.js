import firebase from "../config/firebase";

export function signInWithEmail(creds) {
  return firebase
    .auth()
    .signInWithEmailAndPassword(creds.email, creds.password);
}

export function signOutFirebase() {
  return firebase.auth().signOut();
}
export function sendPasswordReset(email) {
  const normalizedEmail = email.trim().toLowerCase();

  return firebase
    .auth()
    .sendPasswordResetEmail(normalizedEmail, {
      url: "http://localhost:3000/login", // adjust for prod later
    });
}

export function updateUserPassword(creds) {
  const user = firebase.auth().currentUser;
  return user.updatePassword(creds.newPassword1);
}