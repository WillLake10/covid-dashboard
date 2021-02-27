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
    let caseChangeBands = [[], [], [], [], []]

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

    console.log(rate)

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
  }
);
