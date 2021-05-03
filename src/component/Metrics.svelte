<script>
  import Base from './Chart/Base.svelte';

  export let reportAggregate = { reports: [] };
  let labels = [];
  let ecoIndex = [];
  let totalWeightInBytes = [];

  for (let report of reportAggregate.reports) {
    labels.push(report.time.toLocaleDateString('fr-FR'));
    ecoIndex.push(report.ecoIndex);
    totalWeightInBytes.push(report.totalWeightInBytes);
  }
</script>

<Base
  type="line"
  data={{
    labels: labels,
    datasets: [
      {
        label: 'Note EcoIndex',
        yAxisID: 'A',
        borderColor: 'rgb(65,144,0)',
        data: ecoIndex,
        fill: false
      },
      {
        label: 'Poids de la page en bytes',
        yAxesGroup: 'B',
        yAxisID: 'B',
        borderColor: 'rgb(99,182,255)',
        data: totalWeightInBytes,
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
        }
      ]
    }
  }}
/>
