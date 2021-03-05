const casesUrl = (
  'https://api.coronavirus.data.gov.uk/v1/data?' +
  'filters=areaType=' + getCookie("areaType") + ';areaName=' + getCookie("areaName") + '&' +
  'structure={"date":"date","newCasesBySpecimenDateAgeDemographics":"newCasesBySpecimenDateAgeDemographics"}'
);

const caseSettings = {"async": true, "crossDomain": true, "url": casesUrl, "method": "GET", "headers": {}};

$.ajax(caseSettings).done(
  function (response) {
    const data = response.data;
    data.reverse()

    document.getElementById("casesHowLongBack1").innerHTML = howLongBack.toString();
    document.getElementById("casesHowLongBack2").innerHTML = howLongBack.toString();
    // document.getElementById("casesHowLongBack3").innerHTML = howLongBack.toString();

    const datesString = []
    let datesString2c = []
    let caseChangeBandDataset = []
    let casesChangeChartDataset = []
    let ageCasesChartDataset = []
    let ageCasesRateChartDataset = []
    let caseProportionChartDataSet = []
    let caseChangeBands = [[], [], [], [], []]
    let totalCasesByDate = []

    let avg = getBaseAvgArray()
    let daily = getBaseAgeGroupArray()
    let rate = getBaseAgeGroupArray()
    let ratef = getBaseAgeGroupArray()
    let caseChange = getBaseAgeGroupArray()
    let caseChangef = getBaseAgeGroupArray()

    for (let i = 0; i < data.length; i++) {
      const temp = new Date(data[i].date)
      if (temp > new Date("2020-08-27")) {
        datesString.push(temp.getDate() + "-" + (temp.getMonth() + 1))
        for (let j = 0; j < data[i].newCasesBySpecimenDateAgeDemographics.length; j++) {
          for (let k = 0; k < ageBrackets.length; k++) {
            if (data[i].newCasesBySpecimenDateAgeDemographics[j].age === ageBrackets[k]) {
              daily[k].push(data[i].newCasesBySpecimenDateAgeDemographics[j].cases)
              rate[k].push(data[i].newCasesBySpecimenDateAgeDemographics[j].rollingRate)
            }
          }
        }
      }
    }

    for (let i = 0; i < ageBrackets.length; i++) {
      avg[i] = doAvg(daily[i], avg[i])
    }

    for (let i = 30; i < avg[0].length; i++) {
      for (let j = 0; j <= 18; j++) {
        caseChange[j].push(((avg[j][i] / avg[j][i - 7]) - 1) * 100)
      }
    }

    for (let i = caseChange[0].length - howLongBack; i < caseChange[0].length; i++) {
      for (let j = 0; j < caseChange.length; j++) {
        caseChangef[j].push(caseChange[j][i])
      }
    }

    for (let i = rate[0].length - howLongBack; i < rate[0].length; i++) {
      for (let j = 0; j < rate.length; j++) {
        ratef[j].push(rate[j][i])
      }
    }

    for (let i = datesString.length - howLongBack; i < datesString.length; i++) {
      datesString2c.push(datesString[i])
    }

    for (let i = 0; i < caseChangef[0].length; i++) {
      caseChangeBands[0].push((caseChangef[0][i] + caseChangef[1][i] + caseChangef[2][i] + caseChangef[3][i]) / 4)
      caseChangeBands[1].push((caseChangef[4][i] + caseChangef[5][i] + caseChangef[6][i] + caseChangef[7][i]) / 4)
      caseChangeBands[2].push((caseChangef[8][i] + caseChangef[9][i] + caseChangef[10][i] + caseChangef[11][i]) / 4)
      caseChangeBands[3].push((caseChangef[12][i] + caseChangef[13][i] + caseChangef[14][i] + caseChangef[15][i]) / 4)
      caseChangeBands[4].push((caseChangef[16][i] + caseChangef[17][i] + caseChangef[18][i]) / 3)
    }

    let caseProportion = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]

    for (let i = 0; i < avg[0].length; i++) {
      let total = 0
      for (let j = 0; j < avg.length; j++) {
        total = total + avg[j][i]
      }
      totalCasesByDate.push(total)
    }

    for (let i = 0; i < avg.length; i++) {
      for (let j = 0; j < avg[0].length; j++) {
        caseProportion[i].push((avg[i][j] / totalCasesByDate[j]) * 100)
      }
    }

    caseProportion.reverse()

    for (let i = 0; i < ageBrackets.length; i++) {
      casesChangeChartDataset.push(
        {
          label: ageBracketsDisplay[i],
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: chartColours[colourSequence][0][i],
          data: caseChangef[i]
        }
      )
      ageCasesChartDataset.push(
        {
          label: ageBracketsDisplay[i],
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: chartColours[colourSequence][0][i],
          data: avg[i]
        }
      )
      ageCasesRateChartDataset.push(
        {
          label: ageBracketsDisplay[i],
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: chartColours[colourSequence][0][i],
          data: ratef[i]
        }
      )
      caseProportionChartDataSet.push(
        {
          label: ageBracketsDisplay[18-i],
          backgroundColor: chartColours[colourSequence][0][18-i],
          borderColor: '#000000',
          data: caseProportion[i]
        }
      )
    }

    for (let i = 0; i < ageBracketsTwentys.length; i++) {
      caseChangeBandDataset.push(
        {
          label: ageBracketsTwentys[i],
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: chartColours[colourSequence][2][i],
          data: caseChangeBands[i]
        }
      )
    }

    const ageCasesChart = new Chart(
      document.getElementById('ageCasesChart').getContext('2d'),
      {type: 'line', data: {labels: datesString, datasets: ageCasesChartDataset}}
    );

    const caseChangeChart = new Chart(
      document.getElementById('caseChange').getContext('2d'),
      {type: 'line', data: {labels: datesString2c, datasets: casesChangeChartDataset}}
    );

    const caseChangeBandsChart = new Chart(document.getElementById('caseChangeBands').getContext('2d'),
      {type: 'line', data: {labels: datesString2c, datasets: caseChangeBandDataset}}
    );

    const caseRateBandsChart = new Chart(document.getElementById('caseRate').getContext('2d'),
      {type: 'line', data: {labels: datesString2c, datasets: ageCasesRateChartDataset}}
    );

    const caseProportionChart = new Chart(
      document.getElementById('caseProportionChart').getContext('2d'),
      {
        type: 'bar', data: {labels: datesString, datasets: caseProportionChartDataSet},
        options: {
          scales: {
            xAxes: [{stacked: true}],
            yAxes: [{stacked: true, ticks: {beginAtZero: true, min: 0, max: 100}}]
          }
        }
      }
    )

    var options = {
      series: [{
        name: 'PRODUCT A',
        data: caseProportion[0]
      }, {
        name: 'PRODUCT B',
        data: caseProportion[1]
      }, {
        name: 'PRODUCT C',
        data: caseProportion[2]
      }],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        stackType: '100%'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }],
      xaxis: {
        categories: datesString,
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'right',
        offsetX: 0,
        offsetY: 50
      },
      colors: chartColours[colourSequence][0]
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  }
);
