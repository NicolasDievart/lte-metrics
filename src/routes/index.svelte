<script>
  import data from './../../report.json';
  import Metrics from '../component/Metrics.svelte';

  let map = new Map();

  for (const [timestamp, reports] of Object.entries(data)) {
    reports.forEach((report) => {
      const url = report['url'];
      let aggregateReport = map.get(url);

      if (!aggregateReport) {
        map.set(url, {
          url: url,
          reports: [
            {
              time: new Date(parseInt(timestamp, 10)),
              url: url,
              ecoIndex: report['ecoIndex'],
              domElementsCount: report['domElementsCount'],
              greenhouseGasesEmission: report['greenhouseGasesEmission'],
              waterConsumption: report['waterConsumption'],
              weightByMimeTypes: report['weightByMimeTypes'],
              greenITGrade: report['greentITGrade'],
              totalWeightInBytes: report['totalWeightInBytes']
            }
          ]
        });

        return;
      }

      aggregateReport.reports.push({
        time: new Date(parseInt(timestamp, 10)),
        url: report['url'],
        ecoIndex: report['ecoIndex'],
        domElementsCount: report['domElementsCount'],
        greenhouseGasesEmission: report['greenhouseGasesEmission'],
        waterConsumption: report['waterConsumption'],
        weightByMimeTypes: report['weightByMimeTypes'],
        greenITGrade: report['greentITGrade'],
        totalWeightInBytes: report['totalWeightInBytes']
      });
    });
  }
</script>

<h1>Metrics du projet LTE</h1>

<ul>
  {#each Array.from(map.values()) as reportAggregate}
    <li>
      <h2>{reportAggregate.url}</h2>
      <Metrics {reportAggregate} />
    </li>
  {/each}
</ul>
