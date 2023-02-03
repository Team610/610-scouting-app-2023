import { FirebaseError } from "firebase/app";
import Head from "next/head";
import { useCollection } from "react-firebase-hooks/firestore";
import { app, database } from "./FirebaseConfig";
import "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";


export async function editDoc() {
  await setDoc(doc(database, "match", "test"), {
    name: "jo"
  });

  await setDoc(doc(database, "match", "created"), {
    yo: "yo"
  });
}

export async function editDocument(collection: string) {
  await setDoc(doc(database, "match", collection), {
    name: "joe"
  });
}

export async function deleteStuff() {
  await deleteDoc(doc(database, "match", "test"));
}

export async function deleteDocument(collection: string) {
  await deleteDoc(doc(database, "match", collection));
}

export async function read() {
  const docSnap = await getDoc(doc(database, "match", "test"));

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    console.log("No such document!");
  }
}

