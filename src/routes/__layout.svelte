<svelte:head>
  <title>Outil de mesure et de suivi de Territoires en Transition</title>
</svelte:head>

<h1>Outil de mesure et de suivi de Territoires en Transition</h1>

<hr />

<slot></slot>

<style>
:global(body) {
  font-family: Arial , -apple-system, system-ui, BlinkMacSystemFont, Helvetica, sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 25px;
}

:global(h2, h3, h4, b) {
  font-weight:bold;
}

:global(a:link) {
  text-decoration: underline;
}

:global(a[href^="http"]:after) {
  content:"\2197";
  display: inline-block;
  position: relative;
  margin-left: .2em;
}

:global(button) {
 cursor: pointer;
 display: inline-block;
 border: none;
 color: hsl(0,0%,45%);
}

:global(button:hover) {
 color: hsl(0,0%,85%);
}

</style>
