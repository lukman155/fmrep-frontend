<script>
	import { doc } from 'firebase/firestore';
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
    // Reference to the user document
    const userDocRef = doc(db, 'users', userId);

    // Delete the user document
    await deleteDoc(userDocRef);

    console.log('User deleted successfully');
    // Refresh tenants list or update UI as needed
    await loadTenants();
  } catch (error) {
    console.error('Error deleting user:', error.message);
    // Handle error, maybe show a notification to the user
  }
};

</script>

<div>
  <h1>Tenants</h1>

  {#await loadTenants()}
    <p>Loading tenants</p>
  {:then tenants}
  {#if tenants.length > 0}
    <ul>
      {#each tenants as tenant (tenant.email)}
        <li>
          <strong>{tenant.fullName}</strong> - {tenant.email}
          <button on:click={() => deleteTenant(tenant.userId)}>Delete</button>
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
