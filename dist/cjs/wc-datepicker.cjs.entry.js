'use strict';

var index = require('./index-LLLiDQfi.js');

function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}
function getFirstOfWeek(date, firstDayOfWeek) {
    let currentDayInWeek = date.getDay() - firstDayOfWeek;
    if (currentDayInWeek < 0) {
        currentDayInWeek = 7 + currentDayInWeek;
    }
    return subDays(date, currentDayInWeek);
}
function getLastOfWeek(date, firstDayOfWeek) {
    const startOfWeek = getFirstOfWeek(date, firstDayOfWeek);
    return addDays(startOfWeek, 6);
}
function getDaysOfMonth(date, padded, firstDayOfWeek) {
    const days = [];
    const firstOfMonth = getFirstOfMonth(date);
    const firstDayMonth = firstOfMonth.getDay() === 0 ? 7 : firstOfMonth.getDay();
    const lastOfMonth = getLastOfMonth(date);
    const lastDayOfMonth = lastOfMonth.getDay() === 0 ? 7 : lastOfMonth.getDay();
    const lastDayOfWeek = firstDayOfWeek === 1 ? 7 : firstDayOfWeek - 1;
    const leftPaddingDays = [];
    const rightPaddingDays = [];
    {
        const leftPadding = (7 - firstDayOfWeek + firstDayMonth) % 7;
        let leftPaddingAmount = leftPadding;
        let leftPaddingDay = getPreviousDay(firstOfMonth);
        while (leftPaddingAmount > 0) {
            leftPaddingDays.push(leftPaddingDay);
            leftPaddingDay = getPreviousDay(leftPaddingDay);
            leftPaddingAmount -= 1;
        }
        leftPaddingDays.reverse();
        const rightPadding = (7 - lastDayOfMonth + lastDayOfWeek) % 7;
        let rightPaddingAmount = rightPadding;
        let rightPaddingDay = getNextDay(lastOfMonth);
        while (rightPaddingAmount > 0) {
            rightPaddingDays.push(rightPaddingDay);
            rightPaddingDay = getNextDay(rightPaddingDay);
            rightPaddingAmount -= 1;
        }
    }
    let currentDay = firstOfMonth;
    while (currentDay.getMonth() === date.getMonth()) {
        days.push(currentDay);
        currentDay = getNextDay(currentDay);
    }
    return [...leftPaddingDays, ...days, ...rightPaddingDays];
}
function getFirstOfMonth(date) {
    const firstOfMonth = removeTimezoneOffset(new Date(`${String(getYear(date)).padStart(4, '0')}-${String(getMonth(date)).padStart(2, '0')}-01`));
    return firstOfMonth;
}
function getISODateString(date) {
    if (!(date instanceof Date)) {
        return;
    }
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function getLastOfMonth(date) {
    const newDate = getFirstOfMonth(date);
    newDate.setMonth(newDate.getMonth() + 1);
    newDate.setDate(newDate.getDate() - 1);
    return newDate;
}
function getMonth(date) {
    return date.getMonth() + 1;
}
function getMonths(locale) {
    return new Array(12).fill(undefined).map((_, month) => {
        const date = removeTimezoneOffset(new Date(`2006-${String(month + 1).padStart(2, '0')}-01`));
        return Intl.DateTimeFormat(locale, {
            month: 'long'
        }).format(date);
    });
}
function getNextDay(date) {
    return addDays(date, 1);
}
function getNextMonth(date) {
    const newDate = new Date(date);
    newDate.setDate(1);
    newDate.setMonth(newDate.getMonth() + 1);
    return newDate;
}
function getNextYear(date) {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + 1);
    return newDate;
}
function getPreviousDay(date) {
    return subDays(date, 1);
}
function getPreviousMonth(date) {
    const newDate = new Date(date);
    newDate.setDate(1);
    newDate.setMonth(newDate.getMonth() - 1);
    return newDate;
}
function getPreviousYear(date) {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() - 1);
    return newDate;
}
function getWeekDays(firstDayOfWeek, locale) {
    return new Array(7)
        .fill(undefined)
        .map((_, index) => ((firstDayOfWeek + index) % 7) + 1)
        .map((day) => {
        const date = removeTimezoneOffset(new Date(`2006-01-0${day}`));
        return [
            Intl.DateTimeFormat(locale, {
                weekday: 'short'
            })
                .format(date)
                .slice(0, 3),
            Intl.DateTimeFormat(locale, {
                weekday: 'long'
            }).format(date)
        ];
    });
}
function getYear(date) {
    return date.getFullYear();
}
function isDateInRange(date, range) {
    if (!date || !range || !range.from || !range.to) {
        return false;
    }
    const earlyDate = range.from < range.to ? range.from : range.to;
    const laterDate = range.from < range.to ? range.to : range.from;
    return date >= earlyDate && date <= laterDate;
}
function isSameDay(date1, date2) {
    if (!date1 || !date2) {
        return false;
    }
    return (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate());
}
function removeTimezoneOffset(date) {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
    return newDate;
}
function subDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - days);
    return newDate;
}

