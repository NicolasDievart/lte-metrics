<script>
  import { LineChart, StackedAreaChart } from "@carbon/charts-svelte";

  export let performanceReport = true;
  export let domRequestReport = false;
  export let weightReport = false;

  export let reportAggregate = { reports: [] };
  let performanceReportDataChart = [];
  let domRequestReportDataChart = [];
  let weightByTypesDataChart = [];

  for (let report of reportAggregate.reports) {
    performanceReportDataChart.push({
      "date": report.time,
      "value": report.firstMeaningfulPaint,
      "group": "First Meaningful Paints"
    });
    performanceReportDataChart.push(
      {
        "date": report.time,
        "value": report.timeToInteractive,
        "group": "Time to Interactives"
      }
    );

    domRequestReportDataChart.push({
      "date": report.time,
      "domElementsCount": report.domElementsCount,
      "group": "Nombre d'élément du DOM"
    });
    domRequestReportDataChart.push({
      "date": report.time,
      "totalRequest": report.totalRequest,
      "group": "Nombre de requête"
    });

    for (let weightByMimeType of report.weightByMimeTypes) {
      if (weightByMimeType.weight === 0) {
        continue;
      }

      weightByTypesDataChart.push({
        date: report.time,
        group: weightByMimeType.mimeType,
        value: weightByMimeType.weight
      });
    }
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/@carbon/charts/styles.min.css"
  />
</svelte:head>

<div style="display: flex; flex-direction: row; justify-content: flex-start; flex-wrap: wrap;">
  {#if performanceReport}
    <LineChart
      data={performanceReportDataChart}
      options={{
        title: "La performance au chargement",
        height: "400px",
        curve: "curveMonotoneX",
        axes: {
          left: { mapsTo: "value", scaleType: "linear"},
          bottom: {
            "scaleType": "time",
            "mapsTo": "date"
          },
        },
        color: {
          scale: {
            'First Meaningful Paints': '#419000FF',
            'Time to Interactives': '#C90000FF',
          }
        },
      }}
    />
  {/if}

  {#if weightReport}
    <StackedAreaChart
      data={weightByTypesDataChart}
      options={{
        title: 'La décomposition du poids des éléments',
        height: "400px",
        curve: "curveMonotoneX",
        axes: {
          left: { mapsTo: "value", scaleType: "linear"},
          bottom: {
            "scaleType": "time",
            "mapsTo": "date"
          },
        },
        color: {
          scale: {
            'js': '#FF0000FF',
            'html': '#FFD600FF',
            'css': '#00FFFFA3',
            'json': '#8C5BFFFF',
            'image': '#EE00FFFF',
            'video': '#FFFFFFFF',
            'webfont': '#FF5300FF',
            'other': '#979797FF',
          }
        },
      }}
    />
  {/if}

  {#if domRequestReport}
    <LineChart
      data={domRequestReportDataChart}
      options={{
        title: "Le DOM et les requêtes",
        height: "400px",
        curve: "curveMonotoneX",
        axes: {
          left: {
            title: 'Nombre d\'élément du DOM',
            mapsTo: "domElementsCount",
            scaleType: "linear",
            correspondingDatasets: [
              'Nombre d\'élément du DOM'
            ]
          },
          bottom: {
            "scaleType": "time",
            "mapsTo": "date"
          },
          right: {
            title: 'Nombre de requête',
            mapsTo: 'totalRequest',
            correspondingDatasets: [
              'Nombre de requête'
            ]
          }
        },
        comboChartTypes: [
          {
            type: "line",
            correspondingDatasets: [
              'Nombre d\'élément du DOM'
            ]
          },
          {
            type: "line",
            options: {
              points: {
                enabled: true
              }
            },
            correspondingDatasets: [
              'Nombre de requête'
            ]
          }
        ],
        color: {
          scale: {
            'Nombre d\'élément du DOM': '#005E90FF',
            'Nombre de requête': '#000',
          }
        },
        timeScale: {
          addSpaceOnEdges: 0
        },
      }}
    />
  {/if}
</div>
