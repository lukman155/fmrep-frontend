<script>
	import { isLoggedIn, userAuth } from '../store/authStore.js';
  import { onDestroy, onMount } from "svelte";
	import { auth } from './../lib/firebase/firebase.js';

  let unsubscribe;
  onMount(() => {
    
    unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
      isLoggedIn.update(() => true);
      userAuth.set({
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
    });
      document.cookie = `isLoggedIn=true; max-age=3600`;      
      } else {
        isLoggedIn.update(() => false)
        console.log('logged out')
        document.cookie = `isLoggedIn=false; max-age=3600`;
        userStore.set(null);
      }
    });
  }); 

  onDestroy(() => {
    unsubscribe;
  })

</script>

<slot />