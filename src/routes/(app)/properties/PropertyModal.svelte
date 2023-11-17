<!-- PropertyDetailsModal.svelte -->

<script>
	import { db } from './../../../lib/firebase/firebase.js';
  import { getDocs, collection, query, where } from 'firebase/firestore';
  import CreateTenant from './CreateTenant.svelte';

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
      console.log(propertyAssets)
    } catch (error) {
      console.error('Error fetching associated assets:', error.message);
    }
  };

  // Call fetchAssociatedAssets when the property changes
  $: if (property && property.id) {
    fetchAssociatedAssets();
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="modal" on:click={closeModal}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-content" on:click={(event) => event.stopPropagation()}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="image-con">
      <span class="close" on:click={closeModal}><i class="fa-solid fa-xmark"></i></span>
      {#if property.imageUrl}
        <img src={property.imageUrl} alt="Property" class="property-image">
      {:else}
        <div class="default-image">No Image Available</div>
      {/if}
      <div class='prop-title'>
        <h3>{property.name}</h3>
        <p>{property.address}</p>
      </div>
    </div>
    
    <!-- Display associated assets -->
    <div class="sub-con">
      <div class="assets">
        <h4>Assets</h4>
        {#each propertyAssets as asset, index (index)}
          <div class="asset-details">
            <h5>{asset.name}</h5>
            {#if asset.imageUrls && asset.imageUrls.length > 0}
              {#each asset.imageUrls as imageUrl}
                <img src={imageUrl} alt="Asset" class="asset-image">
              {/each}
            {:else}
              <div class="default-image">No Image Available</div>
            {/if}
              <p>{asset.description}</p>
          </div>
        {/each}
      </div>
      <div class="actions">
        <CreateTenant propertyId={property.id} />
      </div>

    </div>
  </div>
</div>

<style>

.image-con {
  position: relative;
}
  .prop-title {
position: absolute;
bottom: -30px;
border: 1px solid #4A9C48;
border-radius: 20px;
left: 50%;
transform: translateX(-50%);
background-color: rgba(255, 255, 255, 0.304);
padding: .7em;
  }

  h3 {
    font-size: 2em;
    margin: 0;
  }

  p {
    margin: 0;
  }
  .sub-con {
    display: flex;
    padding: 1em;
  }
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
    position: relative;
    background-color: #fefefe;
    margin: 10% auto;
    border-radius: 30px;
    width: 90%;
    text-align: center;
  }

  .close {
    color: #be0000a5;
    position: absolute;
    font-size: 1.5em;
    cursor: pointer;
    right: -10px;
    top: -10px;
    background-color: white;
    border: 3px solid rgba(0, 0, 0, 0.101);
    line-height: 50%;
    border-radius: 25px;
    padding: .1em .3em;


  }

  .close:hover,
  .close:focus {
    border: 3px solid rgba(0, 0, 0, 0.422);

  }

  .property-image {
    width: 100%;
    max-height: 300px;
    border-radius: 30px 30px 0 0;
     /* Adjust the max height as needed */
  }

  .default-image {
    color: #888;
    font-size: 18px;
    margin-bottom: 15px;
  }

  .asset-image {
    max-width: 100%;
    max-height: 200px; /* Adjust the max height as needed */
  }

</style>
