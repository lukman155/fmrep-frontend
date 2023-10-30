<script>
	export let value, label, type = 'text';
	
	function typeAction(node){
		node.type = type;
	}
</script>


<label>
  <p class={value?'above':'center'}>{label}</p>
	<input use:typeAction class="input" bind:value={value} placeholder={value}/>
</label>
