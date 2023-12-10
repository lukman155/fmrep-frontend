<script>
  import { SvelteToast, toast } from '@zerodevx/svelte-toast'
	import { isLoggedIn, userAuth } from '../store/authStore.js';
  import { onDestroy, onMount } from "svelte";
	import { auth } from './../lib/firebase/firebase.js';

  let unsubscribe;
  onMount(() => {
    
    unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
      isLoggedIn.update(() => true);
      // toast.push('Logged in', { classes: ['toast-success'] });
      console.log('logged in')

      userAuth.set({
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
    });
      document.cookie = `isLoggedIn=true; max-age=3600`;      
      } else {
        isLoggedIn.update(() => false)
        console.log('logged out')
        toast.push('Logged out', { classes: ['toast-warning'] });
        document.cookie = `isLoggedIn=false; max-age=3600`;
        userAuth.set(null);
      }
    });
  }); 

  onDestroy(() => {
    unsubscribe;
  })

  const options = {};

</script>

<slot />

<SvelteToast {options} />


<style>

:root {
  --toastPadding: .1em .6em; 
  --toastBarHeight : 0;
  --toastBorderRadius : 16px;
  }

  :global(.toast-success) {
    --toastBackground: #4A9C48;
  }

  :global(.toast-warning) {
    --toastBackground: #FFBE00;
  }

  :global(.toast-error) {
    --toastBackground: #9c4848;
  }
</style>