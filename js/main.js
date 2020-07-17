let monthList = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
}

let numberOfDays = {
    0: 31,
    1: 28,
    2: 31,
    3: 30,
    4: 31,
    5: 30,
    6: 31,
    7: 31,
    8: 30,
    9: 31,
    10: 30,
    11: 31
}

let selectedDates = [];


let curDate = new Date();
let date = curDate.getDate();
let year = curDate.getFullYear();
let month = curDate.getMonth();

let monthDisplay = document.getElementById('month');
let yearDisplay = document.getElementById('year');
let nextMonth = document.getElementById('next-month');
let prevMonth = document.getElementById('prev-month');
let hiddenRegion = document.getElementById('hidden-region');
let hidden = document.getElementById('hidden');
let datesRegion = document.getElementById('dates-region');
let formDate = document.getElementById('form-date');
let seatsInput = document.getElementById('availableSeatsInput');
let facultyInput = document.getElementById('facultyInput');
let seatsNumber = document.getElementById('avlbl-seats');
let facultyName = document.getElementById('faculty-name');
let proceedBtn = document.getElementById('proceed-btn');
let backBtn = document.getElementById('back');

facultyInput.addEventListener('input', () => {
    facultyName.value = facultyInput.value;
})

seatsInput.addEventListener('input', () => {
    seatsNumber.value = seatsInput.value;
})

proceedBtn.addEventListener('click', () => {
    document.getElementById('date-picker-container').style.width = "0px";
    document.getElementById('date-picker').classList.add('d-none');
    document.getElementById('time-picker-container').style.width = "100%";
    setTimeout(()=>{
        document.getElementById('time-picker').classList.remove('d-none');
    }, 150);
})

backBtn.addEventListener('click', () => {
    document.getElementById('date-picker-container').style.width = "100%";
    document.getElementById('time-picker').classList.add('d-none');
    document.getElementById('time-picker-container').style.width = "0px";
    setTimeout(()=>{       
        document.getElementById('date-picker').classList.remove('d-none');
    }, 150);
})

init(month, year);

// INITIALISING THE CALENDER WITH CURRENT DATE AND MONTH

function init(month, year) {
    monthDisplay.innerHTML = `${monthList[month]}, ${year}`; 
    populateCalender();
}

// CALLING THE DISPLAY DATES FUNCTION AND SELECTING THE DATES WHICH HAVE BEEN SELECTED BY THE USER 

function populateCalender() {
    displayDates(month,year);
    let datesOfMonth = document.querySelectorAll('.date-val');
    datesOfMonth.forEach(date => date.classList.remove('selected'));
    selectedDates.filter(dates => dates.monthNum==month && dates.yearNum==year)
    .forEach(x => datesOfMonth[x.date-1].classList.add('selected'));
    fillDates();
    if(selectedDates.length==0)
        proceedBtn.disabled=true;
    else
        proceedBtn.disabled=false;
}

// DISPLAYING THE DATES IN THE CALENDER

function displayDates(month, year) {
    datesRegion.innerHTML = `
        <div class="row" id="days">
            <span class="day">SUN</span>
            <span class="day">MON</span>
            <span class="day">TUES</span>
            <span class="day">WED</span>
            <span class="day">THURS</span>
            <span class="day">FRI</span>
            <span class="day">SAT</span>
        </div>
    `
    let n = numberOfDays[month];
    if(year%4==0 && year%100!=0 && month==1)
        n=29;
    let firstDay = `${monthList[month]} 1 ${year}`;
    let dateStart = new Date(firstDay);
    let counter = 1;
    let monthStart = dateStart.getDay();
    let output = '<div class="row date-row">';
    for(let i=0; i<monthStart; i++)
    {
        output+=`
        <span class="date"></span>
        `
    }
    for(let i=0; i<7-monthStart; i++)
    {
        output+=`
        <span class="date date-val">${counter}</span>
        `
        counter++;
    }
    for(let i=0;;i++)
    {
        if(counter==n+1)
            break;
        else {
            if(i%7==0) {
                output+=
                `
                    </div><div class="row date-row">
                `
            }
        }
        output+= `<span class="date date-val">${counter}</span>`;
        counter++;
    }
    let extra = 7-((n-(7-monthStart))%7);
    if(extra!=7) {
        while(extra--) {
            output+=`
            <span class="date"></span>
            `
        }
    }
    datesRegion.innerHTML+= output;
    addSelectableProperty();
}

// MOVING THROUGH THE MONTHS USING THE NAVIGATION KEYS

nextMonth.addEventListener('click', () => {
    if(month==11)
    {
        month = 0;
        year++;
    }
    else 
        month++;
    init(month, year);
})

prevMonth.addEventListener('click', () => {
    if(month==0)
    {
        month = 11;
        year--;
    }
    else 
        month--;
    init(month, year);
})

// ADDING THE SELECTABLE PROPERTIES TO THE RELEVANT DATES

function addSelectableProperty() {
    let dateSpans = document.querySelectorAll('.date');
    dateSpans.forEach(dateSpan => {
        let dateVal = dateSpan.innerHTML;
        if(dateVal!="") {
            let spanDate = new Date(`${monthList[month]} ${dateVal} ${year} 00:00`);
            if(spanDate>curDate) {
                dateSpan.classList.add('selectable');
            }
            else {
                dateSpan.classList.add('old-date');
            }
        }
    })
    addSelectionProperty();
}

// ADDING THE SELECTION EVENT HANDLER TO THE SELECTABLE DATES

function addSelectionProperty() {
    let selectableDates = document.querySelectorAll('.selectable');
    selectableDates.forEach(selectableDate => {
        selectableDate.addEventListener('click', () => { 
            let selectedDate = {
                date: selectableDate.innerHTML,
                monthNum : month,
                yearNum : year
            }         
            if(selectableDate.classList.contains('selected'))
                removeDate(selectedDate);
            else
                addDate(selectedDate);
        })
    })
}

function addDate(date) {
    selectedDates.push(date);
    populateCalender();
}

function removeDate(dateToRemove) {
    console.log(dateToRemove);
    selectedDates = selectedDates.filter(dates => dates.date!=dateToRemove.date && dates.monthNum==month && dates.yearNum==year);
    populateCalender();
    
}

function fillDates() {
    formDate.value = "";
    selectedDates.forEach(selectedDate => {
        formDate.value += `${selectedDate.date}-${selectedDate.monthNum}-${selectedDate.yearNum}--`;
    })
}