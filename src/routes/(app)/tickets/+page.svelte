<script>
	import { collection, getDocs, orderBy, query, where, limit, startAfter, } from 'firebase/firestore';
  import { checkAdminStatus  } from './../../../lib/helper.js';
  import { auth, db } from '../../../lib/firebase/firebase';
  import { onMount } from 'svelte';
  import TicketDetails from './TicketDetails.svelte';
  import Link from '../../../lib/components/Link.svelte';
  import Badge from './Badge.svelte';

  let uid;
  let isAdmin = false;
  let currentPage = 1;
  const ticketsPerPage = 10;
  let ticket_data = [];
  let startAfterDoc;
  let filterStatus = '';
  let filterPriority = '';

  // State for displaying ticket details modal
  let showModal = false;

  // State for storing selected ticket
  let selectedTicket;

  // Function to show ticket details
  function showTicketDetails(ticket) {
    selectedTicket = ticket;
    showModal = !showModal;
    showModal = true
  }

  const loadPage = async (direction) => {
    const newData = await (isAdmin ? getAllTickets : getUserTickets)(
      startAfterDoc,
      ticketsPerPage,
      direction
    );
    ticket_data = newData.tickets;
    startAfterDoc = direction === -1 ? newData.startAfterDoc : null;
    console.log(ticket_data)
    currentPage += direction;
  };

  const getTickets = async (collectionRef, startAfterDoc, ticketsPerPage, additionalConditions = []) => {
    try {
      let queryRef = query(
        collectionRef,
        ...additionalConditions,
        orderBy('createdAt', 'desc'),
        limit(ticketsPerPage),
      );

      if (startAfterDoc) {
        queryRef = query(
        collectionRef,
        ...additionalConditions,
        orderBy('createdAt', 'desc'),
        limit(ticketsPerPage),
        startAfter(startAfterDoc));
      }

      const querySnapshot = await getDocs(queryRef);

      let tickets = [];
      querySnapshot.forEach((doc) => {
        tickets.push({
          id: doc.id,
          data: doc.data(),
        });
        startAfterDoc = doc;
        
      });
      tickets = tickets
      return { tickets, startAfterDoc }
    } catch (error) {
      console.error('Error retrieving tickets:', error.message);
      return [];
    }
  };

  const getUserTickets = async (startAfterDoc, ticketsPerPage, direction) => {
    const userTicketsRef = collection(db, 'tickets');
    const additionalConditions = [where('tenant_uid', '==', auth.currentUser.uid)];
    return getTickets(userTicketsRef, startAfterDoc, ticketsPerPage, additionalConditions);
  };

  const getAllTickets = async (startAfterDoc, ticketsPerPage, direction) => {
    const allTicketsRef = collection(db, 'tickets');
    return getTickets(allTicketsRef, startAfterDoc, ticketsPerPage);
  };

  const handleDispatch = async() => {

    isAdmin = await checkAdminStatus();
    uid = auth.currentUser.uid;

    const data = await (isAdmin ? getAllTickets : getUserTickets)(null, ticketsPerPage);
    ticket_data = data.tickets
    startAfterDoc = data.startAfterDoc
  }

  onMount(async () => {
    // Check admin status
    isAdmin = await checkAdminStatus();
    uid = auth.currentUser.uid;

    const data = await (isAdmin ? getAllTickets : getUserTickets)(null, ticketsPerPage);
    ticket_data = data.tickets
    startAfterDoc = data.startAfterDoc
  });
</script>


<section>
<TicketDetails on:delete-ticket={handleDispatch} ticket = {selectedTicket} show={showModal} />
  <div class="title">
    <h1>Tickets</h1>
    <p>Manage all your Properties Maintenance Tickets</p>
    <Link to="/tickets/add" text='Add Ticket'/>
  </div>

  <h2>Maintenance Tickets</h2>

  {#if uid}
  <div class="status-badges">
    <Badge />
  </div>
  {/if}
  <table>
      <thead>
          <tr>
            <th>Tickets</th>
            <th>Address</th>
            <th>Category</th>
            <th>Status</th>
            <th>Created on</th>
          </tr>
      </thead>
      <tbody>
        {#each ticket_data as ticket, index}
  <tr class="{ticket.data.status} ticket-hover" on:click={() => showTicketDetails(ticket)} key={index}>
    <td class="t-text">
      <i class="fa-regular fa-file-lines"></i>
      <p class="ticket-text truncated">
        {#if ticket.data.issue}
          {ticket.data.issue}
        {:else}
          No Issue
        {/if}
        <br>
        <span class="submit-badge truncated">by {ticket.data.tenant_email}</span>
      </p>
    </td>
    <td class="truncated">{ticket.data.address || 'No Address'}</td>
    <td class="truncated">{ticket.data.category || 'No Category'}</td>
    <td class="truncated">{ticket.data.status || 'No Status'}</td>
    <td>
      {new Date(ticket.data.createdAt.toDate()).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      })} -
      {new Date(ticket.data.createdAt.toDate()).toLocaleDateString()}
      </td>
  </tr>
{/each}
      </tbody>

  </table>

  <div class="pagination">
    <button on:click={() => loadPage(-1)} disabled={currentPage === 1}>Previous Page</button>
    <span>Page {currentPage}</span>
    <button on:click={() => loadPage(1)}>Next Page</button>
  </div>

</section>


<style>

.truncated {
    max-width: 200px; /* Adjust the maximum width as needed */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  tr {
    cursor: pointer;
  }

  .ticket-hover:hover {
    transform: scale(1.005);
  }

  td::first-letter {
    text-transform: capitalize;
  }

  .status-badges {
    display: flex;
    gap: 10px;
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

  .fa-regular {
    background-color: rgba(0, 0, 0, 0.05);
    padding: .5em .7em;
    border-radius: 50%;
    color: rgba(0, 0, 0, 0.7);
    font-size: 1.5em;
  }

  table {
    width: 100%;
    text-align: left;

  }

  td, th {
    position: relative;
    padding: .7em 1em;
    border: none;
    border-bottom: 5px solid white;
  }

  table { border-spacing: 0;}

  section {
    padding: 1em 2em;
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
  .row {
    display: flex;

  }



  .column {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 2em;
    height: 1000px;
  }

  .v-line {
    border-right: 1px solid rgba(0, 0, 0, 0.1) ;
  }
</style>