<script>
  import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
  import { goto } from '$app/navigation'
  import { userAuth } from "../store/authStore";

  let email = '';
  let password = '';
  let confirmPass = '';
  let error = false;
  let errorMsg;
  let register = false;
  let authenticating = false;

  const auth = getAuth();

  async function handleAuthenticate(){
    error = false
    if (authenticating){
      return;
    }

    if(!email || !password || (register && !confirmPass)) {
      errorMsg = 'The information you have entered is incorrect'
      error = true;
      return;
    }

    if (register && password !== confirmPass){
      errorMsg = 'Passwords do not match';
      error = true;
      return;
    }

    authenticating = true;

    try {
      if (!register) {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            $userAuth = userCredential.user;
            document.cookie = `isLoggedIn=true; max-age=3600`;
            goto('/dashboard')
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
      } else {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            $userAuth = userCredential.user
            document.cookie = `isLoggedIn=true; max-age=3600`;
            goto('/dashboard')
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
      }
    } catch (err) {
      console.log('There was an auth error', err);
      error = true;
      errorMsg = err;
      authenticating = false;
    }

  }


  const handleRegister = () => {
    register = !register;
  }


</script>

<section class="authContainer">
  <form>
    <h1>{register? 'Register' : 'Login'}</h1>
    
    {#if error}
    <p class="error">{errorMsg}</p>
    {/if}

    <label>
      <p class={email?'above':'center'}>Email</p>
      <input bind:value={email} type="email" placeholder="Email" />
    </label>

    <label>
      <p class={password?'above':'center'}>Password</p>
      <input bind:value={password} type="password" placeholder="Password" />
    </label>

    {#if register}

      <label>
        <p class={confirmPass?'above':'center'}>Confirm Password</p>
        <input bind:value={confirmPass} type="password" placeholder="Confirm Password" />
      </label>

    {/if}
    
    <button on:submit={handleAuthenticate} on:click={handleAuthenticate} class="submit-btn">
      {#if error}
      Try Again
      {:else if authenticating}
        <i class="fa-solid fa-spinner spin"></i>
      {:else}
        Submit
      {/if}
    </button>
  </form>

  <div class="options">
    <p>Or</p>

    {#if register}
      <div>
        <p>Already have an account?</p>
        <p on:click={handleRegister}>Login</p>
      </div>
    {:else}
    <div>
      <p>Don't have have an account?</p>
      <p on:click={handleRegister}>Register</p>
    </div>
    {/if}
  </div>

</section>

<style>
  .submit-btn {
    display: grid;
    place-items: center;

  }

  .spin {
    animation: spin 1s linear infinite
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .options > div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5em;
  }

  .options div p:last-of-type {
    color: rgb(0, 0, 0);
    font-weight: 700;
    cursor: pointer;
    text-decoration: underline;
    transition: all .5s ease-in-out;
  }

  .options div p:last-of-type:hover {
    text-underline-offset: 5px;
  }

  form, .options {
    width: 400px;
    max-width: 100%;
    margin: 0 auto;
  }

  .options {
    padding: 1em 0;
    overflow: hidden;
    font-size: .9em;
    display: flex;
    flex-direction: column;
    gap: .6em;

  }

  p{
    margin: 0;
  }
  .options > p {
    position: relative;
    text-align: center;
    width: fit-content;
    margin: 0 auto;
    padding: 0 .5em;
  }

  .options > p::after, .options > p::before {
    content: '';
    position: absolute;
    top: 50%;
    width: 100vw;
    height: 1.5px;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .options > p::after{
    right: 100%;
  }

  .options > p::before{
    left: 100%;
  }

  .error {
    color: coral;
    font-size: 0.9em;
    text-align: center;
    position: absolute;
    top: -2em;
    right: 50%;
    width: 100%;
    transform: translateX(50%);
  }

  .above, .center {
    position: absolute;
    transform: translateY(-50%);
    pointer-events: none;
    color: black;
    border-radius: 5px ;
    padding: 2px 6px;
    font-size: .8em;
    margin: 0;
    transition: all .5s ease;
  }

  .above {
    background: black;
    color: white;
    top: 0;
    left: 24px;
    font-size: .7em;
  }

  .center{
    top: 50%;
    left: 1em;
    border: 1px solid transparent;
    opacity: 0;
  }

  form button {
    background-color: rgb(255, 255, 255);
    color: rgb(0, 0, 0);
    padding: .8em 0;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.2em;
  }

  form button:hover {
    background-color: black;
    color: white;
  }
  .authContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 1em;
    height: 80vh;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  form label {
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  form label:focus-within {
    border: 1px solid black;
  }

  form input {
    width: 100%;
    border: none;
    background: transparent;
    color: black;
    padding: .8em;
    font-size: 1.2em;
  }

  form input:focus{
    border: none;
    outline: none;
  }

  h1 {
    font-size: 3em;
    text-align: center;
  }

</style>