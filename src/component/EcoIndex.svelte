<script>
  import Bar from './Chart/Bar.svelte';

  export let reportAggregate = {reports: []};
  let labels = [];
  let data = [];

  for (let report of reportAggregate.reports) {
      labels.push(report.time.toLocaleDateString('fr-FR'));
      data.push(report.ecoIndex);
  }
</script>

<Bar
    data={{
        labels: labels,
        datasets: [
            {
                label: "EcoIndex",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: data
            }
        ]}
    }
    width={500}
    height={250}
    options={{
        responsive: false,
        maintainAspectRatio: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }}
/>
