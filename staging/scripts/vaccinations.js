vaccine(
    'https://api.coronavirus.data.gov.uk/v1/data?' +
    'filters=areaType=overview&' +
    'structure={' +
    '"date":"date",' +
    '"newPeopleVaccinatedFirstDoseByPublishDate":"newPeopleVaccinatedFirstDoseByPublishDate",' +
    '"cumPeopleVaccinatedFirstDoseByPublishDate":"cumPeopleVaccinatedFirstDoseByPublishDate",' +
    '"newPeopleVaccinatedSecondDoseByPublishDate":"newPeopleVaccinatedSecondDoseByPublishDate",' +
    '"cumPeopleVaccinatedSecondDoseByPublishDate":"cumPeopleVaccinatedSecondDoseByPublishDate"' +
    '}'
);

async function vaccine(url) {
    const response = await fetch(url)
    const data = await response.json()
    const vacData = data.data.reverse()

    const firstDose = [], firstDoseCum = [], secondDose = [], secondDoseCum = [], datesString = [], cumFirstMinusSecond = [], remainingPop = []

    for (let i = 0; i < vacData.length; i++) {
        const temp = new Date(vacData[i].date)
        datesString.push(temp.getDate() + "-" + (temp.getMonth() + 1))
        firstDose.push(vacData[i].newPeopleVaccinatedFirstDoseByPublishDate)
        firstDoseCum.push(vacData[i].cumPeopleVaccinatedFirstDoseByPublishDate)
        secondDose.push(vacData[i].newPeopleVaccinatedSecondDoseByPublishDate)
        secondDoseCum.push(vacData[i].cumPeopleVaccinatedSecondDoseByPublishDate)
        cumFirstMinusSecond.push(vacData[i].cumPeopleVaccinatedFirstDoseByPublishDate - vacData[i].cumPeopleVaccinatedSecondDoseByPublishDate)
        remainingPop.push(ukAdultPopulation - vacData[i].cumPeopleVaccinatedFirstDoseByPublishDate)
    }

    let firstDoseAvg = doAvg(firstDose, [null, null, null, null])
    let secondDoseAvg = doAvg(secondDose, [null, null, null, null])

    let firstDoseCumShift = []
    let secondDoseCumShift = []

    for (let i = 0; i < 7*11; i++){
        firstDoseCumShift.push(null)
    }
    for (let  i =0; i < firstDoseCum.length; i++){
        firstDoseCumShift.push(firstDoseCum[i])
    }

    for (let i = 0; i < 7*11; i++){
        firstDoseCumShift.push(null)
    }
    for (let  i =  7*11; i < secondDoseCum.length; i++){
        secondDoseCumShift.push(secondDoseCum[i])
    }

    let bothDoseAvg = [null, null, null, null]
    for(let i = 0; i < firstDoseAvg.length; i++){
        bothDoseAvg.push(firstDoseAvg[i+4] + secondDoseAvg[i+4])
    }

    let dailyFirstDoseDataset = dataSet("Daily First Dose", chartColours[darkmode][colourSequence][4][3], 'rgb(0, 0, 0)', firstDose, 'bar')
    let dailySecondDoseDataset = dataSet("Daily Second Dose", chartColours[darkmode][colourSequence][4][3], 'rgb(0, 0, 0)', secondDose, 'bar')
    let dailySecondDoseRedDataset = dataSet("Daily Second Dose", chartColours[darkmode][colourSequence][1][2], 'rgb(0, 0, 0)', secondDose, 'bar')
    let avgFirstDoseDataset = dataSet("First Dose 7 Day Average", 'rgba(0, 0, 0, 0)', chartColours[darkmode][colourSequence][4][2], firstDoseAvg, 'line')
    let avgSecondDoseDataset = dataSet("Second Dose 7 Day Average", 'rgba(0, 0, 0, 0)', chartColours[darkmode][colourSequence][4][2], secondDoseAvg, 'line')
    let avgBothDoseDataset = dataSet("Second Dose 7 Day Average", 'rgba(0, 0, 0, 0)', chartColours[darkmode][colourSequence][4][2], bothDoseAvg, 'line')
    let cumFirstDoseDataset = dataSet("Cumulative First Dose", chartColours[darkmode][colourSequence][4][3], 'rgb(0, 0, 0)', firstDoseCum, 'bar')
    let cumSecondDoseDataset = dataSet("Cumulative Second Dose", chartColours[darkmode][colourSequence][1][2], 'rgb(0, 0, 0)', secondDoseCum, 'bar')
    let cumSecondDoseDatasetShift = dataSet("Cumulative Second Dose", chartColours[darkmode][colourSequence][1][2], 'rgb(0, 0, 0)', secondDoseCumShift, 'bar')
    let cumFirstMinSecondDoseDataset = dataSet("Cumulative First Dose Only", chartColours[darkmode][colourSequence][4][3], 'rgb(0, 0, 0)', cumFirstMinusSecond, 'bar')
    let unVacPopDataset = dataSet("Un-vaccinated Population", chartColours[darkmode][0][0][6], 'rgb(0, 0, 0)', remainingPop, 'bar')


    chartWithTag('firstDoseDaily', 'bar', datesString, [avgFirstDoseDataset, dailyFirstDoseDataset],
        {
            scales: {
                xAxes: [{stacked: true, gridLines: {display: true, color: chartStyleColours[darkmode][0]}}],
                yAxes: [{
                    stacked: true,
                    ticks: {beginAtZero: true},
                    gridLines: {display: true, color: chartStyleColours[darkmode][0]}
                }]
            }
        }
    )

    chartWithTag('secondDoseDaily', 'bar', datesString, [avgSecondDoseDataset, dailySecondDoseDataset],
        {
            scales: {
                xAxes: [{stacked: true, gridLines: {display: true, color: chartStyleColours[darkmode][0]}}],
                yAxes: [{
                    stacked: true,
                    ticks: {beginAtZero: true},
                    gridLines: {display: true, color: chartStyleColours[darkmode][0]}
                }]
            }
        }
    )

    chartWithTag(
        'bothDosesDaily', 'bar', datesString, [avgBothDoseDataset, dailyFirstDoseDataset, dailySecondDoseRedDataset],
        {
            scales: {
                xAxes: [{stacked: true, gridLines: {display: true, color: chartStyleColours[darkmode][0]}}],
                yAxes: [{
                    stacked: true,
                    ticks: {beginAtZero: true},
                    gridLines: {display: true, color: chartStyleColours[darkmode][0]}
                }]
            }
        }
    )

    chartWithTag(
        'bothDosesCumSubSecond', 'bar', datesString, [cumSecondDoseDataset, cumFirstMinSecondDoseDataset],
        {
            scales: {
                xAxes: [{stacked: true, gridLines: {display: true, color: chartStyleColours[darkmode][0]}}],
                yAxes: [{
                    stacked: true,
                    ticks: {beginAtZero: true},
                    gridLines: {display: true, color: chartStyleColours[darkmode][0]}
                }]
            }
        }
    )

    chartWithTag(
        'bothDosesCumSubSecond2', 'bar', datesString, [cumSecondDoseDatasetShift, cumFirstDoseDataset],
        // {
        //     scales: {
        //         xAxes: [{stacked: true, gridLines: {display: true, color: chartStyleColours[darkmode][0]}}],
        //         yAxes: [{
        //             ticks: {beginAtZero: true},
        //             gridLines: {display: true, color: chartStyleColours[darkmode][0]}
        //         }]
        //     }
        // }
    )

    chartWithTag(
        'bothDosesCum', 'bar', datesString, [cumFirstDoseDataset, cumSecondDoseDataset],
        {
            scales: {
                xAxes: [{stacked: true, gridLines: {display: true, color: chartStyleColours[darkmode][0]}}],
                yAxes: [{
                    stacked: true,
                    ticks: {beginAtZero: true},
                    gridLines: {display: true, color: chartStyleColours[darkmode][0]}
                }]
            }
        }
    )

    chartWithTag(
        'percentPop', 'bar', datesString, [cumSecondDoseDataset, cumFirstMinSecondDoseDataset, unVacPopDataset],
        {
            scales: {
                xAxes: [{stacked: true, gridLines: {display: true, color: chartStyleColours[darkmode][0]}}],
                yAxes: [{
                    stacked: true,
                    ticks: {beginAtZero: true},
                    gridLines: {display: true, color: chartStyleColours[darkmode][0]}
                }]
            }
        }
    )

    valReturnSet([
        ['firstDose', numberWithCommas(firstDoseCum[firstDoseCum.length - 1])],
        ['percFirstDose', Math.round((firstDoseCum[firstDoseCum.length - 1] / ukPopulation) * 10000) / 100],
        ['percAdultFirstDose', Math.round((firstDoseCum[firstDoseCum.length - 1] / ukAdultPopulation) * 10000) / 100],
        ['currentSevenDayFirstDose', numberWithCommas(Math.round(firstDoseAvg[firstDoseAvg.length - 1]))],
        ['secondDose', numberWithCommas(secondDoseCum[secondDoseCum.length - 1])],
        ['percSecondDose', Math.round((secondDoseCum[secondDoseCum.length - 1] / ukPopulation) * 10000) / 100],
        ['percAdultSecondDose', Math.round((secondDoseCum[secondDoseCum.length - 1] / ukAdultPopulation) * 10000) / 100],
        ['currentSevenDaySecondDose', numberWithCommas(Math.round(secondDoseAvg[secondDoseAvg.length - 1]))]
    ])
}
