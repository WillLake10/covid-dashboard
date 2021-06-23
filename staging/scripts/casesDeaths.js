deaths(
    'https://api.coronavirus.data.gov.uk/v1/data?' +
    // 'filters=areaType=nation;areaName=england&' +
    'filters=areaType=overview&' +
    'structure={' +
    '"date":"date",' +
    '"newDeaths28DaysByPublishDate":"newDeaths28DaysByPublishDate",' +
    '"newCasesByPublishDate":"newCasesByPublishDate",' +
    // '"newCasesBySpecimenDateAgeDemographics":"newCasesBySpecimenDateAgeDemographics",' +
    '"newAdmissions":"newAdmissions"' +
    '}'
);

async function deaths(url) {
    const response = await fetch(url)
    const data = await response.json()
    const caseDeathsData = data.data.reverse()

    const CASES_DELAY = 15
    const HOSPITAL_DELAY = 4
    const DAYS_BACK = 56

    const cases = [], deaths = [], datesString = [], admissions = []
    let casesAvg = [null, null, null, null]
    let deathsAvg = [null, null, null, null]
    let admissionsAvg = [null, null, null, null]
    let deathcase = []
    let hospitalcase = []
    let caseAvgShort = [], deathsAvgShort = [], admissionsAvgShort = [], datesStringShort = []

    for (let i = 0; i < caseDeathsData.length; i++) {
        const temp = new Date(caseDeathsData[i].date)
        datesString.push(temp.getDate() + "-" + (temp.getMonth() + 1))
        cases.push(caseDeathsData[i].newCasesByPublishDate
            // -
            // (
            //     caseDeathsData[i].newCasesBySpecimenDateAgeDemographics[0].cases +
            //     caseDeathsData[i].newCasesBySpecimenDateAgeDemographics[1].cases +
            //     caseDeathsData[i].newCasesBySpecimenDateAgeDemographics[2].cases +
            //     caseDeathsData[i].newCasesBySpecimenDateAgeDemographics[3].cases +
            //     caseDeathsData[i].newCasesBySpecimenDateAgeDemographics[4].cases
            // )
        )
        if (i >= CASES_DELAY) {
            deaths.push(caseDeathsData[i].newDeaths28DaysByPublishDate)
        }
        if (i >= HOSPITAL_DELAY) {
            admissions.push(caseDeathsData[i].newAdmissions)
        }
    }

    while (admissions[admissions.length - 1] == null) admissions.pop()
    while (deaths[deaths.length - 1] == null) deaths.pop()

    casesAvg = doAvg(cases, casesAvg)
    deathsAvg = doAvg(deaths, deathsAvg)
    admissionsAvg = doAvg(admissions, admissionsAvg)

    //
    // casesAvg = cases
    // deathsAvg = deaths
    // admissionsAvg = admissions

    // console.log(admissions)

    for (let i = casesAvg.length - DAYS_BACK; i < casesAvg.length; i++) {
        caseAvgShort.push(casesAvg[i])
        datesStringShort.push(datesString[i])
        if (i < deathsAvg.length) deathsAvgShort.push(deathsAvg[i])
        if (i < admissionsAvg.length) admissionsAvgShort.push(admissionsAvg[i])
    }

    for (let i = 0; i < casesAvg.length; i++) {
        if (i < 70) {
            deathcase.push(null)
        } else {
            deathcase.push(deathsAvg[i] / casesAvg[i])
        }
    }

    for (let i = 0; i < casesAvg.length; i++) {
        if (i < 70) {
            hospitalcase.push(null)
        } else {
            hospitalcase.push(admissionsAvg[i] / casesAvg[i])
        }
    }

    const howManyDays = 200

    const deathcaseShort = [], dateShort = []
    for (let i = deathcase.length - howManyDays; i < deathcase.length; i++) {
        deathcaseShort.push(deathcase[i] * 100)
        if (i > deathcase.length - howManyDays + 13) {
            dateShort.push(datesString[i])
        }
    }

    const hoscaseShort = [], dateShort2 = []
    for (let i = hospitalcase.length - howManyDays; i < hospitalcase.length; i++) {
        hoscaseShort.push(hospitalcase[i] * 100)
        if (i > hospitalcase.length - howManyDays + 8) {
            dateShort2.push(datesString[i])
        }
    }

    for (let i = 0; i < CASES_DELAY; i++) {
        deathcaseShort.pop()
    }

    for (let i = 0; i < HOSPITAL_DELAY; i++) {
        hoscaseShort.pop()
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
        document.getElementById('hosDeathDiff').getContext('2d'),
        {
            type: 'line',
            data: {
                labels: dateShort2,
                datasets: [{
                    label: 'Percent Hospital Admissions from Cases',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: chartColours[darkmode][colourSequence][4][2],
                    data: hoscaseShort,
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
        document.getElementById('caseDeathDiffAvg').getContext('2d'),
        {
            type: 'line',
            data: {
                labels: dateShort,
                datasets: [{
                    label: 'Percent Deaths from Cases Avg',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: chartColours[darkmode][colourSequence][4][2],
                    data: doAvgNoRound(deathcaseShort, [null, null, null]),
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
    let caseMax = 1200
    let deathMax = 25
    let admisMax = 86

    // 1200:25:86

    let currentMax1 = 0
    for (let i = 0; i < casesAvg.length; i++) {
        if (casesAvg[i] > currentMax1) currentMax1 = casesAvg[i]
    }

    let fullScale = Math.ceil(currentMax1 / caseMax) + 1

    new Chart(
        document.getElementById("caseDeathChart").getContext('2d'),
        {
            type: 'line',
            data: {
                labels: datesString,
                datasets: [
                    {
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
                    },
                    {
                        label: "Hospital Admissions",
                        borderColor: chartColours[darkmode][colourSequence][4][2],
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        type: 'line',
                        data: admissionsAvg,
                        yAxisID: "y-axis-3"
                    }
                ]
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
                            ticks: {min: 0, max: caseMax * fullScale},
                            scaleLabel: {
                                display: true,
                                labelString: 'Cases',
                                fontSize: 20
                            },
                            gridLines: {display: true, color: chartStyleColours[darkmode][0]}
                        }, {
                            type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                            display: true,
                            position: "left",
                            id: "y-axis-2",
                            ticks: {min: 0, max: deathMax * fullScale},
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
                        },
                        {
                            type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                            display: true,
                            position: "left",
                            id: "y-axis-3",
                            ticks: {min: 0, max: admisMax * fullScale},
                            scaleLabel: {
                                display: true,
                                labelString: 'Hospital Admissions',
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
                },
                plugins: {
                    annotation: {
                        annotations: {
                            box1: {
                                // Indicates the type of annotation
                                type: 'box',
                                xMin: 1,
                                xMax: 2,
                                yMin: 5000,
                                yMax: 70000,
                                backgroundColor: 'rgba(255, 99, 132, 0.25)'
                            }
                        }
                    }
                }
            }
        });

    let currentMax = 0
    for (let i = 0; i < caseAvgShort.length; i++) {
        if (caseAvgShort[i] > currentMax) currentMax = caseAvgShort[i]
    }

    let scaleFactor = Math.ceil(currentMax / caseMax)
    //
    // if (currentMax < 60000/6) scaleFactor = 6
    // else if (currentMax < 60000/5) scaleFactor = 5
    // else if (currentMax < 60000/4) scaleFactor = 4
    // else if (currentMax < 60000/3) scaleFactor = 3
    // else if (currentMax < 60000/2) scaleFactor = 2
    // else if (currentMax < 60000) scaleFactor = 1

    new Chart(
        document.getElementById("caseDeathChartShort").getContext('2d'),
        {
            type: 'line',
            data: {
                labels: datesStringShort,
                datasets: [
                    {
                        label: "Cases",
                        borderColor: chartColours[darkmode][colourSequence][4][0],
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        type: 'line',
                        data: caseAvgShort,
                        yAxisID: "y-axis-1",
                    }, {
                        label: "Deaths",
                        borderColor: chartColours[darkmode][colourSequence][4][1],
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        type: 'line',
                        data: deathsAvgShort,
                        yAxisID: "y-axis-2"
                    },
                    {
                        label: "Hospital Admissions",
                        borderColor: chartColours[darkmode][colourSequence][4][2],
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        type: 'line',
                        data: admissionsAvgShort,
                        yAxisID: "y-axis-3"
                    }
                ]
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
                            ticks: {min: 0, max: (caseMax * scaleFactor)},
                            scaleLabel: {
                                display: true,
                                labelString: 'Cases',
                                fontSize: 20
                            },
                            gridLines: {display: true, color: chartStyleColours[darkmode][0]}
                        }, {
                            type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                            display: true,
                            position: "left",
                            id: "y-axis-2",
                            ticks: {min: 0, max: (deathMax * scaleFactor)},
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
                        },
                        {
                            type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                            display: true,
                            position: "left",
                            id: "y-axis-3",
                            ticks: {min: 0, max: (admisMax * scaleFactor)},
                            scaleLabel: {
                                display: true,
                                labelString: 'Hospital Admissions',
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
                },
                plugins: {
                    annotation: {
                        annotations: {
                            box1: {
                                // Indicates the type of annotation
                                type: 'box',
                                xMin: 1,
                                xMax: 2,
                                yMin: 5000,
                                yMax: 70000,
                                backgroundColor: 'rgba(255, 99, 132, 0.25)'
                            }
                        }
                    }
                }
            }
        });
}
