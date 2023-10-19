<script>
	import { authStore } from './../store/store.js';
  import { onMount } from "svelte";
  import { goto } from '$app/navigation'
	import { auth, db } from './../lib/firebase/firebase.js';
  import { doc, getDoc, setDoc } from "firebase/firestore";


  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const currentPath = window.location.pathname;
      
      if (user && currentPath === '/login'){
        goto ('/dashboard');
        return
      }

      if(!user){
        return; 
      }

      let dataToSetToStore;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists){
        const userRef = doc(db, 'user', user.uid); 
        dataToSetToStore = {
            email: user.email,
            tickets: [],
          };
        await setDoc(userRef, dataToSetToStore, {merge: true});
      } else {
        const userData = docSnap.data();
        dataToSetToStore = userData;
      }
      authStore.update(curr => {
        return{
          ...curr,
          user,
          data: dataToSetToStore,
          loading:false,
        }
      })
    });
  }); 

</script>

<slot />