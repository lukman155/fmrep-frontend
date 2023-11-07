<script>
	import Button from './../../../../lib/components/Button.svelte';
	import Link from './../../../../lib/components/Link.svelte';
	import { userAuth, x } from './../../../../store/authStore.js';
  import { addDoc, collection, doc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
  import { db } from "../../../../lib/firebase/firebase";
	import ProgressBar from './ProgressBar.svelte';
  import Form from './Form.svelte';


	let steps = ['Category', 'Details', 'Confirmation'];
  let currentActive = 1;
  let progressBar;
	
	const handleProgress = (stepIncrement) => {
		progressBar.handleProgress(stepIncrement)
	}


  let y = $x;
  
  let selectedStatus = 'Pending';
  let ticket_name = 'Ticket'+ ' ' + y ;
  let address = "no" + ' ' + y;
  let category = "category" + ' ' + y;
  let priority = "high";
  let loading = false;
  let error = false;
  let userData = $userAuth;

  const statusOptions = [
    'Pending',
    'In Progress',
    'Completed',
    'Canceled',
  ];


  const newProp = async() => {
    const docData = {
      ticket_name,
      address,
      category,
      priority,
      createdAt: Timestamp.now(),
      tenant_uid:userData.uid,
      status:selectedStatus.toLowerCase(),
    };
    
    await addDoc(collection(db, "tickets"), docData);
    console.log("Document written");
    history.back()
    x.update((x) => x + 1)
  };

</script>

<section>

<div class="back">
  <Link to="/tickets" text='Back' />
</div>

  <ProgressBar {steps} bind:currentActive bind:this={progressBar}/>
      
  <Form active_step={steps[currentActive-1]}/>

  <div class="step-button">
    <button class="btn" on:click={() => handleProgress(-1)} disabled={currentActive == 1}>Prev</button>
    <button class="btn" on:click={() => handleProgress(+1)} disabled={currentActive == steps.length}>Next</button>
  </div>
  

</section>

<style>
  section {
    padding: 1em 2em;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .back {
    align-self: flex-start;
  }

  .btn {
    padding:5px 14px;
    margin: 20px 5px;
    display: inline-block;
    color: black;
    text-decoration: none;
    font-size: 14px;
    border-radius: 10px;
    border: 2px solid rgba(0, 0, 0, 0.2);
  }


  .btn:hover {
    color: rgb(30, 63, 29);
    border: 2px solid #499c4881;
  }

  .btn:disabled {
    background: lightgrey;
    color: rgb(30, 63, 29);
    
  }
  .btn:hover:disabled {
    background: lightgrey;
    color: rgb(30, 63, 29);
    border: 2px solid rgba(0, 0, 0, 0.2);

    
  }
</style>

