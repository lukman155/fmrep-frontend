<!-- PropertyDetailsModal.svelte -->

<script>
	import { db } from './../../../lib/firebase/firebase.js';
  import { getDocs, collection, query, where } from 'firebase/firestore';

  export let property;
  export let onClose;

  let propertyAssets = [];

  const closeModal = () => {
    onClose();
  };

  // Function to fetch associated assets
  const fetchAssociatedAssets = async () => {
    try {
      const assetsSnapshot = await getDocs(query(collection(db, 'assets'), where('propertyId', '==', property.id)));
      propertyAssets = assetsSnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error fetching associated assets:', error.message);
    }
  };

  // Call fetchAssociatedAssets when the property changes
  $: if (property && property.id) {
    fetchAssociatedAssets();
  }
</script>

<div class="modal" on:click={closeModal}>
  <div class="modal-content" on:click={(event) => event.stopPropagation()}>
    <span class="close" on:click={closeModal}>&times;</span>
    {#if property.imageUrl}
      <img src={property.imageUrl} alt="Property" class="property-image">
    {:else}
      <div class="default-image">No Image Available</div>
    {/if}
    <h3>{property.name}</h3>
    <p>{property.address}</p>
    
    <!-- Display associated assets -->
    <h4>Associated Assets</h4>
    {#each propertyAssets as asset (asset.id)}
      {#if asset.id !== undefined}
        <div class="asset-details">
          <h5>{asset.name}</h5>
          {#if asset.imageUrl}
            <img src={asset.imageUrl} alt="Asset" class="asset-image">
          {:else}
            <div class="default-image">No Image Available</div>
          {/if}
          <p>{asset.description}</p>
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  /* Styles for the modal */
  .modal {
    display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .modal-content {
    background-color: #fefefe;
    margin: 10% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    text-align: center;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
  }

  .property-image {
    max-width: 100%;
    max-height: 300px; /* Adjust the max height as needed */
    margin-bottom: 15px;
  }

  .default-image {
    color: #888;
    font-size: 18px;
    margin-bottom: 15px;
  }

  .asset-image {
    max-width: 100%;
    max-height: 200px; /* Adjust the max height as needed */
    margin-bottom: 10px;
  }

</style>
