<script>

  import { collection, getDocs } from "firebase/firestore";
  import { onMount } from "svelte";
  import { db } from "../../../lib/firebase/firebase";
  import Link from "../../../lib/components/Link.svelte";
  import PropertyModal from './PropertyModal.svelte';

let properties = [];
let selectedProperty = null;
let error = null;

const fetchProperties = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'properties'));
    properties = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error('Error fetching properties:', err.message);
    error = err.message;
  }
};

onMount(() => {
  fetchProperties();
});
</script>

<section>
<div class="title">
  <h1>Properties</h1>
  <p>Manage all your Properties</p>
  <Link to='/properties/add' text='Add Property'/>
</div>
<h2>Properties</h2>

{#if selectedProperty !== null}
  <!-- Use PropertyDetailsModal component for the modal -->
  <PropertyModal
    property={selectedProperty}
    onClose={() => selectedProperty = null}
  />
{/if}

{#if error}
  <p>Something went wrong: {error}</p>
{:else}
  <p class="badge">{properties.length} Properties Listed</p>

  <table>
    <thead>
      <tr>
        <th>Property Name</th>
        <th>No. of Tenants</th>
      </tr>
    </thead>
    <tbody>
      {#each properties as property}
        <tr on:click={() => selectedProperty = property}>
          <td class="t-text">
            <div class="img-con">
              <!-- Use the property's image URL if available -->
              {#if property.imageUrl}
                <img src={property.imageUrl} alt="prop-image">
              {:else}
                <!-- Use a default image if imageUrl is not available -->
                <img src="pics/house.jpg" alt="prop-image">
              {/if}
            </div>
            <p class="ticket-text">{property.name}<br>
              <span class="submit-badge">{property.address}</span>
            </p>
          </td>
          <td>23</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
</section>


<style>
    .img-con {
    width: 100px;
    height: 60px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5%;
  }

  .t-text {
    display: flex;
    gap: 1em;
    align-items: center;
  }

  .t-text > p {
    font-size: 1em;
    margin: 0;
    font-weight: 500;
    color: rgb(0, 0, 0);

  }

  p > span, td, th {
    color: rgba(0, 0, 0, 0.601);
  }


  table {
    width: 100%;
    text-align: left;
    min-width: 200px;
  }

  td, th {
    position: relative;
    padding: .7em 0;
    border-bottom: 1px solid rgba(0,0,0,.1);
  }

  section {
    padding: 1em 2em;
  }

  .badge {
    width: fit-content;
    border-radius: 10px;
    padding: .4em .8em;
    background-color: rgba(255, 204, 0, 0.404);
    font-size: .7em;
  }

  h1, h2, p {
    margin: 0;
  }

  h2 {
    font-size: 1.2em;
    font-weight: 600;
  }

  p {
    font-size: .8em;
    margin: .5em 0 0 0;

  }

  .title {
    font-size: 1.5em;
    text-align: center;
    padding: 1em 0;
    border-bottom: 1px solid rgba(0,0,0,.1);
    margin-bottom: 1em;
    text-align: left;
  }

</style>