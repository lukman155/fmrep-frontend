<!-- TicketDetails.svelte -->
<script>
	import { statusOptions } from './add/options.js';
	import { toast } from '@zerodevx/svelte-toast';
  import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
  import { auth, db } from '../../../lib/firebase/firebase';
  import { createEventDispatcher, onMount, tick } from 'svelte';


  
  export let ticket;
  export let show;

  let selectedStatus;
  let isAdmin = false;

  const checkAdminStatus = async () => {
    try {
      const adminsCollectionRef = collection(db, 'admins');
      const adminsSnapshot = await getDocs(adminsCollectionRef);

      // Check if the current user's UID exists in the admins collection
      isAdmin = adminsSnapshot.docs.some((doc) => doc.id === auth.currentUser.uid);
    } catch (error) {
      console.error('Error checking admin status:', error.message);
    }
  };
onMount(() => {
  checkAdminStatus()
})

async function updateStatusAndRemarks() {
    const ticketRef = doc(db, "tickets", ticket.id);
    const updatedData = {
    status: ticket.data.status
  };

  if(ticket.data.adminRemarks) {
    updatedData.adminRemarks = ticket.data.adminRemarks;  
  }

  await updateDoc(ticketRef, updatedData);

  
  // Get ticket owner email
  const ownerEmail = ticket.data.tenant_email; 
  const remarks = updatedData.adminRemarks;
  const updatedStatus = updatedData.status;
  
  // Send email
  console.log(isAdmin, 'sending msg')
  if (isAdmin){
    sendStatusUpdateEmail(ownerEmail, updatedStatus, remarks);
  }
    toast.push(`Ticket updated!`);
  }


  async function sendStatusUpdateEmail(email, status, remarks) {

    let messageHtml = `
      Your ticket status has been updated to ${status} by an admin.
    `;

    // Check if remarks provided
    if(remarks) {
      messageHtml += `
        Remarks: ${remarks}
      `;
    }

    const mailRef = collection(db, "mail");

    await addDoc(mailRef , {
      to: email,
      message: {
        subject: `Ticket - '${ticket.data.issue}' updated`,
        html: messageHtml
      }
    });
  }

  function close() {
    show = false;
  }

  function overlayClick(event) {
    if (event.target.classList.contains('modal-container')) {
      close();
    }
  }
  const dispatch = createEventDispatcher();
  async function deleteTicket() {
    const ticketRef = doc(db, 'tickets', ticket.id);
    await deleteDoc(ticketRef);
    show = false; // close modal
    toast.push('Deleted Ticket Successfully', {classes:['toast-warning']})
    dispatch('delete-ticket', {id: ticket.id})
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

          <h3>Category:</h3>
          <p>{ticket.data.category || 'No Category'}</p>
          <h3>Priority:</h3>
          <p>{ticket.data.priority || 'No Priority'}</p>
          <h3>Property:</h3>
          <p>{ticket.data.propertyName || 'No Address'}</p>
          <h3>Address:</h3>
          <p>{ticket.data.address || 'No Address'}</p>
        </div>
      </div>
      <hr>
      <div class="status-con">
        <label for="status">
          <p>Select Status:</p>
          <select bind:value={ticket.data.status}>
            {#each statusOptions as option}
              <option value={option}>{option}</option>
            {/each}
          </select>
        </label>
        <!-- Add a textarea for administrator remarks -->
        
        {#if isAdmin}
        <label for="adminRemarks">
          <p>Administrator Remarks:</p>
          <textarea id="adminRemarks" bind:value={ticket.data.adminRemarks}></textarea>
        </label>
        <!-- Add a submit button for updating both status and remarks -->
      {/if}
      <button on:click={updateStatusAndRemarks}>Submit</button>
        <div class="remarks-section">
          <h3>Administrator Remarks:</h3>
          <p>{ticket.data.adminRemarks || 'No remarks available'}</p>
        </div>
      
      </div>
      
    </div>
    <p>Submitted by {ticket.data.tenant_email || 'Unknown Tenant'}</p>
    <button on:click={deleteTicket}>
      Delete Ticket
    </button>
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
    gap: 2em;
  }

  h3 {
    margin-top: 10px;
  }
</style>
