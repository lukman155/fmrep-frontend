<!-- PropertyDetailsModal.svelte -->

<script>
  export let property;
  export let onClose;

  const closeModal = () => {
    onClose();
  };
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
    <!-- Add other property details as needed -->
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
</style>
