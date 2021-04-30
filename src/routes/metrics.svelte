<script>
  import EcoIndex from '../component/EcoIndex.svelte';

  import data from './../../report.json';

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
              greenITGrade: report['greentITGrade']
            }
          ]
        });

        return;
      }

      aggregateReport.reports.push({
        time: new Date(parseInt(timestamp, 10)),
        url: report['url'],
        ecoIndex: report['ecoIndex'],
        greenITGrade: report['greentITGrade']
      });
    });
  }
</script>

<h1>Metrics du projet LTE</h1>

<ul>
  {#each Array.from(map.values()) as reportAggregate}
    <li>
      <h2>{reportAggregate.url}</h2>
      <EcoIndex reportAggregate={reportAggregate} />
    </li>
  {/each}
</ul>
