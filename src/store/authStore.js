import { readable, writable } from "svelte/store";
import { auth } from "../lib/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const isLoggedIn = writable(false)

export const userAuth = writable(undefined);

export let x = writable(0);

