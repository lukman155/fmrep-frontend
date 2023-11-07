<!-- TicketDetails.svelte -->
<script>
  import Badge from './Badge.svelte';

  export let ticket;
  export let show;

  function close() {
    show = false;
  }
</script>

{#if show}
<div class="modal-container">
  <div class="modal">
    <span class="close" on:click={close}>&times;</span>
    <h2>Issue: {ticket.issue}</h2>
    <hr>
    <div class="details">
      
      <div class="main">
        <h3>Description:</h3>
        <p>{ticket.description}</p>
        <h3>images:</h3>
        <p>{ticket.description}</p>
        
      </div>
      
      <div class="tags">
        <Badge label={ticket.status} num='pine' />
        <h3>Category:</h3>
        <p>{ticket.category}</p>
        <h3>Priority:</h3>
        <p>{ticket.priority}</p>
        <h3>Address:</h3>
        <p>{ticket.address}</p>
      #
      </div>
      
  </div>
  <hr>
  <p>Submitted by {ticket.tenant_email}</p>
  </div>
</div>
{/if}

<style>

  .details > .main {
    flex: 1 1 80%;
  }

  .details > .tags {
    flex: 1 1 20%;
  }

  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
    z-index: 999; /* Ensure it's on top of other content */
  }

  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 10px; /* Increase border radius for rounded corners */
    width: 90%; /* Increase the maximum width */
    overflow: auto;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    position: relative;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 48px;
  }

  .details {
    margin-top: 20px;
    display: flex;

  }

  h3 {
    margin-top: 10px;
  }
</style>
