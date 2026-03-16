import firebase from "../config/firebase";
import { serverTimestamp } from "firebase/firestore";
// use compat syntax only


const db = firebase.firestore();

export function getCorrsFromFirestore(observer) {
  return db.collection("corrs").onSnapshot(observer);
}

export function dataFromSnapshot(snapshot) {
  if (!snapshot.exists) return undefined;
  const data = snapshot.data();

  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (data[prop] instanceof firebase.firestore.Timestamp)
        data[prop] = data[prop].toDate();
    }
  }

  return {
    ...data,
    id: snapshot.id,
  };
}

export function listenToCorrsFromFirestore() {
  return db.collection("corrs").orderBy("dueDate");
}

export function listenToCorrFromFirestore(corrId) {
  return db.collection("corrs").doc(corrId);
}

export function addCorrToFirestore(corr) {
  return db.collection("corrs").add({
    ...corr,
    createdAt: serverTimestamp(),
  });
}

export function updateCorrInFirestore(corr) {
  return db.collection("corrs").doc(corr.id).update(corr);
}

export function deleteCorrFromFirestore(corrId) {
  return db.collection("corrs").doc(corrId).delete();
}

// Toggle ticketStatus between "open" and "closed"
export function toggleTicketStatus(corr) {
  const newStatus = corr.ticketStatus === "open" ? "closed" : "open";
  return db.collection("corrs").doc(corr.id).update({
    ticketStatus: newStatus,
  });
}


//FILES
export function getCorrFiles(id) {
  return db.collection("files").where("locationID", "==", id);
}
export function downloadFile(fileName) {
  const storageRef = firebase.storage().ref();
  return storageRef
    .child(`${fileName}`)
    .getDownloadURL()
    .then(function (url) {
      let link = document.createElement("a");
      if (link.download !== undefined) {
        link.setAttribute("href", url);
        link.setAttribute("target", "_blank");
        link.setAttribute("download", "download");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
}
export async function deleteFile(fileId, filename) {
  await firebase.storage().ref(filename).delete();
  return db.collection("files").doc(fileId).delete();
}

export function uploadReminderFiles(files) {
  return db.collection("files").add({
    ...files,
    uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}
export async function uploadFileToStorage(file, fileInfo, hashedFileName) {
  await db.collection("files").add(fileInfo);
  const storageRef = firebase.storage().ref(hashedFileName);
  return storageRef.put(file);
}

//PROFILE
export function setUserProfileData(user) {
  return db.collection("users").doc(user.uid).set({
    displayName: user.displayName,
    email: user.email,
  });
}

export function getUserProfile(userId) {
  return db.collection("users").doc(userId);
}

export async function updateUserProfile(profile) {
  const user = firebase.auth().currentUser;
  try {
    if (user.displayName !== profile.displayName) {
      await user.updateProfile({
        displayName: profile.displayName,
      });
    }
    return await db.collection("users").doc(user.uid).update(profile);
  } catch (error) {}
}
export async function updatePassword(newPassword) {
  const user = firebase.auth().currentUser;
  return await user.updatePassword(newPassword);
}



//REPLIES
export function listenToRepliesFromFirestoreSafe(id) {
  return db.collection("replies").where("corrId", "==", id);
}
// Add a new reply
export function addReplyToFirestore(reply) {
  if (!reply || !reply.corrId || !reply.reply) {
    return Promise.reject("Invalid reply object");
  }
  return db.collection("replies").add({
    ...reply,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

// Delete a reply
export function deleteReplyFromFirestore(replyId) {
  if (!replyId) return Promise.reject("No replyId provided");
  return db.collection("replies").doc(replyId).delete();
}
