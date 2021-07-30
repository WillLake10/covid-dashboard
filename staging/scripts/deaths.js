deaths(
    'https://api.coronavirus.data.gov.uk/v1/data?' +
    'filters=areaType=nation;areaName=england&' +
    'structure={' +
    '"date":"date",' +
    '"newDeaths28DaysByDeathDateAgeDemographics":"newDeaths28DaysByDeathDateAgeDemographics"' +
    '}'
);

async function deaths(url) {
    const response = await fetch(url)
    const data = await response.json()
    const deathsData = data.data.reverse()

    console.log(deathsData)

    const datesString = []
    let zeroToSixtyDeaths = []
    let deathsChartDataSet = []
    let zeroToSixtyDeathsChange = []
    let datesString2 = []
    let zeroToSixtyDeathsChangef = []
    let deathsChangeChartDataSet = []
    let deathsChangeLargeChartDataSet = []
    let deathsProportionChartDataSet = []
    let avgDeathsShortDataset = []
    let deathsRateDataSet = []
    let ageDeathsHalfDataset = []
    let totalDeathsByDate = []
    let deathsHalf = [[], [], [], [], [], [], [], []]
    let deathsHalfF = [[], [], [], [], [], [], [], []]
    // let deathsHalfUp = [[], [], [], [], [], [], [], []]
    // let deathsHalfDown = [[], [], [], [], [], [], [], []]
    // let deathsHalfNulled = [[[], []], [[], []], [[], []], [[], []], [[], []], [[], []], [[], []], [[], []]]
    let deathsProportion = [[], [], [], [], [], [], [], []]
    let avgDeathsChangeLarge = [[], [], []]
    let avgDeathsChangef = [[], [], [], [], [], [], []]
    let avgDeathsChange = [[], [], [], [], [], [], []]
    let avgDeathsShort = [[], [], [], [], [], [], []]
    let thisData

    let dailyDeaths = baseArrAv()
    let deathRate = baseArrAv()
    let deathRateF = baseArrAv()
    let avgDeaths = baseArrAv()

    //Create the dates and case ages datasets
    for (let i = 0; i < deathsData.length; i++) {
        const temp = new Date(deathsData[i].date)
        if (temp > new Date("2020-03-01")) {
            datesString.push(temp.getDate() + "-" + (temp.getMonth() + 1))
            for (let j = 0; j < deathsData[i].newDeaths28DaysByDeathDateAgeDemographics.length; j++) {
                for (let k = 0; k < ageBrackets.length; k++) {
                    if (deathsData[i].newDeaths28DaysByDeathDateAgeDemographics[j].age === ageBrackets[k]) {
                        dailyDeaths[k].push(deathsData[i].newDeaths28DaysByDeathDateAgeDemographics[j].deaths)
                        deathRate[k].push(deathsData[i].newDeaths28DaysByDeathDateAgeDemographics[j].rollingRate)
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

    for (let i = deathRate[0].length - howLongBack; i < deathRate[0].length; i++) {
        for (let j = 0; j < deathRate.length; j++) {
            deathRateF[j].push(deathRate[j][i])
        }
    }

    console.log(deathRate)

    for (let i = 0; i < avgDeaths[0].length; i++) {
        let total = 0
        for (let j = 0; j < avgDeaths.length; j++) {
            total = total + avgDeaths[j][i]
        }
        totalDeathsByDate.push(total)
    }

    for (let i = 0; i < 8; i++) {
        if (i === 0) {
            for (let j = 0; j < avgDeaths[i].length; j++) {
                let total = 0
                for (let k = 0; k < 12; k++) {
                    total = total + avgDeaths[k][j]
                }
                deathsProportion[i].push((total / totalDeathsByDate[j]) * 100)
            }
        } else {
            for (let j = 0; j < avgDeaths[i].length; j++) {
                deathsProportion[i].push((avgDeaths[i + 11][j] / totalDeathsByDate[j]) * 100)
            }
        }
    }

    const temp = []

    for (let i = 0; i < 8; i++) {
        if (i === 0) temp.push(zeroToSixtyDeaths)
        else temp.push(avgDeaths[i + 11])
    }

    let halfTimePass = 7
    for (let i = 0; i < temp[0].length; i++) {
        for (let j = 0; j < 8; j++) {
            let half = getHalfRate(temp[j][i], temp[j][i - halfTimePass], halfTimePass)

            deathsHalf[j].push(half)
        }
    }

    for (let i = deathsHalf[0].length - howLongBack; i < deathsHalf[0].length; i++) {
        for (let j = 0; j < deathsHalf.length; j++) {
            let temp = 0
            if (Math.abs(deathsHalf[j][i]) > 70) {
                temp = null
            } else {
                temp = Math.round(deathsHalf[j][i] * 10) / 10
            }
            deathsHalfF[j].push(temp)
        }
    }

    deathsProportion.reverse()

    for (let i = 0; i < 8; i++) {
        let current, temp = [];
        if (i === 0) current = zeroToSixtyDeaths
        else current = avgDeaths[i + 11]
        for (let j = current.length - howLongBack; j < current.length; j++) {
            temp.push(current[j])
        }
        avgDeathsShort[i] = temp
    }


    let deathsHalfUp = [...deathsHalf]
    let deathsHalfDown = [...deathsHalf]

    for (let i = 0; i < deathsHalfF.length; i++) {
        for (let j = 0; j < deathsHalfF[i].length; j++) {
            console.log(deathsHalfF[i][j])
            console.log(i + "," + j)

            // deathsHalfNulled[i][j][0] = null
            // deathsHalfNulled[i][j][1] = null
            if (deathsHalfF[i][j] > 0) {
                // deathsHalfUp[i][j][0] = deathsHalfF[i][j]
                deathsHalfDown[i][j] = null
            } else if (deathsHalfF[i][j] < 0) {
                // deathsHalfDown[i][j][1] = deathsHalfF[i][j]
                deathsHalfUp[i][j] = null
            }

            console.log(deathsHalfUp[i][j])
            console.log(deathsHalfDown[i][j])
        }
    }

    for (let i = 0; i < 8; i++) {
        if (i === 0) thisData = zeroToSixtyDeaths
        else thisData = avgDeaths[i + 11]
        deathsChartDataSet.push(dataSet(ageBracketsUpper[i], 'rgba(0, 0, 0, 0)', chartColours[darkmode][colourSequence][1][i], thisData, 'line'))
        if (i === 0) thisData = zeroToSixtyDeathsChangef
        else thisData = avgDeathsChangef[i - 1]
        deathsChangeChartDataSet.push(dataSet(ageBracketsUpper[i], 'rgba(0, 0, 0, 0)', chartColours[darkmode][colourSequence][1][i], thisData, 'line'))
        ageDeathsHalfDataset.push(dataSet(ageBracketsUpper[i], 'rgba(0, 0, 0, 0)', chartColours[darkmode][colourSequence][1][i], deathsHalfF[i], 'line'))
        // ageDeathsHalfDataset.push(
        //     {
        //         label: ageBracketsUpper[i],
        //         backgroundColor: 'rgba(0, 0, 0, 0)',
        //         borderColor: chartColours[darkmode][colourSequence][1][i],
        //         data: deathsHalfUp[i],//, deathsHalfUp[i]],
        //         type: 'line'
        //     }
        // )
        avgDeathsShortDataset.push(dataSet(ageBracketsUpper[i], 'rgba(0, 0, 0, 0)', chartColours[darkmode][colourSequence][1][i], avgDeathsShort[i], 'line'))
        deathsProportionChartDataSet.push(dataSet(ageBracketsUpper[7 - i], chartColours[darkmode][colourSequence][1][7 - i], '#000000', deathsProportion[i], 'bar'))
    }

    console.log(deathRateF)
    for (let i = 0; i < ageBrackets.length; i++) {
        deathsRateDataSet.push(dataSet(ageBracketsDisplay[i], 'rgba(0, 0, 0, 0)', chartColours[darkmode][colourSequence][0][i], deathRateF[i], 'line'))
    }

    for (let i = 0; i < 4; i++) {
        if (i === 0) thisData = zeroToSixtyDeathsChangef
        else thisData = avgDeathsChangeLarge[i - 1]
        deathsChangeLargeChartDataSet.push(dataSet(ageBracketsUpperLarge[i], 'rgba(0, 0, 0, 0)', chartColours[darkmode][colourSequence][3][i], thisData, 'line'))
    }

    chartWithTag('dailyDeaths', 'line', datesString, deathsChartDataSet)
    chartWithTag('deathsChange', 'line', datesString2, deathsChangeChartDataSet)
    chartWithTag('avgDeathsShort', 'line', datesString2, avgDeathsShortDataset)
    chartWithTag('deathsChangeBands', 'line', datesString2, deathsChangeLargeChartDataSet)
    chartWithTag('deathsChangeHalf', 'line', datesString2, ageDeathsHalfDataset)
    chartWithTag('deathsPer100000', 'line', datesString2, deathsRateDataSet)
    chartWithTag('deathsProportionChart', 'bar', datesString, deathsProportionChartDataSet,
        {scales: {xAxes: [{stacked: true}], yAxes: [{stacked: true, ticks: {beginAtZero: true, min: 0, max: 100}}]}}
    )

    valReturnSet([
        ["howLongBack1", howLongBack.toString()],
        ["howLongBack2", howLongBack.toString()],
        ["howLongBack3", howLongBack.toString()],
        ["howLongBack4", howLongBack.toString()]
    ])
}
