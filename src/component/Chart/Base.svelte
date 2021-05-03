<script>
  import { onMount, afterUpdate, onDestroy } from 'svelte';
  import Chart from 'chart.js';
  import { clean } from '../../utils/utils';

  export let data = {
    labels: [],
    datasets: [{ values: [] }],
    yMarkers: {},
    yRegions: []
  };
  export let type = 'line';
  export let options = {};
  export let plugins = {};

  let chart = null;
  let chartRef;
  let props = clean($$props, ['data', 'type', 'options', 'plugins']);

  onMount(() => {
    chart = new Chart(chartRef, {
      type,
      data,
      options,
      plugins
    });
    console.log(chart);
  });

  afterUpdate(() => {
    if (!chart) return;
    chart.update();
  });

  onDestroy(() => {
    chart = null;
  });
</script>

<canvas bind:this={chartRef} {...props} />
