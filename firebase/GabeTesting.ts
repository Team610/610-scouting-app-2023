import { FirebaseError } from "firebase/app";
import Head from "next/head";
import { useCollection } from "react-firebase-hooks/firestore";
import {app, database} from "./FirebaseConfig";
import "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";
import {doc, setDoc } from "firebase/firestore";


export async function ok (){
await setDoc(doc(database, "match", "test"), {
  name: "jo"
});
}