const wcDatepickerCss = () => `.visually-hidden.sc-wc-datepicker{position:absolute;overflow:hidden;width:1px;height:1px;white-space:nowrap;clip:rect(0 0 0 0);clip-path:inset(50%)}`;

const defaultLabels = {
    clearButton: 'Clear value',
    monthSelect: 'Select month',
    nextMonthButton: 'Next month',
    nextYearButton: 'Next year',
    picker: 'Choose date',
    previousMonthButton: 'Previous month',
    previousYearButton: 'Previous year',
    todayButton: 'Show today',
    yearSelect: 'Select year'
};
const WCDatepicker = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.selectDate = index.createEvent(this, "selectDate");
        this.changeMonth = index.createEvent(this, "changeMonth");
        this.disabled = false;
        this.disableDate = () => false;
        this.elementClassName = 'wc-datepicker';
        this.firstDayOfWeek = 0;
        this.goToRangeStartOnSelect = true;
        this.labels = defaultLabels;
        this.locale = (navigator === null || navigator === void 0 ? void 0 : navigator.language) || 'en-US';
        this.maxSearchDays = 365;
        this.navigateWeeks = false;
        this.showClearButton = false;
        this.showMonthStepper = true;
        this.showTodayButton = false;
        this.showYearStepper = false;
        this.startDate = getISODateString(new Date());
        this.pendingClick = false;
        this.init = () => {
            this.currentDate = this.startDate
                ? removeTimezoneOffset(new Date(this.startDate))
                : new Date();
            this.updateWeekdays();
            this.handleMinDate();
            this.handleMaxDate();
        };
        this.getAvailableDate = (date, direction) => {
            let potentialDate;
            let outOfRange = false;
            switch (direction) {
                case 'previousDay':
                    potentialDate = getPreviousDay(date);
                    break;
                case 'nextDay':
                    potentialDate = getNextDay(date);
                    break;
                case 'previousSameWeekDay':
                    potentialDate = subDays(date, 7);
                    break;
                case 'nextSameWeekDay':
                    potentialDate = addDays(date, 7);
                    break;
                case 'firstOfWeek':
                    potentialDate = getFirstOfWeek(date, this.firstDayOfWeek);
                    break;
                case 'lastOfWeek':
                    potentialDate = getLastOfWeek(date, this.firstDayOfWeek);
                    break;
                case 'firstOfMonth':
                    potentialDate = getFirstOfMonth(date);
                    break;
                case 'lastOfMonth':
                    potentialDate = getLastOfMonth(date);
                    break;
                case 'previousMonth':
                    potentialDate = getPreviousMonth(date);
                    break;
                case 'nextMonth':
                    potentialDate = getNextMonth(date);
                    break;
                case 'previousYear':
                    potentialDate = getPreviousYear(date);
                    break;
                case 'nextYear':
                    potentialDate = getNextYear(date);
                    break;
            }
            while (this.disableDate(potentialDate) && !outOfRange) {
                switch (direction) {
                    case 'previousDay':
                    case 'lastOfWeek':
                    case 'lastOfMonth':
                        potentialDate = getPreviousDay(potentialDate);
                        break;
                    case 'nextDay':
                    case 'firstOfWeek':
                    case 'firstOfMonth':
                    case 'previousMonth':
                    case 'nextMonth':
                    case 'previousYear':
                    case 'nextYear':
                        potentialDate = getNextDay(potentialDate);
                        break;
                    case 'previousSameWeekDay':
                        potentialDate = subDays(potentialDate, 7);
                        break;
                    case 'nextSameWeekDay':
                        potentialDate = addDays(potentialDate, 7);
                        break;
                }
                switch (direction) {
                    case 'firstOfMonth':
                    case 'lastOfMonth':
                    case 'previousYear':
                    case 'nextYear':
                        outOfRange = potentialDate.getMonth() !== date.getMonth();
                        break;
                    case 'previousMonth':
                        outOfRange = potentialDate.getMonth() !== date.getMonth() - 1;
                        break;
                    case 'nextMonth':
                        outOfRange = potentialDate.getMonth() !== date.getMonth() + 1;
                        break;
                    default:
                        outOfRange = !isDateInRange(potentialDate, {
                            from: subDays(date, this.maxSearchDays),
                            to: addDays(date, this.maxSearchDays)
                        });
                        break;
                }
            }
            if (outOfRange) {
                return date;
            }
            return potentialDate;
        };
        this.nextMonth = () => {
            this.updateCurrentDate(getNextMonth(this.currentDate));
        };
        this.nextYear = () => {
            this.updateCurrentDate(getNextYear(this.currentDate));
        };
        this.previousMonth = () => {
            this.updateCurrentDate(getPreviousMonth(this.currentDate));
        };
        this.previousYear = () => {
            this.updateCurrentDate(getPreviousYear(this.currentDate));
        };
        this.showToday = () => {
            this.updateCurrentDate(new Date());
        };
        this.clear = () => {
            this.value = undefined;
            this.selectDate.emit(undefined);
        };
        this.onClick = (event) => {
            if (this.disabled) {
                return;
            }
            this.pendingClick = false;
            const target = event.target.closest('[data-date]');
            if (!Boolean(target)) {
                return;
            }
            const date = removeTimezoneOffset(new Date(target.dataset.date));
            if (this.isDateDisabled(date)) {
                return;
            }
            this.updateCurrentDate(date);
            this.onSelectDate(date);
        };
        this.onMonthSelect = (event) => {
            const month = +event.target.value - 1;
            const currentDay = this.currentDate.getDate();
            const targetDate = new Date(this.currentDate.getFullYear(), month, 1);
            const lastDayOfTargetMonth = getLastOfMonth(targetDate).getDate();
            const clampedDay = Math.min(currentDay, lastDayOfTargetMonth);
            const updatedDate = new Date(this.currentDate.getFullYear(), month, clampedDay);
            this.updateCurrentDate(this.clampDateToRange(updatedDate));
        };
        this.onYearSelect = (event) => {
            let year = +event.target.value;
            const input = event.target;
            if (isNaN(year)) {
                year = new Date().getFullYear();
                input.value = String(year);
            }
            else if (year < 0) {
                year = 0;
                input.value = String(year);
            }
            else if (year > 9999) {
                year = 9999;
                input.value = String(year);
            }
            const min = this.getMinDate();
            const max = this.getMaxDate();
            const minYear = min === null || min === void 0 ? void 0 : min.getFullYear();
            const maxYear = max === null || max === void 0 ? void 0 : max.getFullYear();
            const yearLower = minYear !== null && minYear !== void 0 ? minYear : 0;
            const yearUpper = maxYear !== null && maxYear !== void 0 ? maxYear : 9999;
            const clampedYear = Math.max(yearLower, Math.min(yearUpper, year));
            if (clampedYear !== year) {
                input.value = String(clampedYear);
            }
            year = clampedYear;
            const currentDay = this.currentDate.getDate();
            const currentMonth = this.currentDate.getMonth();
            const targetDate = new Date();
            targetDate.setFullYear(year, currentMonth, 1);
            const lastDayOfTargetMonth = getLastOfMonth(targetDate).getDate();
            const clampedDay = Math.min(currentDay, lastDayOfTargetMonth);
            const updatedDate = new Date();
            updatedDate.setFullYear(year, currentMonth, clampedDay);
            this.updateCurrentDate(this.clampDateToRange(updatedDate));
        };
        this.onKeyDown = (event) => {
            if (this.disabled) {
                return;
            }
            if (event.code === 'ArrowLeft') {
                event.preventDefault();
                this.updateCurrentDate(this.getAvailableDate(this.currentDate, 'previousDay'), true);
            }
            else if (event.code === 'ArrowRight') {
                event.preventDefault();
                this.updateCurrentDate(this.getAvailableDate(this.currentDate, 'nextDay'), true);
            }
            else if (event.code === 'ArrowUp') {
                event.preventDefault();
                this.updateCurrentDate(this.getAvailableDate(this.currentDate, 'previousSameWeekDay'), true);
            }
            else if (event.code === 'ArrowDown') {
                event.preventDefault();
                this.updateCurrentDate(this.getAvailableDate(this.currentDate, 'nextSameWeekDay'), true);
            }
            else if (event.code === 'PageUp') {
                event.preventDefault();
                if (event.shiftKey) {
                    this.updateCurrentDate(this.getAvailableDate(this.currentDate, 'previousYear'), true);
                }
                else {
                    this.updateCurrentDate(this.getAvailableDate(this.currentDate, 'previousMonth'), true);
                }
            }
            else if (event.code === 'PageDown') {
                event.preventDefault();
                if (event.shiftKey) {
                    this.updateCurrentDate(this.getAvailableDate(this.currentDate, 'nextYear'), true);
                }
                else {
                    this.updateCurrentDate(this.getAvailableDate(this.currentDate, 'nextMonth'), true);
                }
            }
            else if (event.code === 'Home') {
                event.preventDefault();
                this.updateCurrentDate(this.getAvailableDate(this.currentDate, this.navigateWeeks ? 'firstOfWeek' : 'firstOfMonth'), true);
            }
            else if (event.code === 'End') {
                event.preventDefault();
                this.updateCurrentDate(this.getAvailableDate(this.currentDate, this.navigateWeeks ? 'lastOfWeek' : 'lastOfMonth'), true);
            }
            else if (event.code === 'Space' || event.code === 'Enter') {
                event.preventDefault();
                // Prevent keyboard selection of out of range disabled dates for min/max
                if (!this.isDateDisabled(this.currentDate)) {
                    this.onSelectDate(this.currentDate);
                }
            }
        };
        this.onMouseEnter = (event) => {
            if (this.disabled) {
                return;
            }
            const date = removeTimezoneOffset(new Date(event.target.closest('td').dataset.date));
            this.hoveredDate = date;
        };
        this.onMouseLeave = () => {
            this.hoveredDate = undefined;
        };
        this.onMouseDown = () => {
            this.pendingClick = true;
        };
        this.onFocus = (event) => {
            if (this.pendingClick) {
                return;
            }
            const date = removeTimezoneOffset(new Date(event.target.dataset.date));
            if (!isSameDay(date, this.currentDate)) {
                this.updateCurrentDate(date);
            }
        };
    }
    componentWillLoad() {
        this.init();
    }
    watchFirstDayOfWeek() {
        this.updateWeekdays();
    }
    watchLocale() {
        if (!Boolean(this.locale)) {
            this.locale = (navigator === null || navigator === void 0 ? void 0 : navigator.language) || 'en-US';
        }
        this.updateWeekdays();
    }
    watchRange() {
        this.value = undefined;
        this.selectDate.emit(undefined);
    }
    watchStartDate() {
        this.currentDate = this.startDate
            ? removeTimezoneOffset(new Date(this.startDate))
            : new Date();
    }
    watchValue() {
        if (!Boolean(this.value)) {
            return;
        }
        if (Array.isArray(this.value)) {
            this.currentDate =
                this.value.length > 1 && !this.goToRangeStartOnSelect
                    ? this.value[1]
                    : this.value[0];
        }
        else if (this.value instanceof Date) {
            this.currentDate = this.value;
        }
    }
    handleMinDate() {
        // If currentDate is less than minDate,
        // snap forward to minDate
        if (this.minDate &&
            this.currentDate < removeTimezoneOffset(new Date(this.minDate))) {
            this.currentDate = removeTimezoneOffset(new Date(this.minDate));
        }
    }
    handleMaxDate() {
        // If currentDate is more than maxDate,
        // snap back to maxDate
        if (this.maxDate &&
            this.currentDate > removeTimezoneOffset(new Date(this.maxDate))) {
            this.currentDate = removeTimezoneOffset(new Date(this.maxDate));
        }
    }
    componentDidRender() {
        if (this.moveFocusAfterMonthChanged) {
            this.focusDate(this.currentDate);
            this.moveFocusAfterMonthChanged = false;
        }
    }
    updateWeekdays() {
        this.weekdays = getWeekDays(this.firstDayOfWeek === 0 ? 7 : this.firstDayOfWeek, this.locale);
    }
    getClassName(element) {
        return Boolean(element)
            ? `${this.elementClassName}__${element}`
            : this.elementClassName;
    }
    getCalendarRows() {
        const daysOfMonth = getDaysOfMonth(this.currentDate, true, this.firstDayOfWeek === 0 ? 7 : this.firstDayOfWeek);
        const calendarRows = [];
        for (let i = 0; i < daysOfMonth.length; i += 7) {
            const row = daysOfMonth.slice(i, i + 7);
            calendarRows.push(row);
        }
        return calendarRows;
    }
    getTitle() {
        if (!Boolean(this.value)) {
            return;
        }
        if (this.isRangeValue(this.value)) {
            const startDate = Intl.DateTimeFormat(this.locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(this.value[0]);
            const endDate = this.value[1]
                ? Intl.DateTimeFormat(this.locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }).format(this.value[1])
                : undefined;
            if (Boolean(endDate)) {
                return `${startDate} - ${endDate}`;
            }
            else {
                return startDate;
            }
        }
        else {
            return Intl.DateTimeFormat(this.locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(this.value);
        }
    }
    getGridTitle() {
        return Intl.DateTimeFormat(this.locale, {
            month: 'long',
            year: 'numeric'
        }).format(this.currentDate);
    }
    focusDate(date) {
        var _a;
        (_a = this.el
            .querySelector(`[data-date="${getISODateString(date)}"]`)) === null || _a === void 0 ? void 0 : _a.focus();
    }
    updateCurrentDate(date, moveFocus) {
        const month = date.getMonth();
        const year = date.getFullYear();
        if (year > 9999 || year < 0) {
            return;
        }
        const monthChanged = month !== this.currentDate.getMonth() ||
            year !== this.currentDate.getFullYear();
        if (monthChanged) {
            this.changeMonth.emit({
                month: getMonth(date),
                year: getYear(date),
                day: date.getDate()
            });
            if (moveFocus) {
                this.moveFocusAfterMonthChanged = true;
            }
        }
        this.currentDate = date;
        if (moveFocus) {
            this.focusDate(this.currentDate);
        }
    }
    onSelectDate(date) {
        var _a, _b;
        if (this.isDateDisabled(date)) {
            return;
        }
        if (this.isRangeValue(this.value)) {
            const newValue = ((_a = this.value) === null || _a === void 0 ? void 0 : _a[0]) === undefined || this.value.length === 2
                ? [date]
                : [this.value[0], date];
            if (newValue.length === 2 && newValue[0] > newValue[1]) {
                newValue.reverse();
            }
            const isoValue = newValue[1] === undefined
                ? [getISODateString(newValue[0])]
                : [getISODateString(newValue[0]), getISODateString(newValue[1])];
            this.value = newValue;
            this.selectDate.emit(isoValue);
        }
        else {
            if (((_b = this.value) === null || _b === void 0 ? void 0 : _b.getTime()) === date.getTime()) {
                return;
            }
            this.value = date;
            this.selectDate.emit(getISODateString(date));
        }
    }
    // @ts-ignore
    isRangeValue(value) {
        return this.range;
    }
    get isPreviousMonthDisabled() {
        if (!this.minDate) {
            return false;
        }
        const prevMonth = getPreviousMonth(this.currentDate);
        const min = removeTimezoneOffset(new Date(this.minDate));
        // If the last day of the previous month is before minDate, disable the month navigation button.
        return getLastOfMonth(prevMonth) < min;
    }
    get isNextMonthDisabled() {
        if (!this.maxDate) {
            return false;
        }
        const nextMonth = getNextMonth(this.currentDate);
        const max = removeTimezoneOffset(new Date(this.maxDate));
        // If the first day of the next month is after maxDate, disable.
        return getFirstOfMonth(nextMonth) > max;
    }
    getMinDate() {
        if (!this.minDate) {
            return undefined;
        }
        return removeTimezoneOffset(new Date(this.minDate));
    }
    getMaxDate() {
        if (!this.maxDate) {
            return undefined;
        }
        return removeTimezoneOffset(new Date(this.maxDate));
    }
    isMonthOutOfRange(year, monthIndex) {
        const monthStart = new Date(year, monthIndex, 1);
        const firstOfMonth = getFirstOfMonth(monthStart);
        const lastOfMonth = getLastOfMonth(monthStart);
        const min = this.getMinDate();
        const max = this.getMaxDate();
        if (min && lastOfMonth < min) {
            return true;
        }
        if (max && firstOfMonth > max) {
            return true;
        }
        return false;
    }
    clampDateToRange(date) {
        const min = this.getMinDate();
        const max = this.getMaxDate();
        if (min && date < min) {
            return min;
        }
        if (max && date > max) {
            return max;
        }
        return date;
    }
    isDateDisabled(date) {
        if (this.disableDate(date)) {
            return true;
        }
        const isBeforeMin = this.minDate && date < removeTimezoneOffset(new Date(this.minDate));
        const isAfterMax = this.maxDate && date > removeTimezoneOffset(new Date(this.maxDate));
        if (isBeforeMin || isAfterMax) {
            return true;
        }
        return false;
    }
    render() {
        var _a, _b, _c, _d;
        const showFooter = this.showTodayButton || this.showClearButton;
        return (index.h(index.Host, { key: 'a8a1bca738b0c4efed84c3737da70e8ce44232cb' }, index.h("div", { key: 'e84e11e1c15010ef42f955101a7ae809d023478b', "aria-disabled": String(this.disabled), "aria-label": this.labels.picker, class: {
                [this.getClassName()]: true,
                [`${this.getClassName()}--disabled`]: this.disabled
            }, role: "group" }, index.h("div", { key: 'f5ec57cb3143d6378bed8c220b13fe9f048ccd70', class: this.getClassName('header') }, index.h("span", { key: 'a06ff8e6902f9e5069037ba1ed288d84d6dd973e', "aria-atomic": "true", "aria-live": "polite", class: "visually-hidden" }, this.getTitle()), this.showYearStepper && (index.h("button", { key: 'c139bf5d1098dd175687e906dd1e0c8177db0878', "aria-label": this.labels.previousYearButton, class: this.getClassName('previous-year-button'), disabled: this.disabled, innerHTML: this.previousYearButtonContent || undefined, onClick: this.previousYear, type: "button" }, index.h("slot", { key: 'eec62b35b038f0630a52fb71ea07c6a78469fa1a', name: "button-year-prev" }, index.h("svg", { key: '9febac681c4180bdd787fe5397c133873f8c054d', fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, index.h("polyline", { key: '7c3b869d6b077e0413b4e8347603209cbf9c95b9', points: "11 17 6 12 11 7" }), index.h("polyline", { key: 'c379eb89405f9eea9cc6a4dd55e9c981f5482031', points: "18 17 13 12 18 7" }))))), this.showMonthStepper && (index.h("button", { key: '06be659c5dcfc0bbf1a9566a3853eab472ccdab6', "aria-label": this.labels.previousMonthButton, class: {
                [this.getClassName('previous-month-button')]: true,
                [this.getClassName('next-month-button--disabled')]: this.isPreviousMonthDisabled
            }, disabled: this.disabled || this.isPreviousMonthDisabled, innerHTML: this.previousMonthButtonContent || undefined, onClick: this.previousMonth, type: "button" }, index.h("slot", { key: '3f8b82a20f1831dd0f9ae13f601e6a7b9d7d0f66', name: "button-month-prev" }, index.h("svg", { key: '4ece2af1856e9c23a55844d72308ca5ba7a07636', fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, index.h("polyline", { key: '880364e4c8cb697e3dac756756630ecfa12fc11c', points: "15 18 9 12 15 6" }))))), index.h("span", { key: '32647c49b1c8cd81514dcae8f522b6d51bbb8aee', class: this.getClassName('current-month') }, index.h("select", { key: 'de9f1f2e77961b167455a04842b5ac6a699ff0f7', title: this.labels.monthSelect, "aria-label": this.labels.monthSelect, class: this.getClassName('month-select'), disabled: this.disabled, onChange: this.onMonthSelect }, getMonths(this.locale).map((month, index$1) => (index.h("option", { key: month, disabled: this.isMonthOutOfRange(this.currentDate.getFullYear(), index$1), selected: this.currentDate.getMonth() === index$1, value: index$1 + 1 }, month)))), index.h("input", { key: 'e7e5831d0d1b6d8caad4368644395d414c379565', title: this.labels.yearSelect, "aria-label": this.labels.yearSelect, class: this.getClassName('year-select'), disabled: this.disabled, max: (_b = (_a = this.getMaxDate()) === null || _a === void 0 ? void 0 : _a.getFullYear()) !== null && _b !== void 0 ? _b : 9999, maxLength: 4, min: (_d = (_c = this.getMinDate()) === null || _c === void 0 ? void 0 : _c.getFullYear()) !== null && _d !== void 0 ? _d : 1, onChange: this.onYearSelect, type: "number", value: this.currentDate.getFullYear() })), this.showMonthStepper && (index.h("button", { key: 'e882787c1ee2c42e3a73348c8894b1c4423e6a74', "aria-label": this.labels.nextMonthButton, class: {
                [this.getClassName('next-month-button')]: true,
                [this.getClassName('next-month-button--disabled')]: this.isNextMonthDisabled
            }, disabled: this.disabled || this.isNextMonthDisabled, innerHTML: this.nextMonthButtonContent || undefined, onClick: this.nextMonth, type: "button" }, index.h("slot", { key: 'aeaab1601d337d37b8cf107b9febbd9a2a117881', name: "button-month-next" }, index.h("svg", { key: 'fdcde0cc5af9e3f582bf669f7a2492ba9512d759', fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, index.h("polyline", { key: 'a44728996114fe1a03e3710d6e865fc78157ed20', points: "9 18 15 12 9 6" }))))), this.showYearStepper && (index.h("button", { key: '96402f11750204bf7f747a5f93964528cad5d533', "aria-label": this.labels.nextYearButton, class: this.getClassName('next-year-button'), disabled: this.disabled, innerHTML: this.nextYearButtonContent || undefined, onClick: this.nextYear, type: "button" }, index.h("slot", { key: 'b47b97fbaf6488b4143bf6133e97648b2cdda779', name: "button-year-next" }, index.h("svg", { key: '49b093b1cbf5ee8bffe661ba74f759588b6192e6', fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, index.h("polyline", { key: 'a39c967788d8a9f0ed122ffdab30b8f95cc732fb', points: "13 17 18 12 13 7" }), index.h("polyline", { key: '73c301808950bb91192f689a5ec1439a43139355', points: "6 17 11 12 6 7" })))))), index.h("div", { key: '19e164c3cf677ef352d65e6264ad1a89e0500faf', class: this.getClassName('body') }, index.h("table", { key: '04ebf6087e5230a9097398e55cf3ce55651f53cf', class: this.getClassName('calendar'), onKeyDown: this.onKeyDown, role: "grid", "aria-label": this.getGridTitle(), "aria-multiselectable": this.range ? 'true' : 'false' }, index.h("thead", { key: 'd0f59e46cc8421e21d3253d957e327d4fd496717', class: this.getClassName('calendar-header') }, index.h("tr", { key: '4cb58d808223eb6c1731fecdfb7e29439ecfb7ab', class: this.getClassName('weekday-row') }, this.weekdays.map((weekday) => (index.h("th", { "aria-label": weekday[1], abbr: weekday[1], class: this.getClassName('weekday'), key: weekday[0], scope: "col" }, index.h("span", null, weekday[0])))))), index.h("tbody", { key: 'e9f7cf25f92a9bd5a801bd82937478c1fa3558ac' }, this.getCalendarRows().map((calendarRow) => {
            const rowKey = `row-${calendarRow[0].getMonth()}-${calendarRow[0].getDate()}`;
            return (index.h("tr", { class: this.getClassName('calendar-row'), key: rowKey }, calendarRow.map((day) => {
                var _a, _b, _c, _d, _e;
                const isCurrent = isSameDay(day, this.currentDate);
                const isOverflowing = day.getMonth() !== this.currentDate.getMonth();
                const isSelected = Array.isArray(this.value)
                    ? isSameDay(day, this.value[0]) ||
                        isSameDay(day, this.value[1])
                    : isSameDay(day, this.value);
                const isInRange = !this.isRangeValue
                    ? false
                    : isDateInRange(day, {
                        from: (_a = this.value) === null || _a === void 0 ? void 0 : _a[0],
                        to: ((_b = this.value) === null || _b === void 0 ? void 0 : _b[1]) ||
                            this.hoveredDate ||
                            this.currentDate
                    });
                const orderedValues = Boolean((_c = this.value) === null || _c === void 0 ? void 0 : _c[0])
                    ? [
                        (_d = this.value) === null || _d === void 0 ? void 0 : _d[0],
                        ((_e = this.value) === null || _e === void 0 ? void 0 : _e[1]) || this.hoveredDate
                    ].sort((a, b) => a - b)
                    : [];
                const isStart = this.range && isSameDay(orderedValues[0], day);
                const isEnd = this.range && isSameDay(orderedValues[1], day);
                const isToday = isSameDay(day, new Date());
                const isDisabled = this.isDateDisabled(day);
                const cellKey = `cell-${day.getMonth()}-${day.getDate()}`;
                const className = {
                    [this.getClassName('date')]: true,
                    [this.getClassName('date--current')]: isCurrent,
                    [this.getClassName('date--disabled')]: isDisabled,
                    [this.getClassName('date--overflowing')]: isOverflowing,
                    [this.getClassName('date--today')]: isToday,
                    [this.getClassName('date--selected')]: isSelected,
                    [this.getClassName('date--in-range')]: isInRange,
                    [this.getClassName('date--start')]: isStart,
                    [this.getClassName('date--end')]: isEnd
                };
                const Tag = isSelected
                    ? 'strong'
                    : isToday
                        ? 'em'
                        : 'span';
                return (index.h("td", { "aria-disabled": String(isDisabled), "aria-selected": isSelected ? 'true' : undefined, "aria-current": isToday ? 'date' : isSelected ? 'true' : undefined, class: className, "data-date": getISODateString(day), key: cellKey, onClick: this.onClick, onMouseDown: this.onMouseDown, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave, onFocus: this.onFocus, role: "gridcell", tabIndex: isSameDay(day, this.currentDate) && !this.disabled
                        ? 0
                        : -1 }, index.h(Tag, { "aria-hidden": "true" }, day.getDate()), index.h("span", { class: "visually-hidden" }, Intl.DateTimeFormat(this.locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }).format(day))));
            })));
        })))), showFooter && (index.h("div", { key: '20faa4f76b8424b994ef10c6d336687d4d61d5a9', class: this.getClassName('footer') }, this.showTodayButton && (index.h("button", { key: 'd20c83f63dfb36479bc0f77e4200139480abb910', class: this.getClassName('today-button'), disabled: this.disabled, onClick: this.showToday, type: "button" }, index.h("slot", { key: '051a8b9e71a772f657b830dac19a78c1f7ca7bbe', name: "button-today" }, this.labels.todayButton))), this.showClearButton && (index.h("button", { key: 'bbb20e50dc454efe6bd8303bac2bedc085122faf', class: this.getClassName('clear-button'), disabled: this.disabled, onClick: this.clear, type: "button" }, index.h("slot", { key: '9359ab9370cbdfce73ba844d6a1992d047de3e3b', name: "button-clear" }, this.labels.clearButton))))))));
    }
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "firstDayOfWeek": [{
                "watchFirstDayOfWeek": 0
            }],
        "locale": [{
                "watchLocale": 0
            }],
        "range": [{
                "watchRange": 0
            }],
        "startDate": [{
                "watchStartDate": 0
            }],
        "value": [{
                "watchValue": 0
            }],
        "minDate": [{
                "handleMinDate": 0
            }],
        "maxDate": [{
                "handleMaxDate": 0
            }]
    }; }
};
WCDatepicker.style = wcDatepickerCss();

exports.wc_datepicker = WCDatepicker;
