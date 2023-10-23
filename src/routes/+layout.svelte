<script>
	import { isLoggedIn, userAuth } from '../store/authStore.js';
  import { onDestroy, onMount } from "svelte";
	import { auth, db } from './../lib/firebase/firebase.js';
  import { doc, getDoc, setDoc } from "firebase/firestore";

  let unsubscribe;
  onMount(() => {
    unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
      isLoggedIn.update(() => true);
      console.log('logged in')
      $userAuth = user
      document.cookie = `isLoggedIn=true; max-age=3600`;
      
      } else {
        isLoggedIn.update(() => false)
        console.log('logged out')
        document.cookie = `isLoggedIn=false; max-age=3600`;
      }
    });
  }); 

  onDestroy(() => {
    unsubscribe;
  })

</script>

<slot />