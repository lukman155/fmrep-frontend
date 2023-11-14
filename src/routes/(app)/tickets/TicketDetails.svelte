<!-- TicketDetails.svelte -->
<script>

  export let ticket;
  export let show;

  function close() {
    show = false;
  }

  function overlayClick(event) {
    if (event.target.classList.contains('modal-container')) {
      close();
    }
  }
</script>
{#if show}
  <div class="modal-container" on:click={overlayClick}>
    <div class="modal">
      <span class="close" on:click={close}>&times;</span>
      <h2>Issue: {ticket.data.issue || 'No Issue'}</h2>
      <hr>
      <div class="details">
        <div class="main">
          <h3>Description:</h3>
          <p>{ticket.data.description || 'No Description'}</p>



        <div class="tags">
          <span class="badge {ticket.data.status || 'No Status'}">
            {ticket.data.status || 'No Status'}
          </span>
          <h3>Category:</h3>
          <p>{ticket.data.category || 'No Category'}</p>
          <h3>Priority:</h3>
          <p>{ticket.data.priority || 'No Priority'}</p>
          <h3>Address:</h3>
          <p>{ticket.data.address || 'No Address'}</p>
        </div>
      </div>
      <hr>
      <p>Submitted by {ticket.data.tenant_email || 'Unknown Tenant'}</p>
    </div>
  </div>
</div>
{/if}

<style>
  .badge {
    width: fit-content;
    border-radius: 10px;
    padding: .4em .8em;
    background-color: rgba(255, 204, 0, 0.404);
    font-size: .7em;
  }

  .pending {
    background-color: rgba(49, 49, 49, 0.15) !important;
  }

  .in {
    background-color: rgba(255, 221, 0, 0.15) !important;
  }

  .completed {
    background-color: rgba(0, 253, 0, 0.15) !important;
  }

  .canceled {
    background-color: rgba(255, 0, 0, 0.1) !important;
  }


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
    justify-content: center;
    gap: 20em;
  }

  h3 {
    margin-top: 10px;
  }
</style>
