function doAvg(day, avrg) {
    for (let i = 7; i < day.length; i++) {
        avrg.push(
            (Math.round(
                    (
                        (
                            day[i] +
                            day[i - 1] +
                            day[i - 2] +
                            day[i - 3] +
                            day[i - 4] +
                            day[i - 5] +
                            day[i - 6]
                        ) / 7
                    ) * 5
                )
            ) / 5
        )
    }
    return avrg
}

function getBaseAvgArray() {
    return [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null]
    ]
}

function getBaseAgeGroupArray() {
    return [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function changeColour(col) {
    if (col === 0) {
        setCookie("colourSequence", 0, 5)
    } else if (col === 2) {
        setCookie("colourSequence", 2, 5)
    } else {
        setCookie("colourSequence", 1, 5)
    }
    location.reload();
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function standardChart(
    type,
    label,
    dataSets,
    options
) {
    return {
        type: type,
        data: {labels: label, datasets: dataSets},
        options: options
    }
}

function dataSet(label, bgColor, borderCol, data, type) {
    return {
        label: label,
        backgroundColor: bgColor,
        borderColor: borderCol,
        data: data,
        type: type
    }
}

function chartWithTag(
    tag,
    type,
    label,
    dataset,
    options = {}
) {
    new Chart(
        document.getElementById(tag).getContext('2d'),
        standardChart(type, label, dataset, options)
    );
}

function valReturn(tag, data) {
    document.getElementById(tag).innerHTML = data;
}

function valReturnSet(data) {
    for (let i = 0; i < data.length; i++){
        valReturn(data[i][0], data[i][1])
    }
}

function getHalfRate(Original, New, Time){
    return (Time * -(Math.log(2))) / (Math.log(Original / New))
}

function datediff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
}

