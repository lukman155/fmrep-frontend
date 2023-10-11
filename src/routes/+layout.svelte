<script>
	import { authStore } from './../store/store.js';
  import { onMount } from "svelte";
	import { auth, db } from './../lib/firebase/firebase.js';
  import SideMenu from "./SideMenu.svelte";
  import { doc, getDoc, setDoc } from "firebase/firestore";

  const noneAuthRoutes = ['/'];


  onMount(() => {
    console.log('mounting');
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const currentPath = window.location.pathname;
      
      if (!user && !noneAuthRoutes.includes(currentPath)){
        window.location.href = '/';
        return
      }
      if (user && currentPath === '/'){
        window.location.href = '/dashboard';
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

<div class="container">

  <div class="sidebar">
    <SideMenu />
  </div>

  <div class="content">
    <slot />
  </div>

</div>

<style>

.container {
  display: flex;
  height: 100%;

}
.sidebar {
  height: 100%;
}

.content {
  flex-grow: 1;
  overflow: auto;
}
</style>