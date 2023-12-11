<!-- PropertyDetailsModal.svelte -->

<script>
	import { toast } from '@zerodevx/svelte-toast';
	import ViewTickets from './ViewTickets.svelte';
	import { auth, db } from './../../../lib/firebase/firebase.js';
  import { getDocs, collection, query, where, deleteDoc, doc } from 'firebase/firestore';
  import Tenants from './Tenants.svelte';
  import {createEventDispatcher} from 'svelte';
  import Assets from './Assets.svelte';

// Delete asset function


  export let property;
  export let onClose;

  let tabs = ['Assets', 'Tickets', 'Tenants'];
  let activeTab = tabs[0];

  let propertyAssets = [];


  let showConfirm = false;

  function confirmDelete() {
    showConfirm = true; 
  }

  const closeModal = () => {
    onClose();
  };


  const dispatch = createEventDispatcher();

  const deleteProperty = async () => {
    try {
      // Delete property
      await deleteDoc(doc(db, 'properties', property.id));

      // Fetch associated assets and delete them
      const assetsSnapshot = await getDocs(query(collection(db, 'assets'), where('propertyId', '==', property.id)));
      const assetDeletePromises = assetsSnapshot.docs.map(async (assetDoc) => {
        await deleteDoc(assetDoc.ref);
      });

      // Fetch associated users and delete them
      // Replace 'users' with your actual collection name
      const usersSnapshot = await getDocs(query(collection(db, 'users'), where('propertyId', '==', property.id)));
      const userDeletePromises = usersSnapshot.docs.map(async (userDoc) => {
        await deleteDoc(userDoc.ref);
      });

      // Fetch associated tickets and delete them
      // Replace 'tickets' with your actual collection name
      const ticketsSnapshot = await getDocs(query(collection(db, 'tickets'), where('propertyId', '==', property.id)));
      const ticketDeletePromises = ticketsSnapshot.docs.map(async (ticketDoc) => {
        await deleteDoc(ticketDoc.ref);
      });

      // Wait for all delete operations to complete
      await Promise.all([...assetDeletePromises, ...userDeletePromises, ...ticketDeletePromises]);

      console.log('Property and associated entities deleted successfully!');
      closeModal();
      toast.push(`Deleted property - ${property.name} and all associated tenants`, { classes: ['toast-warning'] });
      dispatch('refresh');
    } catch (error) {
      console.error('Error deleting property:', error.message);
    }
  };


  // Function to fetch associated assets
  const fetchAssociatedAssets = async () => {
    try {
      const assetsSnapshot = await getDocs(query(collection(db, 'assets'), where('propertyId', '==', property.id)));
      propertyAssets = assetsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
      console.log(propertyAssets)
    } catch (error) {
      console.error('Error fetching associated assets:', error.message);
    }
  };

  async function deleteAsset(asset) {

  const assetDocRef = await doc(db, 'assets', asset.id);
  
  await deleteDoc(assetDocRef);

// Filter out deleted asset
propertyAssets = propertyAssets.filter(a => a.id !== asset.id);

}

  // Call fetchAssociatedAssets when the property changes
  $: if (property && property.id) {
    fetchAssociatedAssets();
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="modal-con" on:click={closeModal}>
<div class="modal" >
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

    <div class="prop-controls">

      <button on:click={confirmDelete}>
        Delete Property
      </button>
    
      {#if showConfirm}
    
        <div class="confirm">
    
          <p>Are you sure you want to delete this property?</p>
    
          <div>
            <button on:click={deleteProperty}>Yes, delete</button>
            <button on:click={() => showConfirm = false}>Cancel</button>  
          </div>
    
        </div>
    
      {/if}
    
    </div>

    <div class="description">
      <p>5 units of 3-bedroom bungalow with BQ and some blah blah blah</p>
    </div>

    <div class="tab-container">
      <div class="tabs">
        {#each tabs as tab}
            <div class='tab {activeTab === tab ? "active" : ""}' on:click={() => activeTab = tab}>
              {tab}
            </div>
        {/each}
      </div>
    </div>
    <div class="tab-content">
      {#if activeTab == 'Assets'}

      <Assets property={property} {propertyAssets} ></Assets>
    
      {/if}
    
      {#if activeTab == 'Tickets' }
        <ViewTickets propertyId={property.id} /> 
      {/if}
    
      {#if activeTab == 'Tenants' }
        <div class="actions tenants">
        <Tenants propertyId={property.id} propertyName={property.name} />
        </div>
      {/if}
    </div>
    
  </div>
</div>
</div>

<style>

  .tab-content {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

.confirm { background: #fff; border: 1px solid #ddd; padding: 20px; text-align: center; } 

button {
  margin-top: 1em;
  background: none;
  border: none;
  color: #f76565;
  font-size: 14px;
  border: 1px solid #f76565;
  padding: 4px 8px;
  border-radius: 8px;
}

button:hover {
  cursor: pointer;
  color: white;
  background-color: #f76565;
}

  

  .modal-con {
    display: flex;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.7);
    width: 100%;
  }

  .modal {
    width: 100%;
    height: 100%;
    max-width: 800px;
    overflow: auto;
    margin: 0 auto;
  }

.description {
  padding: 1em;
}
.image-con {
  position: relative;
margin-bottom: 2em;
width: 100%;

}
  .prop-title {
position: absolute;
bottom: -30px;
border: 1px solid #4A9C48;
border-radius: 20px;
left: 50%;
transform: translateX(-50%);
background-color: #499c48;
padding: .7em;
color: white;
  }

  h3 {
    font-size: 2em;
    margin: 0;
  }

  p {
    margin: 0;
  }

  .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fefefe;
    margin: 10% auto;
    border-radius: 30px;
    width: 90%;
    text-align: center;
    padding-bottom: 2em;
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
    max-height: 400px;
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
    max-height: 200px; 
  }

  /* tab styles */

  .tab-container {
    width: 100%;
    
  }
  .tabs {
    display: flex;
  }

  .tab {
    font-size: .8em;
    padding: 10px;
    cursor: pointer;
    width: 100%;
    border-bottom: 1px solid #499c484f;
  }

  .tab:hover {
    border-bottom: 2px solid #499c484f;

  }

  .active {
    font-weight: 600;
    border-bottom: 2px solid #4A9C48;
  }
  .active:hover {
    border-bottom: 2px solid #4A9C48;
  }

  .assets { max-width: 600px; margin: 0 auto; } .asset { display: flex; align-items: center; padding: 20px 0; border-bottom: 1px solid #eee; } .details { flex: 3; } .name { margin-top: 0; } .image { flex: 1; margin-left: 20px; } .image img { width: 100px; height: 100px; object-fit: cover; border-radius: 4px; }


</style>
