const initDate = new Date(Date.now());

let clock = {
    unix: initDate,
    seconds: initDate.getSeconds(),
    minutes: initDate.getMinutes(),
    hours: initDate.getHours(),
    day: initDate.getDate(),
    month: initDate.getMonth(),
    year: initDate.getFullYear(),
    dayName: initDate.getDay()
}

Object.freeze(clock);

function tick() {

    const initDate = new Date(Date.now());

    clock = {
        unix: initDate,
        seconds: initDate.getSeconds(),
        minutes: initDate.getMinutes(),
        hours: initDate.getHours(),
        day: initDate.getDate(),
        month: initDate.getMonth(),
        year: initDate.getFullYear(),
        dayName: initDate.getDay()
    }
    Object.freeze(clock);
}

setInterval(() => {
    tick();
}, 1000);

export { clock }
