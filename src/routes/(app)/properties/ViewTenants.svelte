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
