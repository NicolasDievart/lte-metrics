<script>
  import urlsFile from './../../urls.json';
  import data from './../../report.json';
  import Metrics from '../component/Metrics.svelte';

  let map = new Map();
  let mapArchive = new Map();
  let performanceReport = true;
  let domRequestReport = false;
  let greenITReport = false;
  let weightReport = false;
  const urls = urlsFile.urls;

  for (const [timestamp, reports] of Object.entries(data)) {
    reports.forEach((report) => {
      const url = report['url'];

      let mapToUse = !urls.includes(url) ? mapArchive : map;
      setMapData(mapToUse, url, timestamp, report);
    });
  }

  function setMapData(map, url, timestamp, report) {
    let aggregateReport = map.get(url);

    if (!aggregateReport) {
      map.set(url, {
        url: url,
        reports: [createAggregateFromReport(report, timestamp)]
      });

      return;
    }

    aggregateReport.reports.push(createAggregateFromReport(report, timestamp));
  }

  function createAggregateFromReport(report, timestamp) {
    return {
      time: new Date(parseInt(timestamp, 10)),
      url: report['url'],
      ecoIndex: report['ecoIndex'],
      waterConsumption: report['waterConsumption'],
      greenhouseGasesEmission: report['greenhouseGasesEmission'],
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
  function switchGreenITReport() {
    greenITReport = !greenITReport;
  }
</script>

<h2>Sélectionner les indicateurs :</h2>
<input
  type="checkbox"
  name="indicator-performance"
  id="indicator-performance"
  on:change={switchPerformanceReport}
  checked
/>
<label for="indicator-performance">La performance au chargement</label>

<input
  type="checkbox"
  name="indicator-weight"
  id="indicator-weight"
  on:change={switchWeightReport}
/>
<label for="indicator-weight">La décomposition du poids des éléments</label>

<input
  type="checkbox"
  name="indicator-dom-request"
  id="indicator-dom-request"
  on:change={switchDomRequestReport}
/>
<label for="indicator-dom-request">Le DOM et les requêtes</label>

<input
  type="checkbox"
  name="indicator-greenit"
  id="indicator-greenit"
  on:change={switchGreenITReport}
/>

<label for="indicator-greenit">Emission de gaz à effet de serre et Consommation d'eau</label>

<hr />

<ul>
  {#each Array.from(map.values()) as reportAggregate}
    <li>
      <h2><a href={reportAggregate.url} target="_blank">{reportAggregate.url}</a></h2>
      <Metrics
        {reportAggregate}
        {performanceReport}
        {domRequestReport}
        {weightReport}
        {greenITReport}
      />
    </li>
  {/each}
</ul>

<hr />
<h3>Archives</h3>

<ul>
  {#each Array.from(mapArchive.values()) as reportAggregate}
    <li>
      <h2><a href={reportAggregate.url} target="_blank">{reportAggregate.url}</a></h2>
      <Metrics
        {reportAggregate}
        {performanceReport}
        {domRequestReport}
        {weightReport}
        {greenITReport}
      />
    </li>
  {/each}
</ul>

<style>
  [id] {
    scroll-margin-top: 2rem;
  }

  a,
  a:visited,
  a:hover,
  a:active,
  a:focus,
  a:active:hover {
    cursor: pointer;
    font-style: inherit;
    color: inherit;
  }
</style>
