if (document.cookie.indexOf('colourSequence=') === -1) {
    setCookie("colourSequence", 1, 5)
}

if (document.cookie.indexOf('howLongBack=') === -1) {
    setCookie("howLongBack", 28, 5)
}
if (document.cookie.indexOf('areaName=') === -1) {
    setCookie("areaName", "England", 5)
    setCookie("areaType", "nation", 5)
}
if (document.cookie.indexOf('darkMode=') === -1) {
    setCookie("darkMode", 0, 5)
}

let colourSequence = getCookie("colourSequence")
let howLongBack = getCookie("howLongBack")
let darkmode = getCookie("darkMode")

const ukPopulation = 66796800
const ukAdultPopulation = 52400000
const targetNumberMay = 32000000

const projToDate = new Date(2021, 1, 13)
const projToDateMay = new Date(2021, 3, 29)

const ageBrackets = [
    "00_04",
    "05_09",
    "10_14",
    "15_19",
    "20_24",
    "25_29",
    "30_34",
    "35_39",
    "40_44",
    "45_49",
    "50_54",
    "55_59",
    "60_64",
    "65_69",
    "70_74",
    "75_79",
    "80_84",
    "85_89",
    "90+"
]

const ageBracketsDisplay = [
    "0 to 4",
    "5 to 9",
    "10 to 14",
    "15 to 19",
    "20 to 24",
    "25 to 29",
    "30 to 34",
    "35 to 39",
    "40 to 44",
    "45 to 49",
    "50 to 54",
    "55 to 59",
    "60 to 64",
    "65 to 69",
    "70 to 74",
    "75 to 79",
    "80 to 84",
    "85 to 89",
    "90+"
]

const ageBracketsUpper = [
    "0 to 59",
    "60 to 64",
    "65 to 69",
    "70 to 74",
    "75 to 79",
    "80 to 84",
    "85 to 89",
    "90+"
]

const ageBracketsUpperLarge = [
    "0 to 59",
    "60 to 69",
    "70 to 79",
    "80+"
]

const ageBracketsTwentys = [
    "0 to 19",
    "20 to 39",
    "40 to 59",
    "60 to 79",
    "80+"
]

const colourSchemes = [
    [
        '#B4B4B4',
        '#AAAAAA',
        '#A0A0A0',
        '#969696',
        '#8C8C8C',
        '#828282',
        '#787878',
        '#6E6E6E',
        '#646464',
        '#5A5A5A',
        '#505050',
        '#464646',
        '#3C3C3C',
        '#323232',
        '#282828',
        '#1e1e1e',
        '#141414',
        '#0A0A0A',
        '#000000'
    ],
    [
        '#e6194b',
        '#3cb44b',
        '#ffe119',
        '#4363d8',
        '#f58231',
        '#911eb4',
        '#46f0f0',
        '#f032e6',
        '#bcf60c',
        '#fabebe',
        '#008080',
        '#e6beff',
        '#9a6324',
        '#fffac8',
        '#800000',
        '#aaffc3',
        '#808000',
        '#ffd8b1',
        '#000075'
    ],
    [
        '#C71585',
        '#800080',
        '#BA55D3',
        '#9932CC',
        '#9400D3',
        '#8B008B',
        '#9370DB',
        '#7B68EE',
        '#6A5ACD',
        '#483D8B',
        '#483D8B',
        '#4B0082',
        '#8A2BE2',
        '#4169E1',
        '#0000FF',
        '#0000CD',
        '#00008B',
        '#000080',
        '#191970'
    ],
    [
        '#323232',
        '#3C3C3C',
        '#464646',
        '#505050',
        '#5A5A5A',
        '#646464',
        '#6E6E6E',
        '#787878',
        '#828282',
        '#8C8C8C',
        '#969696',
        '#A0A0A0',
        '#AAAAAA',
        '#B4B4B4',
        '#BEBEBE',
        '#C8C8C8',
        '#D2D2D2',
        '#DCDCDC',
        '#E6E6E6'
    ],
]

const chartColours = [
    [
        stdScale(0),
        [
            colourSchemes[1],
            [
                colourSchemes[1][0],
                colourSchemes[1][1],
                colourSchemes[1][2],
                colourSchemes[1][3],
                colourSchemes[1][4],
                colourSchemes[1][5],
                colourSchemes[1][6],
                colourSchemes[1][18]
            ],
            [colourSchemes[1][0], colourSchemes[1][1], colourSchemes[1][4], colourSchemes[1][5], colourSchemes[1][18]],
            [colourSchemes[1][0], colourSchemes[1][1], colourSchemes[1][4], colourSchemes[1][18]],
            [colourSchemes[1][6], colourSchemes[1][18], colourSchemes[1][0], colourSchemes[1][3]],
        ],
        stdScale(2)
    ],
    [
        stdScale(3),
        [
            colourSchemes[1],
            [
                colourSchemes[1][0],
                colourSchemes[1][1],
                colourSchemes[1][2],
                colourSchemes[1][3],
                colourSchemes[1][4],
                colourSchemes[1][5],
                colourSchemes[1][6],
                colourSchemes[1][18]
            ],
            [colourSchemes[1][0], colourSchemes[1][1], colourSchemes[1][4], colourSchemes[1][5], colourSchemes[1][18]],
            [colourSchemes[1][0], colourSchemes[1][1], colourSchemes[1][4], colourSchemes[1][18]],
            [colourSchemes[1][6], colourSchemes[1][18], colourSchemes[1][0], colourSchemes[1][3]],
        ],
        stdScale(2)
    ]
]

const chartStyleColours = [
    [
        'rgba(0,0,0,0.1)',
        'rgba(0,0,0,0.25)'
    ],
    [
        'rgba(255,255,255,0.1)',
        'rgba(255,255,255,0.25)'
    ]
]

function stdScale(colourSchemeNum) {
    return [
        colourSchemes[colourSchemeNum],
        [
            colourSchemes[colourSchemeNum][0],
            colourSchemes[colourSchemeNum][3],
            colourSchemes[colourSchemeNum][6],
            colourSchemes[colourSchemeNum][9],
            colourSchemes[colourSchemeNum][11],
            colourSchemes[colourSchemeNum][14],
            colourSchemes[colourSchemeNum][16],
            colourSchemes[colourSchemeNum][18]
        ],
        [
            colourSchemes[colourSchemeNum][0],
            colourSchemes[colourSchemeNum][6],
            colourSchemes[colourSchemeNum][10],
            colourSchemes[colourSchemeNum][14],
            colourSchemes[colourSchemeNum][18]
        ],
        [
            colourSchemes[colourSchemeNum][0],
            colourSchemes[colourSchemeNum][6],
            colourSchemes[colourSchemeNum][10],
            colourSchemes[colourSchemeNum][18]
        ],
        [
            colourSchemes[colourSchemeNum][4],
            colourSchemes[colourSchemeNum][14],
            colourSchemes[colourSchemeNum][14],
            colourSchemes[colourSchemeNum][4]
        ]
    ]
}
