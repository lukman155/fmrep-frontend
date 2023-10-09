


<section>
  <div class="title">
    <h1>Properties</h1>
    <p>Manage all your Properties</p>
  </div>

  <h2>Properties</h2>
  <p class="badge">12 Properties Listed</p>

  
  <table>
      <thead>
          <tr>
            <th>Property</th>
              <th>Tenant</th>
              <th>Building Type</th>
              <th>Lease Term</th>
          </tr>
      </thead>
      <tbody>
        <tr>
          <td class="t-text">
            <div class="img-con">
              <img src="pics/house.jpg" alt="prop-image">
            </div>
            <p class="ticket-text">Above Apartments<br>
              <span class="submit-badge">No. 5, Sandscript Avenue</span></p>
          </td>
          <td>Mr Dennis</td>
          <td>2 Bedroom Ensuite</td>
          <td>1 Year</td>
      </tr>

      </tbody>
  </table>

</section>


<style>
    .img-con {
    width: 100px;
    height: auto;

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
    min-width: 800px;
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