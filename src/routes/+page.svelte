<script>
	import { goto } from '$app/navigation';
  
</script>

<div class="home-page">
  <div class="logo">
    <img src="./favicon.png" alt="logo" >
  </div>
<div class="about">
  <h1>Welcome to FMRepEX</h1>
  <p>
    At FMRepex, we're on a mission to transform the way you manage your facilities. Our cutting-edge platform empowers you with the tools and insights you need to streamline operations, enhance efficiency, and optimize costs. Whether you're responsible for a single building or a sprawling campus, FMRepex is your key to unlocking a new era of facility management.
  </p>
  <div class="links">
    <a href="/login" class="login button">Login</a>
    <a href="#about" class="login button">About</a>
  </div>
  
</div> 
</div>

<style>

  p {
    margin-bottom: 2em;
  }

  .button {
    border: 5px solid white;
    /* background-color: white; */
    text-decoration: none;
    padding: .8em 1.5em;
    font-weight: 700;
    width: 4em;
    font-size: 1.2em;
    text-align: center;
    color: white;
    border-radius: 1.5em;

  }

  h1 {
    margin: 0;
    margin-bottom: 1em;
  }
  .home-page {
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .home-page > div {
    flex: 1 1 50%;
    margin: 0;
  }

  .logo {
    display: flex;
    justify-content: center;
    
  }



  .about {
    margin-top: 40px;
    background-color: #4A9C48;
    height: 100%;
    width: 100%;
    display: flex;
justify-content: center;   
flex-direction: column;
padding: 0 2rem;
  }
</style>
