<script>
  export let text = "Button";
  export let clickHandler;
	
  let className = ''; 
  export {className as class}

  // const formatToHTMLStyleFromObject = (styleObj) => {
  //     return Object.entries(style).reduce((acc, [key, value]) => `${acc} ${key}: ${value};`, '');
  // };

  // $: styleHTML = formatToHTMLStyleFromObject(style);
  

  function handleClick() {
    if (clickHandler) {
      clickHandler();
    }
  }
</script>

<button class={className} on:click={handleClick}>{text}</button>

<style>
  button {
    padding: 10px 20px;
    display: inline-block;
    color: black;
    text-decoration: none;
    font-size: 14px;
    padding: 10px;
    border-radius: 10px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    
  }

  button:hover {
    color: rgb(30, 63, 29);
    border: 2px solid #499c4881;
    transform: scale(1.05);
  }
</style>