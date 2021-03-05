const vacUrl = (
  'https://api.coronavirus.data.gov.uk/v1/data?' +
  'filters=areaType=overview&' +
  'structure={"date":"date","areaName":"areaName","newVac":"newPeopleVaccinatedFirstDoseByPublishDate","cumVac":"cumPeopleVaccinatedFirstDoseByPublishDate"}'
);

const settings = {"async": true, "crossDomain": true, "url": vacUrl, "method": "GET", "headers": {}};

$.ajax(settings).done(
  function (response) {
    const data = response.data;
    data.reverse()

    //Declare dataset
    const dates = [];
    const datesString = []
    const vac = []
    const vacAvg = [null, null, null, null]
    const vacCum = []
    const dateArray = []

    //Create the dates and vaccine datasets
    for (let i = 0; i < data.length; i++) {
      const temp = new Date(data[i].date)
      dates.push(temp)
      datesString.push(temp.getDate() + "-" + (temp.getMonth() + 1))
      vac.push(data[i].newVac)
      vacCum.push(data[i].cumVac)
    }

    //Create vaccine avrg chart
    for (let i = 7; i < data.length; i++) {
      vacAvg.push(
        Math.round(
          (
            data[i].newVac +
            data[i - 1].newVac +
            data[i - 2].newVac +
            data[i - 3].newVac +
            data[i - 4].newVac +
            data[i - 5].newVac +
            data[i - 6].newVac
          ) / 7
        )
      )
    }

    //Create the projected dates axis
    const currentDate = new Date(dates[dates.length - 1]);
    while (currentDate <= projToDate) {
      currentDate.setDate(currentDate.getDate() + 1);
      dateArray.push(new Date(currentDate));
    }

    while (currentDate <= projToDateMay) {
      currentDate.setDate(currentDate.getDate() + 1);
      dateArray.push(new Date(currentDate));
    }

    let datesProjMay = dates.concat(dateArray)
    let datesProjStringMay = []
    for (let i = 0; i < datesProjMay.length; i++) {
      datesProjStringMay.push(datesProjMay[i].getDate() + "-" + (datesProjMay[i].getMonth() + 1))
    }

    //Project vaccine rates
    let vacProjMay = []
    for (let i = 0; i < vacCum.length; i++) {
      vacProjMay.push(null)
    }

    let l2 = vacProjMay.length
    for (let i = vacProjMay.length; i < datesProjMay.length; i++) {
      if (i === l2) {
        vacProjMay.push(vacCum[vacCum.length - 1] + vacAvg[vacAvg.length - 1])
      } else {
        vacProjMay.push(vacProjMay[vacProjMay.length - 1] + vacAvg[vacAvg.length - 1])
      }
    }

    function getProjMay() {
      return vacProjMay[vacProjMay.length - 1];
    }

    function getPerc() {
      return Math.round((vacCum[vacCum.length - 1] / ukPopulation) * 10000) / 100
    }

    function getPercAdult() {
      return Math.round((vacCum[vacCum.length - 1] / ukAdultPopulation) * 10000) / 100
    }

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function neededSevenDayMay() {
      var short = targetNumberMay - vacCum[vacCum.length - 1]
      var daysToGo = (Math.ceil(Math.abs(projToDateMay - (dates[dates.length - 1])) / (1000 * 60 * 60 * 24))) + 1
      return numberWithCommas(Math.round(short / daysToGo))
    }

    document.getElementById("projVacMay").innerHTML = numberWithCommas(getProjMay());
    document.getElementById("firstDose").innerHTML = numberWithCommas(vacCum[vacCum.length - 1]);
    document.getElementById("percVac").innerHTML = getPerc();
    document.getElementById("percAdultVac").innerHTML = getPercAdult();
    document.getElementById("neededAvgMay").innerHTML = neededSevenDayMay();
    document.getElementById("currentSevenDay").innerHTML = numberWithCommas(vacAvg[vacAvg.length - 1]);
    let vacDailyChart = new Chart(document.getElementById('vaccineNumberToDay').getContext('2d'),
      {
        type: 'bar',
        label: '1st does daily rate',
        data: {
          labels: datesString,
          datasets: [
            {
              label: "7 Day Average",
              backgroundColor: 'rgba(0, 0, 0, 0)',
              borderColor: chartColours[colourSequence][4][2],
              data: vacAvg,
              type: 'line'
            },
            {
              label: "Daily Vaccinations",
              backgroundColor: chartColours[colourSequence][4][3],
              borderColor: 'rgb(0, 0, 0)',
              data: vac
            }
          ]
        },
        options: {scales: {xAxes: [{stacked: true}], yAxes: [{stacked: true, ticks: {beginAtZero: true}}]}}
      }
    );

    let projDatechartMay = new Chart(document.getElementById('projDateMay').getContext('2d'),
      {
        type: 'bar',
        data: {
          labels: datesProjStringMay,
          datasets: [
            {
              label: "Cumulative to date",
              backgroundColor: chartColours[colourSequence][4][1],
              borderColor: 'rgb(0, 0, 0)',
              data: vacCum
            },
            {
              label: "Predicted",
              backgroundColor: chartColours[colourSequence][4][0],
              borderColor: 'rgb(0, 0, 0)',
              data: vacProjMay
            }
          ],
        },
        options: {scales: {xAxes: [{stacked: true}], yAxes: [{stacked: true, ticks: {beginAtZero: true}}]}}
      }
    );
  }
);
