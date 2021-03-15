deaths(
    'https://api.coronavirus.data.gov.uk/v1/data?' +
    'filters=areaType=nation;areaName=england&' +
    'structure={' +
    '"date":"date",' +
    '"newDeaths28DaysByDeathDate":"newDeaths28DaysByDeathDate",' +
    '"newCasesBySpecimenDate":"newCasesBySpecimenDate"}'
);

async function deaths(url) {
    const response = await fetch(url)
    const data = await response.json()
    const caseDeathsData = data.data.reverse()

    const cases = [], deaths = [], datesString = []
    let casesAvg = [null, null, null, null]
    let deathsAvg = [null, null, null, null]
    let deathcase = []

    console.log(caseDeathsData)

    for (let i = 0; i < caseDeathsData.length - 4; i++) {
        const temp = new Date(caseDeathsData[i].date)
        datesString.push(temp.getDate() + "-" + (temp.getMonth() + 1))
        cases.push(caseDeathsData[i].newCasesBySpecimenDate)
        if (i >= 14) {
            deaths.push(caseDeathsData[i].newDeaths28DaysByDeathDate)
        }
    }

    casesAvg = doAvg(cases, casesAvg)
    deathsAvg = doAvg(deaths, deathsAvg)

    for (let i = 0; i < casesAvg.length; i++) {
        if (i < 70) {
            deathcase.push(null)
        } else {
            deathcase.push(deathsAvg[i] / casesAvg[i])
        }
    }

    const howManyDays = 100

    const deathcaseShort = [], dateShort = []
    for (let i = deathcase.length - howManyDays; i < deathcase.length; i++) {
        deathcaseShort.push(deathcase[i] * 100)
        if (i < deathcase.length - 13) {
        }
        dateShort.push(datesString[i])
    }

    console.log(deathsAvg)

    let caseDeathDataset = dataSet("Cumulative Second Dose", 'rgba(0, 0, 0, 0)', chartColours[darkmode][colourSequence][4][2], deathcase, 'line')
    // console.log(caseDeathDataset)
    // chartWithTag('caseDeathDiff', 'line', datesString, caseDeathDataset)

    new Chart(
        document.getElementById('caseDeathDiff').getContext('2d'),
        {
            type: 'line',
            data: {
                labels: dateShort,
                datasets: [{
                    label: 'Percent Deaths from Cases',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: chartColours[darkmode][colourSequence][4][2],
                    data: deathcaseShort,
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        stacked: true,
                        gridLines: {display: true, color: chartStyleColours[darkmode][0]}
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {beginAtZero: true},
                        gridLines: {display: true, color: chartStyleColours[darkmode][0]}
                    }]
                }
            }
        });


    new Chart(
        document.getElementById("caseDeathChart").getContext('2d'),
        {
            type: 'line',
            data: {
                labels: datesString,
                datasets: [{
                    label: "Cases",
                    borderColor: chartColours[darkmode][colourSequence][4][0],
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    type: 'line',
                    data: casesAvg,
                    yAxisID: "y-axis-1",
                }, {
                    label: "Deaths",
                    borderColor: chartColours[darkmode][colourSequence][4][1],
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    type: 'line',
                    data: deathsAvg,
                    yAxisID: "y-axis-2"
                }]
            },
            options: {
                responsive: true,
                hoverMode: 'index',
                stacked: false,
                scales: {
                    yAxes: [
                        {
                            type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                            display: true,
                            position: "left",
                            id: "y-axis-1",
                            scaleLabel: {
                                display: true,
                                labelString: 'Cases',
                                fontSize: 20
                            },
                            gridLines: {display: true, color: chartStyleColours[darkmode][0]}
                        }, {
                            type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                            display: true,
                            position: "right",
                            id: "y-axis-2",
                            ticks: {min: 0, max: 1500},
                            scaleLabel: {
                                display: true,
                                labelString: 'Deaths',
                                fontSize: 20
                            },
                            // grid line settings
                            gridLines: {
                                drawOnChartArea: false, // only want the grid lines for one axis to show up
                                display: true,
                                color: chartStyleColours[darkmode][0]
                            },
                        }
                    ],
                    xAxes: [{gridLines: {display: true, color: chartStyleColours[darkmode][0]}}]
                }
            }
        });
}
