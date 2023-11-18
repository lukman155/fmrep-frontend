<script>
  import { onMount } from 'svelte';
  import { getDocs, collection, query, where } from 'firebase/firestore';
  import { db } from '../../../lib/firebase/firebase';

  export let propertyId;

  let tenants = [];



  const loadTenants = async () => {
    try {
      const q = query(collection(db, 'users'), where('propertyId', '==', propertyId));
      const querySnapshot = await getDocs(q);

      tenants = querySnapshot.docs.map(doc => doc.data());
      return tenants
    } catch (error) {
      console.error('Error fetching tenants:', error.message);
    }
  };

  const deleteTenant = async (userId) => {
    try {
      // Replace 'your-function-endpoint' with the actual endpoint URL of your Cloud Function
      const response = await fetch('https://us-central1-fmrep-sveltekit.cloudfunctions.net/deleteUser?userId=' + userId, {
        method: 'POST',
      });

      if (response.ok) {
        console.log('User deleted successfully');
        // Refresh tenants list or update UI as needed
      } else {
        console.error('Error deleting user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  // Example usage of deleteTenant function
  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteTenant(userId);
      await loadTenants(); // Refresh the tenant list after deletion
    }
  };
</script>

<div>
  <h1>View Tenants</h1>

  {#await loadTenants()}
    <p>Loading tenants</p>
  {:then tenants}
  {#if tenants.length > 0}
    <ul>
      {#each tenants as tenant (tenant.email)}
        <li>
          <strong>{tenant.fullName}</strong> - {tenant.email}
          <button on:click={() => handleDelete(tenant.userId)}>Delete</button>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No tenants found for this property.</p>
  {/if}
  {/await}
</div>

<style>
  /* Add your styles here if needed */
</style>
