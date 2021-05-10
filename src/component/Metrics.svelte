<script>
  import Base from './Chart/Base.svelte';

  export let performanceReport = true;
  export let domRequestReport = false;
  export let weightReport = false;

  const fileTypeColorMapping = {
    'js': {
        fill: 'rgba(255,130,130,0.73)',
        stroke: 'rgb(255,0,0)',
      },
    'html': {fill: 'rgba(255,226,94,0.61)', stroke: 'rgb(255,214,0)'},
    'css': {fill: 'rgba(94,255,255,0.62)', stroke: 'rgba(0,255,255,0.64)'},
    'json': {fill: 'rgba(192,163,255,0.61)', stroke: 'rgb(140,91,255)'},
    'image': {fill: 'rgba(246,107,255,0.62)', stroke: 'rgb(238,0,255)'},
    'video': {fill: 'rgba(255,255,255,0.61)', stroke: 'rgb(255,255,255)'},
    'webfont': {fill: 'rgba(255,153,104,0.62)', stroke: 'rgb(255,83,0)'},
    'other': {fill: 'rgba(203,203,203,0.6)', stroke: 'rgb(151,151,151)'},
  }
  export let reportAggregate = { reports: [] };
  let labels = [];
  let domElementsCounts = [];
  let totalRequests = [];
  let totalWeightInBytes = [];
  let firstMeaningfulPaints = [];
  let timeToInteractives = [];
  let weightByTypesReport = new Map();

  for (let report of reportAggregate.reports) {
    labels.push(report.time.toLocaleDateString('fr-FR'));
    domElementsCounts.push(report.domElementsCount);
    totalRequests.push(report.totalRequest);
    totalWeightInBytes.push(report.totalWeightInBytes);
    firstMeaningfulPaints.push(report.firstMeaningfulPaint);
    timeToInteractives.push(report.timeToInteractive);

    for (let weightByMimeType of report.weightByMimeTypes) {
      if (!weightByTypesReport.has(weightByMimeType.mimeType)) {
        weightByTypesReport.set(weightByMimeType.mimeType, createDatasetForWeightType(weightByMimeType.mimeType));
      }

      let weightByTypeReport = weightByTypesReport.get(weightByMimeType.mimeType);
      weightByTypeReport.data.push(weightByMimeType.weight);
    }
  }

  weightByTypesReport.forEach((value, key) => {
    if (value.data.filter((v) => v > 0).length === 0) {
      weightByTypesReport.delete(key);
    }
  })

  function createDatasetForWeightType(type) {
    return {
      label: type,
      yAxisID: 'weight',
      backgroundColor: fileTypeColorMapping[type].fill,
      pointBackgroundColor: fileTypeColorMapping[type].stroke,
      pointHighlightStroke: fileTypeColorMapping[type].stroke,
      borderColor: fileTypeColorMapping[type].stroke,
      data: [],
      fill: true
    }
  }
</script>

<div style="float: left;">
  {#if performanceReport}
  <Base
    type="line"
    data={{
      labels: labels,
      datasets: [
        {
          label: 'First Meaningful Paint (en secondes)',
          yAxisID: 'performance',
          borderColor: 'rgb(65,144,0)',
          data: firstMeaningfulPaints,
          fill: true
        },
        {
          label: 'Time to interactive (en secondes)',
          yAxesGroup: 'performance',
          yAxisID: 'performance',
          borderColor: 'rgb(201,0,0)',
          data: timeToInteractives,
          fill: true
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
            id: 'performance',
            name: 'performance',
            type: 'linear',
            position: 'left',
            scalePositionLeft: true,
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }}
  />
  {/if}

  {#if domRequestReport}
  <Base
    type="line"
    data={{
      labels: labels,
      datasets: [
        {
          label: 'Nombre d\'élément du DOM',
          yAxisID: 'dom',
          borderColor: 'rgb(0,94,144)',
          data: domElementsCounts,
          fill: true
        },
        {
          label: 'Nombre de requête',
          yAxisID: 'request',
          borderColor: 'rgb(0,0,0)',
          data: totalRequests,
          fill: true
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
            id: 'dom',
            name: 'dom',
            type: 'linear',
            position: 'left',
            scalePositionLeft: true,
            ticks: {
              beginAtZero: true
            }
          },
          {
            id: 'request',
            name: 'request',
            type: 'linear',
            position: 'right',
            scalePositionLeft: true,
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }}
  />
  {/if}

  {#if weightReport}
    <Base
      type="line"
      data={{
        labels: labels,
        datasets: [...weightByTypesReport.values()]
      }}
      width={500}
      height={250}
      options={{
        responsive: false,
        maintainAspectRatio: true,
        scales: {
          yAxes: [
            {
              id: 'weight',
              name: 'weight',
              type: 'linear',
              position: 'left',
              stacked: true,
              scalePositionLeft: true,
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }}
    />
  {/if}
</div>
