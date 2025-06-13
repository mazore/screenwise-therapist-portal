import moment from 'moment';

function getPastTimeUnits(num, unit, startOfUnit, getLabel) {
    const timeUnits = [];
    for (let i = 0; i < num; i++) {
        const startOfTimeUnit = moment().startOf(startOfUnit).subtract(i, unit);
        timeUnits.unshift({
            label: getLabel(startOfTimeUnit),
            startTime: startOfTimeUnit.unix(),
            endTime: moment(startOfTimeUnit).endOf(startOfUnit).unix(),
        });
    }
    return timeUnits;
}

function getPastDays(num, getLabel) {
    return getPastTimeUnits(num, 'days', 'day', getLabel);
}

function getPastWeeks(num, getLabel) {
    return getPastTimeUnits(num, 'weeks', 'isoWeek', getLabel);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function computeStats(statName, getAttribute, mealType, timeMode, mealHistory) {
    const startTime = Date.now();

    const { resolution, amount, getLabel } = timeMode;

    // Initialize data array
    let data = [];
    if (resolution == 'month') {
        data = getPastTimeUnits(amount, 'months', 'month', (start) => start.format('MMM YYYY'))
        .map(month => ({ ...month, cumulativeVal: 0, numMeals: 0 }));
    }

    else if (resolution == 'week') {
        data = getPastWeeks(amount, getLabel).map((week) => ({ ...week, cumulativeVal: 0, numMeals: 0, rangeLabel: `${moment(week.startTime * 1000).format("MMM D")} – ${moment(week.endTime * 1000).format("MMM D")}`, }));
    }
    else if (resolution == 'day') {
        data = getPastDays(amount, getLabel).map((day) => ({ ...day, cumulativeVal: 0, numMeals: 0 }));
    }

    // Fill in data array with meal data
    for (const mealData of mealHistory) {
        if (mealType && mealData.mealType != mealType) {
            continue;
        }

        const value = getAttribute(mealData);
        if (value) {
            if (resolution == 'month') {
                const time = mealData.mealStartTime / 1000; // convert ms to seconds to match startTime/endTime
                for (let i = data.length - 1; i >= 0; i--) {
                    if (time >= data[i].startTime && time <= data[i].endTime) {
                        data[i].cumulativeVal += value;
                        data[i].numMeals++;
                        break;
                    }
                }
            }
            else if (resolution == 'week' || resolution == 'day') {
                const time = mealData.mealStartTime / 1000;
                for (let i = data.length - 1; i >= 0; i--) {
                    if (time >= data[i].startTime && time <= data[i].endTime) {
                        data[i].cumulativeVal += value;
                        data[i].numMeals++;
                        if (resolution == 'day' && mealData.mealAttributes?.length > 0) {
                            data[i].highlighted = true; // Highlight days with meal attributes
                        }
                        break;
                    }
                };
            }
        }
    }

    // Average all the data points, rounding to one decimal place (at most)
    for (let i = 0; i < data.length; i++) {
        data[i].y = data[i].numMeals
            ? Math.round((data[i].cumulativeVal / data[i].numMeals) * 10) / 10
            : 0;
    }

    return data;
}