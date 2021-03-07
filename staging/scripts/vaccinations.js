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

    const firstDose = [], firstDoseCum = [], secondDose = [], secondDoseCum = [], datesString = []

    for (let i = 0; i < vacData.length; i++) {
        const temp = new Date(vacData[i].date)
        datesString.push(temp.getDate() + "-" + (temp.getMonth() + 1))
        firstDose.push(vacData[i].newPeopleVaccinatedFirstDoseByPublishDate)
        firstDoseCum.push(vacData[i].cumPeopleVaccinatedFirstDoseByPublishDate)
        secondDose.push(vacData[i].newPeopleVaccinatedSecondDoseByPublishDate)
        secondDoseCum.push(vacData[i].cumPeopleVaccinatedSecondDoseByPublishDate)
    }

    let firstDoseAvg = doAvg(firstDose, [null, null, null, null])
    let secondDoseAvg = doAvg(secondDose, [null, null, null, null])

    let dailyFirstDoseDataset = dataSet("Daily First Dose", chartColours[colourSequence][4][3], 'rgb(0, 0, 0)', firstDose, 'bar')
    let dailySecondDoseDataset = dataSet("Daily Second Dose", chartColours[colourSequence][4][3], 'rgb(0, 0, 0)', secondDose, 'bar')
    let dailySecondDoseRedDataset = dataSet("Daily Second Dose", chartColours[colourSequence][4][2], 'rgb(0, 0, 0)', secondDose, 'bar')
    let avgFirstDoseDataset = dataSet("First Dose 7 Day Average", 'rgba(0, 0, 0, 0)', chartColours[colourSequence][4][2], firstDoseAvg, 'line')
    let avgSecondDoseDataset = dataSet("Second Dose 7 Day Average", 'rgba(0, 0, 0, 0)', chartColours[colourSequence][4][2], secondDoseAvg, 'line')
    let cumFirstDoseDataset = dataSet("Cumulative First Dose", chartColours[colourSequence][4][3], 'rgb(0, 0, 0)', firstDoseCum, 'bar')
    let cumSecondDoseDataset = dataSet("Cumulative Second Dose", chartColours[colourSequence][4][2], 'rgb(0, 0, 0)', secondDoseCum, 'bar')


    chartWithTag('firstDoseDaily', 'bar', datesString, [avgFirstDoseDataset, dailyFirstDoseDataset],
        {scales: {xAxes: [{stacked: true}], yAxes: [{stacked: true, ticks: {beginAtZero: true}}]}})

    chartWithTag('secondDoseDaily', 'bar', datesString, [avgSecondDoseDataset, dailySecondDoseDataset],
        {scales: {xAxes: [{stacked: true}], yAxes: [{stacked: true, ticks: {beginAtZero: true}}]}})

    chartWithTag(
        'bothDosesDaily', 'bar', datesString, [dailyFirstDoseDataset, dailySecondDoseRedDataset],
        {scales: {xAxes: [{stacked: true}], yAxes: [{stacked: true, ticks: {beginAtZero: true}}]}}
    )

    chartWithTag(
        'bothDosesCum', 'bar', datesString, [cumFirstDoseDataset, cumSecondDoseDataset],
        {scales: {xAxes: [{stacked: true}], yAxes: [{stacked: true, ticks: {beginAtZero: true}}]}}
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
