<script>

  import { collection, getCountFromServer, getDocs, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
  import { db } from "../../../lib/firebase/firebase";
  import { onDestroy, onMount } from "svelte";

  const collectionRef = collection(db, "tickets");
  
  const tickets = [];
  let data = []


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

  const metrics = {
    all : async () => {
    const q = query(collection(db, "tickets"));
    let totalTickets = await getCountFromServer(q);
    let num = totalTickets.data().count
    return num
    },
    active : async () => {
    const q = query(collection(db, "tickets"), where("status", "==", "pending"));
    let totalTickets = await getCountFromServer(q);
    let num = totalTickets.data().count
    return num
    },
    completed : async () => {
    const q = query(collection(db, "tickets"), where("status", "==", "completed"));
    let totalTickets = await getCountFromServer(q);
    let num = totalTickets.data().count
    return num
    },
    in_progress : async () => {
    const q = query(collection(db, "tickets"), where("status", "==", "in progress"));
    let totalTickets = await getCountFromServer(q);
    let num = totalTickets.data().count
    return num
    },
    canceled : async () => {
    const q = query(collection(db, "tickets"), where("status", "==", "canceled"));
    let totalTickets = await getCountFromServer(q);
    let num = totalTickets.data().count
    return num
    },
  }


  const showTicket = (x) => {
    console.log(x)
  };

</script>



<section>
  <div class="title">
    <h1>Tickets</h1>
    <p>Manage all your Properties Maintenance Tickets</p>
  </div>

  <h2>Maintenance Tickets</h2>


  
    {#await metrics.all()}
    <span class="badge">Loading</span>
    {:then num}
    <span class="badge">Tickets: {num}</span>
    {/await}

    {#await metrics.active()}
    <span class="badge">Loading</span>
    {:then num}
    <span class="badge status-pending">Pending: {num}</span>
    {/await}

    {#await metrics.in_progress()}
    <span class="badge status-in">Loading</span>
    {:then num}
    <span class="badge">In Progress: {num}</span>
    {/await}

    {#await metrics.completed()}
    <span class="badge">Loading</span>
    {:then num}
    <span class="badge status-completed">Completed: {num}</span>
    {/await}

    {#await metrics.canceled()}
    <span class="badge">Loading</span>
    {:then num}
    <span class="badge status-Canceled">Canceled: {num}</span>
    {/await}
  

  
  <table>
      <thead>
          <tr>
              <th>Tickets</th>
              <th>Property</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
          </tr>
      </thead>
      <tbody>
        {#each data as ticket}
          <tr class="status-{ticket.status}" on:click={showTicket(ticket.ticket_name)}>
            <td class="t-text">
              <i class="fa-regular fa-file-lines"></i>
              <p class="ticket-text">{ticket.ticket_name}<br>
                <span class="submit-badge">Submitted by {ticket.tenant}</span></p>
            </td>
            <td>{ticket.address}</td>
            <td>{ticket.category}</td>
            <td>{ticket.priority}</td>
            <td>{ticket.status}</td>
          </tr>
        {/each}
      </tbody>
  </table>

  <a href="/tickets/add">Add Property</a>
  <a href="/tickets/edit">Edit Property</a>


</section>


<style>

  td::first-letter {
    text-transform: capitalize;
  }


.status-pending {
  background-color: rgba(49, 49, 49, 0.15) !important;
}

.status-in {
  background-color: rgba(255, 221, 0, 0.15) !important;
}

.status-completed {
  background-color: rgba(0, 253, 0, 0.15) !important;
}

.status-canceled {
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