cases(
    'https://api.coronavirus.data.gov.uk/v1/data?' +
    'filters=areaType=' + getCookie("areaType") + ';areaName=' + getCookie("areaName") + '&' +
    'structure={' +
    '"date":"date",' +
    '"newCasesBySpecimenDateAgeDemographics":"newCasesBySpecimenDateAgeDemographics"' +
    '}'
);

async function cases(url) {
    const response = await fetch(url)
    const data = await response.json()
    const caseData = data.data.reverse()

    const casesDatesString = [], datesStringHowLong = [], caseChangeBands = [[], [], [], [], []], caseTotal = []

    const dailyCases = getBaseAgeGroupArray(), caseRate = getBaseAgeGroupArray(), casesAvg = getBaseAvgArray(),
        caseChange = getBaseAgeGroupArray(), caseChangef = getBaseAgeGroupArray(), caseHalf = getBaseAgeGroupArray(),
        caseHalfF = getBaseAgeGroupArray(), caseRateF = getBaseAgeGroupArray(), caseProportion = getBaseAgeGroupArray()

    const ageCasesChartDataset = [], ageCasesChangeDataset = [], caseChangeBandDataset = [], ageCasesHalfDataset = [],
        ageCasesRateChartDataset = []

    for (let i = 0; i < caseData.length; i++) {
        const temp = new Date(caseData[i].date)
        if (temp > new Date("2020-08-27")) {
            casesDatesString.push(temp.getDate() + "-" + (temp.getMonth() + 1))
            for (let j = 0; j < caseData[i].newCasesBySpecimenDateAgeDemographics.length; j++) {
                for (let k = 0; k < ageBrackets.length; k++) {
                    if (caseData[i].newCasesBySpecimenDateAgeDemographics[j].age === ageBrackets[k]) {
                        dailyCases[k].push(caseData[i].newCasesBySpecimenDateAgeDemographics[j].cases)
                        caseRate[k].push(caseData[i].newCasesBySpecimenDateAgeDemographics[j].rollingRate)
                    }
                }
            }
        }
    }

    for (let i = casesDatesString.length - howLongBack; i < casesDatesString.length; i++) {
        datesStringHowLong.push(casesDatesString[i])
    }


    console.log(dailyCases)

    for (let i = 0; i < dailyCases[0].length; i++){
        let total = 0;
        for (let j = 0; j < ageBrackets.length; j++){
            total += dailyCases[j][i]
        }
        caseTotal.push(total)
    }


    for (let i = 0; i < ageBrackets.length; i++) {
        casesAvg[i] = doAvg(dailyCases[i], casesAvg[i])
        ageCasesChartDataset.push(dataSet(ageBracketsDisplay[i], 'rgba(0, 0, 0, 0)', chartColours[darkmode][colourSequence][0][i], casesAvg[i], 'line'))
    }

    for (let i = caseRate[0].length - howLongBack; i < caseRate[0].length; i++) {
        for (let j = 0; j < caseRate.length; j++) {
            caseRateF[j].push(caseRate[j][i])
        }
    }

    let halfTimePass = 7
    for (let i = 0; i < casesAvg[0].length; i++) {
        for (let j = 0; j <= 18; j++) {
            let half = getHalfRate(casesAvg[j][i], casesAvg[j][i - halfTimePass], halfTimePass)
            if (Math.abs(half) > 70) half = null
            caseHalf[j].push(half)
            caseChange[j].push(((casesAvg[j][i] / casesAvg[j][i - 7]) - 1) * 100)
        }
    }

    for (let i = caseChange[0].length - howLongBack; i < caseChange[0].length; i++) {
        for (let j = 0; j < caseChange.length; j++) {
            caseChangef[j].push(caseChange[j][i])
            caseHalfF[j].push(caseHalf[j][i])
        }
    }

    for (let i = 0; i < caseChangef[0].length; i++) {
        caseChangeBands[0].push((caseChangef[0][i] + caseChangef[1][i] + caseChangef[2][i] + caseChangef[3][i]) / 4)
        caseChangeBands[1].push((caseChangef[4][i] + caseChangef[5][i] + caseChangef[6][i] + caseChangef[7][i]) / 4)
        caseChangeBands[2].push((caseChangef[8][i] + caseChangef[9][i] + caseChangef[10][i] + caseChangef[11][i]) / 4)
        caseChangeBands[3].push((caseChangef[12][i] + caseChangef[13][i] + caseChangef[14][i] + caseChangef[15][i]) / 4)
        caseChangeBands[4].push((caseChangef[16][i] + caseChangef[17][i] + caseChangef[18][i]) / 3)
    }


    for (let i = 0; i < ageBrackets.length; i++) {
        ageCasesChangeDataset.push(dataSet(ageBracketsDisplay[i], 'rgba(0, 0, 0, 0)', chartColours[darkmode][colourSequence][0][i], caseChangef[i], 'line'))
        ageCasesHalfDataset.push(dataSet(ageBracketsDisplay[i], 'rgba(0, 0, 0, 0)', chartColours[darkmode][colourSequence][0][i], caseHalfF[i], 'line'))
        ageCasesRateChartDataset.push(dataSet(ageBracketsDisplay[i], 'rgba(0, 0, 0, 0)', chartColours[darkmode][colourSequence][0][i], caseRateF[i], 'line'))
    }

    for (let i = 0; i < ageBracketsTwentys.length; i++) {
        caseChangeBandDataset.push(dataSet(ageBracketsTwentys[i], 'rgba(0, 0, 0, 0)', chartColours[darkmode][colourSequence][2][i], caseChangeBands[i], 'line'))
    }

    chartWithTag('dailyCases', 'line', casesDatesString, ageCasesChartDataset)
    chartWithTag('casesChange', 'line', datesStringHowLong, ageCasesChangeDataset, {
        scales: {
            xAxes: [{gridLines: {display: true, color: chartStyleColours[darkmode][0]}}],
            yAxes: [{
                ticks: {min: -55, max: 55}, gridLines: {
                    display: true,
                    color: chartStyleColours[darkmode][0],
                    zeroLineColor: chartStyleColours[darkmode][1],
                    zeroLineWidth: 2
                }
            }]
        }
    })
    chartWithTag('casesChangeBands', 'line', datesStringHowLong, caseChangeBandDataset)
    chartWithTag('casesChangeHalf', 'line', datesStringHowLong, ageCasesHalfDataset)
    chartWithTag('casesPer100000', 'line', datesStringHowLong, ageCasesRateChartDataset)
    chartWithTag('casesProportionChart', 'bar', casesDatesString,  caseProportionChartDataSet,
        {scales: {xAxes: [{stacked: true}], yAxes: [{stacked: true, ticks: {beginAtZero: true, min: 0, max: 100}}]}}
    )
    valReturnSet([
        ["howLongBack1", howLongBack.toString()],
        ["howLongBack2", howLongBack.toString()],
        ["howLongBack3", howLongBack.toString()],
        ["howLongBack4", howLongBack.toString()]
    ])
}
