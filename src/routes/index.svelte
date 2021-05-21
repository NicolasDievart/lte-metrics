<script>
  import data from './../../report.json';
  import Metrics from '../component/Metrics.svelte';

  let map = new Map();
  let performanceReport = true;
  let domRequestReport = false;
  let weightReport = false;

  for (const [timestamp, reports] of Object.entries(data)) {
    reports.forEach((report) => {
      const url = report['url'];
      let aggregateReport = map.get(url);

      if (!aggregateReport) {
        map.set(url, {
          url: url,
          reports: [createAggregateFromReport(report, timestamp)]
        });

        return;
      }

      aggregateReport.reports.push(createAggregateFromReport(report, timestamp));
    });
  }

  function createAggregateFromReport(report, timestamp) {
    return {
      time: new Date(parseInt(timestamp, 10)),
      url: report['url'],
      ecoIndex: report['ecoIndex'],
      domElementsCount: report['domElementsCount'],
      weightByMimeTypes: report['weightByMimeTypes'],
      totalWeightInBytes: report['totalWeightInBytes'],
      timeToInteractive: report['timeToInteractive'],
      firstMeaningfulPaint: report['firstMeaningfulPaint'],
      totalRequest: report['totalRequest']
    };
  }

  function switchPerformanceReport() {
    performanceReport = !performanceReport;
  }
  function switchDomRequestReport() {
    domRequestReport = !domRequestReport;
  }
  function switchWeightReport() {
    weightReport = !weightReport;
  }
</script>

<h1>Metrics du projet LTE</h1>

<hr />
<h2>Sélectionner les indicateurs :</h2>
<input type="checkbox" name="indicator-performance" id="indicator-performance" on:change={switchPerformanceReport} checked/>
<label for="indicator-performance">La performance au chargement</label>

<input type="checkbox" name="indicator-weight" id="indicator-weight" on:change={switchWeightReport}>
<label for="indicator-weight">La décomposition du poids des éléments</label>

<input type="checkbox" name="indicator-dom-request" id="indicator-dom-request" on:change={switchDomRequestReport}/>
<label for="indicator-dom-request">Le DOM et les requêtes</label>

<hr />

<ul>
  {#each Array.from(map.values()) as reportAggregate}
    <li>
      <h2><a href="{reportAggregate.url}" target="_blank">{reportAggregate.url}</a></h2>
      <Metrics {reportAggregate} {performanceReport} {domRequestReport} {weightReport} />
    </li>
  {/each}
</ul>
