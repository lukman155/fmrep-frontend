<script>
	export let value, id, label, type = 'text';
  export let required = false;
	
	function typeAction(node){
		node.type = type;
	}

  $: hasError = required && !value; 

</script>


<label>
  <p class={value?'above':'center'}>{label}</p>
	<input use:typeAction class="input" bind:value={value} 
  placeholder={value} 
  {id} 
  {required} aria-invalid={hasError}/>
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
    top: 50%;
    left: 12px;
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

input {
    border: none;
    background: transparent;
    color: black;
    padding: .8em;
    font-size: 1em;
    width: 96%;

  }

input:focus{
    border: none;
    outline: none;
  }

</style>
