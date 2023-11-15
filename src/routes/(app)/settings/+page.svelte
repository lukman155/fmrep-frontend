<script>
  import { onMount } from 'svelte';
  import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';
  import { auth } from '../../../lib/firebase/firebase';

  let oldPassword = '';
  let newPassword = '';
  let confirmPassword = '';
  let successMessage = '';
  let errorMessage = '';


  const handleChangePassword = async () => {
    try {
      // Reauthenticate the user with their current password before changing it
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      if (newPassword === confirmPassword) {
        // Update the user's password
        await updatePassword(user, newPassword);
        successMessage = 'Password updated successfully!';
        errorMessage = '';
        oldPassword = '';
        newPassword = '';
        confirmPassword = '';
      } else {
        successMessage = '';
        errorMessage = 'Passwords do not match.';
      }
    } catch (error) {
      console.error('Error updating password:', error.message);
      successMessage = '';
      errorMessage = error.message;
    }
  };
</script>

<main>
  <h1>Change Password</h1>

  {#if successMessage}
    <div class="success">{successMessage}</div>
  {/if}

  {#if errorMessage}
    <div class="error">{errorMessage}</div>
  {/if}

  <form on:submit|preventDefault={handleChangePassword}>
    <label>
      Old Password:
      <input type="password" bind:value={oldPassword} required />
    </label>

    <label>
      New Password:
      <input type="password" bind:value={newPassword} required />
    </label>

    <label>
      Confirm Password:
      <input type="password" bind:value={confirmPassword} required />
    </label>

    <button type="submit">Change Password</button>
  </form>
</main>

<style>
  main {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    text-align: center;
  }

  .success {
    color: green;
  }

  .error {
    color: red;
  }
</style>
