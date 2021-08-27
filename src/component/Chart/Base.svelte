<script>
  import { onMount, afterUpdate, onDestroy } from 'svelte';
  import { clean } from '../../utils/utils';
  import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    CategoryScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
  } from 'chart.js/dist/chart.esm';

  Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    CategoryScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
  );

  export let data = {
    labels: [],
    datasets: [{ data: [] }],
    yMarkers: {},
    yRegions: []
  };
  export let type = 'line';
  export let options = {};

  let chart = null;
  let chartRef;
  let props = clean($$props, ['data', 'type', 'options']);

  onMount(() => {
    chart = new Chart(chartRef, {
      type,
      data,
      options
    });
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
