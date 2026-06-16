import { b as bootstrapLazy } from './index-Dw5AaH1Q.js';
export { s as setNonce } from './index-Dw5AaH1Q.js';
import { g as globalScripts } from './app-globals-DQuL1Twl.js';

const defineCustomElements = async (win, options) => {
  if (typeof window === 'undefined') return undefined;
  await globalScripts();
  return bootstrapLazy([["wc-datepicker",[[262,"wc-datepicker",{"disabled":[4],"disableDate":[16],"elementClassName":[1,"element-class-name"],"firstDayOfWeek":[2,"first-day-of-week"],"goToRangeStartOnSelect":[4,"go-to-range-start-on-select"],"range":[4],"labels":[16],"locale":[1],"maxDate":[1,"max-date"],"maxSearchDays":[2,"max-search-days"],"minDate":[1,"min-date"],"navigateWeeks":[4,"navigate-weeks"],"nextMonthButtonContent":[1,"next-month-button-content"],"nextYearButtonContent":[1,"next-year-button-content"],"previousMonthButtonContent":[1,"previous-month-button-content"],"previousYearButtonContent":[1,"previous-year-button-content"],"showClearButton":[4,"show-clear-button"],"showMonthStepper":[4,"show-month-stepper"],"showTodayButton":[4,"show-today-button"],"showYearStepper":[4,"show-year-stepper"],"startDate":[1,"start-date"],"value":[1040],"currentDate":[32],"hoveredDate":[32],"weekdays":[32]},null,{"firstDayOfWeek":[{"watchFirstDayOfWeek":0}],"locale":[{"watchLocale":0}],"range":[{"watchRange":0}],"startDate":[{"watchStartDate":0}],"value":[{"watchValue":0}],"minDate":[{"handleMinDate":0}],"maxDate":[{"handleMaxDate":0}]}]]]], options);
};

export { defineCustomElements };
