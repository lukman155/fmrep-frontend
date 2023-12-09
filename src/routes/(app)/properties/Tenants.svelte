<script>
  import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
  import { getDocs, query, where, collection, deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore';

  import { db, auth } from '../../../lib/firebase/firebase';
  
  import { onMount } from 'svelte';
  import { toast } from '@zerodevx/svelte-toast';

  export let propertyId;
  export let propertyName;

  let tenants = [];

  let fullName = '';
  let email = '';
  let defaultPassword = 'temp123';
  let isLoading = false;
  let error = null;

  const loadTenants = async () => {
    try {
      const q = query(collection(db, 'users'), where('propertyId', '==', propertyId));
    
      const querySnapshot = await getDocs(q);

      tenants = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()  
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const createTenant = async () => {
    try {
      isLoading = true;
      error = null;

      // Create user with email and password
      let adminUser = auth.currentUser;
      let adminId = auth.currentUser.uid
      const userCredential = await createUserWithEmailAndPassword(auth, email, defaultPassword);

      // Get the user's UID
      const { uid } = userCredential.user;

      // Save user data to Firestore
      const userDocRef = doc(db, 'users', uid); // Adjust 'users' collection as needed
      await setDoc(userDocRef, {
        fullName,
        email,
        propertyId,
        propertyName,
        adminId,
        createdAt: Timestamp.now(),
        uid,
      });

      auth.updateCurrentUser(adminUser);
      toast.push(`${fullName} created successfully`, { classes: ['toast-success'] });
      loadTenants();
    } catch (error) {
      console.error('Error creating user:', error.message);
      error = error.message;
    } finally {
      isLoading = false;
    }
  };

  const deleteTenant = async (id) => {

    try {
      await deleteDoc(doc(db, 'users', id));
      toast.push('Tenant deleted');

      await loadTenants();
    } catch (err) {
      console.log(err);
    }

  };

  onMount(async () => {
    await loadTenants();
  });

</script>

<div>

  <div>
    <input bind:value={fullName} placeholder="Name">
    <input bind:value={email} placeholder="Email">

    <button on:click={createTenant}>
      Add Tenant 
    </button>
  </div>

  {#await loadTenants()}
    <p>Loading...</p>
  {:then}
  
    {#if tenants.length === 0}
      <p>No tenants found</p>
    {:else}
      {#each tenants as tenant}
        <div>
          {tenant.fullName} - {tenant.email}
          
          <button on:click={() => deleteTenant(tenant.id)}>
            Delete
          </button>
        </div>
      {/each}
    {/if}

  {/await}

</div>