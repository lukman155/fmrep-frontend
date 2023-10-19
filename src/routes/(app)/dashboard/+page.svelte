<script>
  import Tabs from "./Tabs.svelte";

</script>


<section>
  <div class="title">
    <h1>Above Apartments</h1>
    <p>No. 4, Sambisa Street,</p>
  </div>

  <div class="row">
    <div class="column v-line">
      <h2>Property Overview</h2>
      <p>Detailed Information about property.</p>
      
      <hr>

      <div class="img-con">
        <img src="pics/house.jpg" alt="">
      </div>
      <div class="status-container">
        <Tabs />
      </div>
    </div>

   

    



    <div class="column">
      <h2>Property Activity</h2>
      
    </div>


</section>


<style>

  hr {
    margin: 1em 0 1.5em 0;
    border-color: #00000010  }

  .img-con {
    width: 100%;
    
    max-height: auto;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5%;
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
    padding: 1em;
    border-bottom: 1px solid rgba(0,0,0,.1);
    margin: 0 2em 2em 2em;
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