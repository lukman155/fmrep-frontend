<script>
	import Badge from './Badge.svelte';

  import { collection, getCountFromServer, getDocs, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
  import { db } from "../../../lib/firebase/firebase";
  import { onDestroy, onMount } from "svelte";
  import TicketDetails from "./TicketDetails.svelte";

  const collectionRef = collection(db, "tickets");
  
  const tickets = [];
  let data = []
  let showModal = false;

  let selectedTicket;
  function showTicketDetails(ticket) {
    selectedTicket = ticket;
    showModal = !showModal;
  }

let unsubscribe;

  onMount(()=> {
    const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(10));
    unsubscribe = onSnapshot(q, (snapshot) => {
      const doc = snapshot.docs;
      data = [];
      doc.forEach((doc) => {
        data = [...data, doc.data()]
      });
    });
  })

  onDestroy(() => {
    unsubscribe;
  })

  const fetchTickets = async() => {
    const querySnapshot = await getDocs(collection(db, "tickets"));
    querySnapshot.forEach((doc) => {
      tickets.push(doc.data())
    });
    return tickets
  }

  async function getCountByStatus(status) {
    if (status) {
      const q = query(collection(db, "tickets"), where("status", "==", status));
      let totalTickets = await getCountFromServer(q);
      return totalTickets.data().count;
    } else {
      const q = query(collection(db, "tickets"));
      let totalTickets = await getCountFromServer(q);
      return totalTickets.data().count;
    }
  }

const metrics = {
  all: async () => getCountByStatus(),
  active: async () => getCountByStatus("pending"),
  completed: async () => getCountByStatus("completed"),
  in_progress: async () => getCountByStatus("in progress"),
  canceled: async () => getCountByStatus("canceled"),
};

  let metrics1 = [
    { label: "Tickets", query: metrics.all, stateClass: "" },
    { label: "Pending", query: metrics.active, stateClass: "pending" },
    { label: "In Progress", query: metrics.in_progress, stateClass: "in" },
    { label: "Completed", query: metrics.completed, stateClass: "completed" },
    { label: "Canceled", query: metrics.canceled, stateClass: "canceled" },
  ];

</script>


<section>
<TicketDetails ticket = {selectedTicket} show={showModal} />
  <div class="title">
    <h1>Tickets</h1>
    <p>Manage all your Properties Maintenance Tickets</p>
    <a href="/tickets/add">Add Ticket</a>
  
  </div>

  <h2>Maintenance Tickets</h2>

  <div class="status-badges">
  {#each metrics1 as { label, query }}
  {#await query()}
    <Badge label={label} loading={true}  />
    {:then num}
    <Badge label={label} num={num}  />
  {/await}
{/each}
</div>
  
  <table>
      <thead>
          <tr>
              <th>Tickets</th>
              <th>Address</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
          </tr>
      </thead>
      <tbody>
        {#each data as ticket}
          <tr class="{ticket.status}" on:click={() => showTicketDetails(ticket)}>
            <td class="t-text">
              <i class="fa-regular fa-file-lines"></i>
              <p class="ticket-text">{ticket.issue}<br>
              <span class="submit-badge">Submitted by {ticket.tenant_email}</span></p>
            </td>
            <td>{ticket.address}</td>
            <td>{ticket.category}</td>
            <td>{ticket.priority}</td>
            <td>{ticket.status}</td>
          </tr>
        {/each}
      </tbody>

  </table>



</section>


<style>

  tr {
    cursor: pointer;
  }

  tr:hover {
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