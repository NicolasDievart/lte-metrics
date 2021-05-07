class Report {
  url;
  previousUrl = null;
  refactoringDoneAt = null;
  index;

  // Lighthouse metrics.
  firstMeaningfulPaint;
  timeToInteractive;

  // Ecoindex metrics.
  greenhouseGasesEmission;
  ecoIndex;
  greentITGrade;
  waterConsumption;

  // Yellowlabtools metrics.
  totalWeightInBytes;
  weightByMimeTypes;
  totalRequest;
  domElementsCount;
  domElementsCountScore;
  cachingNotSpecified;
  cachingDisabled;
  cachingTooShort;

  constructor(url, index) {
    this.url = url;
    this.index = index;
    this.weightByMimeTypes = [];
  }

  addMimeTypeWeight(WeightByMimeType) {
    this.weightByMimeTypes.push(WeightByMimeType);
  }
}

export default Report;
