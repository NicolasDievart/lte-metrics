<script>
  import Base from './Chart/Base.svelte';

  export let reportAggregate = { reports: [] };
  let hasMimeTypeGraph = false;
  let labels = [];
  let domElementsCounts = [];
  let greenhouseGasesEmissions = [];
  let waterConsumptions = [];
  let totalWeightInBytes = [];

  for (let report of reportAggregate.reports) {
    labels.push(report.time.toLocaleDateString('fr-FR'));
    domElementsCounts.push(report.domElementsCount);
    greenhouseGasesEmissions.push(report.greenhouseGasesEmission);
    waterConsumptions.push(report.waterConsumption);
    totalWeightInBytes.push(report.totalWeightInBytes);
  }
</script>

<Base
  type="line"
  data={{
    labels: labels,
    datasets: [
      {
        label: 'Nombre d\'élément du DOM',
        yAxisID: 'A',
        borderColor: 'rgb(65,144,0)',
        data: domElementsCounts,
        fill: false
      },
      {
        label: 'Poids de la page en bytes',
        yAxesGroup: 'B',
        yAxisID: 'B',
        borderColor: 'rgb(137,0,0)',
        data: totalWeightInBytes,
        fill: false
      },
      {
        label: 'Consommation d\'eau en cl',
        yAxesGroup: 'C',
        yAxisID: 'C',
        borderColor: 'rgb(99,182,255)',
        data: waterConsumptions,
        fill: false
      },
      {
        label: 'emission de Gaz à effet de serre',
        yAxesGroup: 'D',
        yAxisID: 'D',
        borderColor: 'rgb(0,0,0)',
        data: greenhouseGasesEmissions,
        fill: false
      }
    ]
  }}
  width={500}
  height={250}
  options={{
    responsive: false,
    maintainAspectRatio: true,
    scales: {
      yAxes: [
        {
          id: 'A',
          name: 'A',
          type: 'linear',
          position: 'left',
          scalePositionLeft: true,
          ticks: {
            beginAtZero: true
          }
        },
        {
          id: 'B',
          name: 'B',
          type: 'linear',
          position: 'right',
          scalePositionLeft: false,
          ticks: {
            beginAtZero: true
          }
        },
        {
          id: 'C',
          name: 'C',
          type: 'linear',
          position: 'left',
          scalePositionLeft: false,
          ticks: {
            beginAtZero: true
          }
        },
        {
          id: 'D',
          name: 'D',
          type: 'linear',
          position: 'right',
          scalePositionLeft: false,
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }}
/>

{#if hasMimeTypeGraph}
  <Base
    type="line"
    data={{
      labels: labels,
    }}
    width={500}
    height={250}
  />
{/if}
