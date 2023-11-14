<script>
	export let value, label, id;
	
</script>



<label> 
  <p class={value?'above':'center'}>{label}</p>
  <textarea bind:value={value} name="description" {id} cols="30" rows="10"></textarea>
</label>



<style>
	
  .above, .center {
    position: absolute;
    transform: translateY(-50%);
    pointer-events: none;
    color: black;
    border-radius: 5px ;
    font-size: 1em;
    margin: 0;
    transition: all .5s ease;
  }

  .above {
    background: black;
    color: white;
    top: 0;
    left: 24px;
    font-size: .7em;
    padding: 2px 6px;
  }

  .center{
		color: rgba(0, 0, 0, 0.7);
    top: 10%;
    left: 10px;
    border: 1px solid transparent;
    opacity: 1;
  }

  label {
		display: block;
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 10px;
		width: 100%;
		margin-bottom: 1em;
  }

  label:focus-within {
    border: 1px solid black;
  }

  textarea {
    border: none;
    background: transparent;
    color: black;
    padding: .8em;
    font-size: 1.2em;
    width: 96%;
  }

  textarea:focus{
    border: none;
    outline: none;
  }
</style>