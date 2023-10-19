


<section>
  <div class="title">
    <h1>Tickets</h1>
    <p>Manage all your Properties Maintenance Tickets</p>
  </div>

  <h2>Maintenance Tickets</h2>
  <p class="badge">10 Active Tickets</p>

  
  <table>
      <thead>
          <tr>
              <th>Tickets</th>
              <th>Property</th>
              <th>Category</th>
              <th>Priority</th>
          </tr>
      </thead>
      <tbody>
        <tr>
          <td class="t-text">
            <i class="fa-regular fa-file-lines"></i>
            <p class="ticket-text">Ticket 2<br>
              <span class="submit-badge">Submitted by Dennis</span></p>
          </td>
          <td>Property A</td>
          <td>Category 2</td>
          <td>Medium</td>
      </tr>
      <tr>
        <td class="t-text">
          <i class="fa-regular fa-file-lines"></i>
          <p class="ticket-text">Ticket 2<br>
            <span class="submit-badge">Submitted by Dennis</span></p>
        </td>
        <td>Property B</td>
        <td>Category 2</td>
        <td>Medium</td>
    </tr>
    <tr>
      <td class="t-text">
        <i class="fa-regular fa-file-lines"></i>
        <p class="ticket-text">Ticket 2<br>
          <span class="submit-badge">Submitted by Dennis</span></p>
      </td>
      <td>Property C</td>
      <td>Category 2</td>
      <td>Medium</td>
  </tr>

      </tbody>
  </table>

</section>


<style>
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