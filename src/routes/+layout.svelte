<script>
	import { isLoggedIn } from '../store/authStore.js';
  import { onMount } from "svelte";
	import { auth, db } from './../lib/firebase/firebase.js';
  import { doc, getDoc, setDoc } from "firebase/firestore";

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
      isLoggedIn.update(() => true);
      console.log('logged in')
      document.cookie = `isLoggedIn=true; max-age=3600`;
      
      } else {
        isLoggedIn.update(() => false)
        console.log('logged out')
        document.cookie = `isLoggedIn=false; max-age=3600`;
      }
    });
  }); 

</script>

<slot />