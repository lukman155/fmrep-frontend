<!-- ViewTenants.svelte -->
<script>
	import { db } from './../../../lib/firebase/firebase.js';
  import { onMount } from 'svelte';
  import { getDocs, collection, query, where, limit, startAfter, endBefore } from 'firebase/firestore';

  export let propertyId = ''; // This should be passed as a prop or obtained in some way
  let tenants = [];
  let pageSize = 5; // Number of tenants per page
  let currentPage = 1;
  let totalPages = 1;

  onMount(async () => {
    try {
      await loadTenants();
    } catch (error) {
      console.error('Error fetching tenants:', error.message);
    }
  });


  const loadTenants = async (page = 1) => {
    try {
      // Calculate the starting document for pagination
      const startAfterDoc = page > 1 ? tenants[(page - 1) * pageSize - 1] : null;

      // Fetch tenants associated with the propertyId
      const q = query(
        collection(db, 'users'),
        where('propertyId', '==', propertyId),
        limit(pageSize),
        startAfterDoc ? startAfter(startAfterDoc.id) : null
      );

      const querySnapshot = await getDocs(q);

      // Map the data from the query snapshot
      tenants = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Update pagination variables
      currentPage = page;
      totalPages = Math.ceil(querySnapshot.size / pageSize);
    } catch (error) {
      console.error('Error fetching tenants:', error.message);
    }
  };

  const nextPage = async () => {
    if (currentPage < totalPages) {
      await loadTenants(currentPage + 1);
    }
  };

  const prevPage = async () => {
    if (currentPage > 1) {
      await loadTenants(currentPage - 1);
    }
  };
</script>

<div>
  <h1>View Tenants</h1>
  
  {#if tenants.length > 0}
    <ul>
      {#each tenants as tenant (tenant.id)}
        <li>
          <strong>{tenant.fullName}</strong> - {tenant.email}
        </li>
      {/each}
    </ul>
    
    <div>
      <button on:click={prevPage} disabled={currentPage === 1}>Previous Page</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button on:click={nextPage} disabled={currentPage === totalPages}>Next Page</button>
    </div>
  {:else}
    <p>No tenants found for this property.</p>
  {/if}
</div>

<style>
  /* Add your styles here if needed */
</style>
