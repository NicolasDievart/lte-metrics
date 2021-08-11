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

<svelte:head>
  <title>Indicateurs du projet LTE</title>
</svelte:head>

<h1>Outil de mesure et de suivi de Territoires en Transition</h1>

<hr />
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

<hr />

<ul>
  {#each Array.from(map.values()) as reportAggregate}
    <li>
      <h2><a href={reportAggregate.url} target="_blank">{reportAggregate.url}</a></h2>
      <Metrics {reportAggregate} {performanceReport} {domRequestReport} {weightReport} />
    </li>
  {/each}
</ul>

<style>

body {
 font-family:Arial , -apple-system, system-ui, BlinkMacSystemFont, Helvetica, sans-serif;;
 font-weight:400;
 font-size:15px;
 line-height:25px;
}

h2 {
  font-weight:bold;
}

h3 {
  font-size:21px;
  font-weight:bold;
  margin-bottom: 0.5rem;
}

h4 {
  font-weight: bold;
  color:hsl(0,0%,45%);
}

b {
  font-weight: bold;
}

a:link {
  text-decoration: underline;
}
a[href^="top"] {
  text-decoration: none;
}
a[href^="http"]:after {
  content:"\2197";
  display: inline-block;
  position: relative;
  margin-left: .2em;
}

[id] {
  scroll-margin-top: 2rem;
}

button {
 cursor:pointer;
 display:inline-block;
 border:none;
 color:hsl(0,0%,45%);
}
button:hover {
 color:hsl(0,0%,85%);
}

/*
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
*/

</style>
