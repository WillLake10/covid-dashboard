const deathsURL = (
  'https://api.coronavirus.data.gov.uk/v1/data?' +
  'filters=areaType=nation&' +
  'structure={"date":"date","newDeaths28DaysByDeathDateAgeDemographics":"newDeaths28DaysByDeathDateAgeDemographics"}'
);

const deathsSettings = {"async": true, "crossDomain": true, "url": deathsURL, "method": "GET", "headers": {}};

$.ajax(deathsSettings).done(
  function (res) {
    const data = res.data;
    data.reverse()

    document.getElementById("deathsHowLongBack1").innerHTML = howLongBack.toString();
    document.getElementById("deathsHowLongBack2").innerHTML = howLongBack.toString();

    const datesString = []
    let zeroToSixtyDeaths = []
    let deathsChartDataSet = []
    let zeroToSixtyDeathsChange = []
    let datesString2 = []
    let zeroToSixtyDeathsChangef = []
    let deathsChangeChartDataSet = []
    let deathsChangeLargeChartDataSet = []
    let avgDeathsChangeLarge = [[], [], []]
    let avgDeathsChangef = [[], [], [], [], [], [], []]
    let avgDeathsChange = [[], [], [], [], [], [], []]
    let thisData

    let dailyDeaths = getBaseAgeGroupArray()
    let avgDeaths = getBaseAvgArray()

    //Create the dates and case ages datasets
    for (let i = 0; i < data.length; i++) {
      const temp = new Date(data[i].date)
      if (temp > new Date("2020-08-27")) {
        datesString.push(temp.getDate() + "-" + (temp.getMonth() + 1))
        for (let j = 0; j < data[i].newDeaths28DaysByDeathDateAgeDemographics.length; j++) {
          for (let k = 0; k < ageBrackets.length; k++) {
            if (data[i].newDeaths28DaysByDeathDateAgeDemographics[j].age === ageBrackets[k]) {
              dailyDeaths[k].push(data[i].newDeaths28DaysByDeathDateAgeDemographics[j].deaths)
            }
          }
        }
      }
    }

    for (let i = 0; i < ageBrackets.length; i++) {
      avgDeaths[i] = doAvg(dailyDeaths[i], avgDeaths[i])
    }

    for (let i = 0; i < avgDeaths[0].length; i++) {
      zeroToSixtyDeaths[i] = 0
      for (let j = 0; j <= 11; j++) {
        zeroToSixtyDeaths[i] += avgDeaths[j][i]
      }
    }

    for (let i = 30; i < zeroToSixtyDeaths.length; i++) {
      zeroToSixtyDeathsChange.push(((zeroToSixtyDeaths[i] / zeroToSixtyDeaths[i - 7]) - 1) * 100)
      for (let j = 12; j <= 18; j++) {
        avgDeathsChange[j - 12].push(((avgDeaths[j][i] / avgDeaths[j][i - 7]) - 1) * 100)
      }
    }


    for (let i = zeroToSixtyDeathsChange.length - howLongBack; i < zeroToSixtyDeathsChange.length; i++) {
      zeroToSixtyDeathsChangef.push(zeroToSixtyDeathsChange[i])
      for (let j = 0; j < 7; j++) {
        avgDeathsChangef[j].push(avgDeathsChange[j][i])
      }
    }

    for (let i = datesString.length - howLongBack; i < datesString.length; i++) {
      datesString2.push(datesString[i])
    }

    for (let i = 0; i < zeroToSixtyDeathsChangef.length; i++) {
      avgDeathsChangeLarge[0].push((avgDeathsChangef[0][i] + avgDeathsChangef[1][i]) / 2)
      avgDeathsChangeLarge[1].push((avgDeathsChangef[2][i] + avgDeathsChangef[3][i]) / 2)
      avgDeathsChangeLarge[2].push((avgDeathsChangef[4][i] + avgDeathsChangef[5][i] + avgDeathsChangef[6][i]) / 3)
    }

    for (let i = 0; i < 8; i++) {
      if (i === 0) {
        thisData = zeroToSixtyDeaths
      } else {
        thisData = avgDeaths[i + 11]
      }
      deathsChartDataSet.push(
        {
          label: ageBracketsUpper[i],
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: chartColours[colourSequence][1][i],
          data: thisData
        }
      )
      if (i === 0) {
        thisData = zeroToSixtyDeathsChangef
      } else {
        thisData = avgDeathsChangef[i - 1]
      }
      deathsChangeChartDataSet.push(
        {
          label: ageBracketsUpper[i],
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: chartColours[colourSequence][1][i],
          data: thisData
        }
      )
    }

    for (let i = 0; i < 4; i++) {
      if (i === 0) {
        thisData = zeroToSixtyDeathsChangef
      } else {
        thisData = avgDeathsChangeLarge[i - 1]
      }
      deathsChangeLargeChartDataSet.push(
        {
          label: ageBracketsUpperLarge[i],
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: chartColours[colourSequence][3][i],
          data: thisData
        }
      )
    }

    const deathsChart = new Chart(
      document.getElementById('ageDeathsChart').getContext('2d'),
      {type: 'line', data: {labels: datesString, datasets: deathsChartDataSet}}
    )

    const deathsChangeChart = new Chart(
      document.getElementById('ageDeathsChangeChart').getContext('2d'),
      {type: 'line', data: {labels: datesString2, datasets: deathsChangeChartDataSet}}
    )

    const deathsChangeAgeChart = new Chart(
      document.getElementById('ageDeathsChangeChartAge').getContext('2d'),
      {type: 'line', data: {labels: datesString2, datasets: deathsChangeLargeChartDataSet}}
    )

  }
);
