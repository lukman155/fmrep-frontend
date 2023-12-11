<script>
	import { toast } from '@zerodevx/svelte-toast';
	import { storage } from './../../../lib/firebase/firebase.js';
  import { Timestamp, doc, addDoc, collection, deleteDoc, getDocs, query, where } from "firebase/firestore";
  import { db } from "../../../lib/firebase/firebase";
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


  

  async function uploadImage(event) {
    const file = event.target.files[0];
    const storageRef = ref(storage, file.name);

    // Upload to Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get URL to use in form
    formData.imageUrl = await getDownloadURL(snapshot.ref);
  }  

  export let property;
  export let propertyAssets;



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
toast.push ('Asset Deleted');
}


let showForm = false;

  let formData = {
    name: '',
    description: '', 
    imageUrl: ''
  };

  async function submitForm() {
    
    const assetData = {
      ...formData,
      propertyId: property.id,
      createdAt: Timestamp.now(),
      }

      await addDoc(collection(db, "assets"), assetData);
    
    showForm = false;
  toast.push ('Asset Added');
  fetchAssociatedAssets()


  }




$: if (property && property.id) {
    fetchAssociatedAssets();
  }
</script>


<div class="assets">

  {#each propertyAssets as asset}
  
    <div class="asset">
    
      <div class="details">
          <h3 class="name">
            {asset.name}
          </h3>
          <p class="description">
            {asset.description}  
          </p>
      </div>
      <div class="image">
        {#if asset.imageUrl}
          <img src={asset.imageUrl} alt="">
        {:else}
          <div class="no-image">
            No image
          </div>
        {/if}
      </div>
      <button on:click={() => deleteAsset(asset)}>
        Delete
      </button>

    </div>

  {/each}
<div>
  <button on:click={() => showForm = true}>Add Asset</button>
</div>
  
  {#if showForm}
  
    <form on:submit|preventDefault={submitForm}>
  
      <h3>Add New Asset</h3>
      
      <input bind:value={formData.name} placeholder="Name">
      
      <textarea bind:value={formData.description} placeholder="Description"></textarea>
        
      <input type="file" on:change={uploadImage}>
  
  <!-- Show uploaded image preview -->
  {#if formData.imageUrl}
  <div class="img-load">
    <img src={formData.imageUrl} alt="Uploaded"> 
  </div>
  {/if}


  <div class="form-control">
    <button type="submit">Save</button>
    <button on:click={() => showForm = false}>Cancel</button>
  </div>
    </form>
  
  {/if}

</div>


<style>

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .img-load {
    max-width: 300px;
    width: 100%;
    
  }

  .img-load  > img{
    width: 100%;
    object-fit: cover;
    
  }

button {
	box-shadow:inset 0px 1px 3px 0px #91b8b3;
	background:linear-gradient(to bottom, #768d87 5%, #6c7c7c 100%);
	background-color:#768d87;
	border-radius:5px;
	border:1px solid #566963;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:15px;
	font-weight:bold;
	padding:4px 8px;
	text-decoration:none;
	text-shadow:0px -1px 0px #2b665e;
}
button:hover {
	background:linear-gradient(to bottom, #6c7c7c 5%, #768d87 100%);
	background-color:#6c7c7c;
}
button:active {
	position:relative;
	top:1px;
}


.assets { 

  display: flex; 
  flex-direction: column; 
  gap: 20px;

} 
  
.asset { 
  display: flex;
  justify-content: space-around; 
  align-items: center; 
  padding: 20px 0; 
  border-bottom: 1px solid #d8d8d8;
  width: 100%;
}  .name { margin-top: 0; }  .image img { width: 100px; height: 80px; object-fit: cover; border-radius: 4px; }

</style>