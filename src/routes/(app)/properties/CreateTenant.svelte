<script>
  import { onMount } from 'svelte';
  import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
  import { doc, setDoc, getFirestore } from 'firebase/firestore';
  import { auth, db } from '../../../lib/firebase/firebase';

  let fullName = '';
  let email = '';
  let isLoading = false;
  let error = null;

  export let propertyId = ''; // This should be passed as a prop or obtained in some way
  export let adminId = ''; // This should be passed as a prop or obtained in some way
  const defaultPassword = 'asdf123'; // Change this to a more secure default password

  const createUser = async () => {
    try {
      isLoading = true;
      error = null;

      // Create user with email and password
      let originalUser = auth.currentUser;
      const userCredential = await createUserWithEmailAndPassword(auth, email, defaultPassword);

      // Get the user's UID
      const { uid } = userCredential.user;

      // Save user data to Firestore
      const userDocRef = doc(db, 'users', uid); // Adjust 'users' collection as needed
      await setDoc(userDocRef, {
        fullName,
        email,
        propertyId,
        adminId
      });

      console.log('User created successfully!');
      auth.updateCurrentUser(originalUser);
    } catch (error) {
      console.error('Error creating user:', error.message);
      error = error.message;
    } finally {
      isLoading = false;
    }
  };
</script>

<div>
  <h1>Create Tenant</h1>
  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
  <form on:submit|preventDefault={createUser}>
    <label for="fullName">Full Name:</label>
    <input type="text" id="fullName" bind:value={fullName} required />

    <label for="email">Email:</label>
    <input type="email" id="email" bind:value={email} required />

    <!-- Add other form fields as needed -->

    <button type="submit" disabled={isLoading}>
      {#if isLoading}
        Creating User...
      {:else}
        Create User
      {/if}
    </button>
  </form>
</div>

<style>
  /* Add your styles here if needed */
</style>
