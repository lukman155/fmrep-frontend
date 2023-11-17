<script>
	import { goto } from '$app/navigation';
  
</script>

<div class="home-page">
  <div class="white-con">
    <div class="logo">
      <img src="./favicon.png" alt="logo" >
    </div>
  </div>
  
<div class="about">
  <h1>Welcome to FMRepEX</h1>
  <p>
    At FMRepex, we're on a mission to transform the way you manage your facilities. Our cutting-edge platform empowers you with the tools and insights you need to streamline operations, enhance efficiency, and optimize costs. Whether you're responsible for a single building or a sprawling campus, FMRepex is your key to unlocking a new era of facility management.
  </p>
  <div class="links">
    <a href="/login" class="login button">Login</a>
    <a href="#about" class="about1 button">About</a>
  </div>
  
</div> 
</div>
<style>

  .button:hover {
    border-color: #4b0000;
    color: #4b0000;
  }
  .about1.button:hover {
    background-color: #4b0000;
    border-color: #4b0000;
    color: white;

  }

  .links {
    display: flex;
    gap: 10px;
  }
.white-con {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
  .about1.button {
     border: 5px solid white;
    /* background-color: white; */
    text-decoration: none;
    padding: .5em 1em;
    font-weight: 700;
    width: 4em;
    font-size: 1.2em;
    text-align: center;
    color: #4A9C48;
    border-radius: 1.5em;
    background-color: white;
  }

  p {
    margin-bottom: 2em;
  }

  .button {
    border: 5px solid white;
    text-decoration: none;
    padding: .5em 1em;
    display: block;
    font-weight: 700;
    width: 4em;
    font-size: 1.2em;
    text-align: center;
    color: white;
    border-radius: 1.5em;
    margin-bottom:.5em ;

  }

  h1 {
    margin: 0;
    margin-bottom: 1em;
  }
  .home-page {
    display: flex;
    color: white;
    flex-direction: column;
    overflow: hidden;
  }

  .home-page > div {
    flex: 1 1 50%;
    margin: 0;
  }

  .logo {
    width: 180px;
    height: 180px
  }

  .logo > img {
    width: 100%;

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

  @media (min-width: 700px){
    .home-page {
      flex-direction: row;
      height: 100%;
    }
  }
</style>
