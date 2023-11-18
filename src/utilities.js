import { parseISO, formatDistanceToNow, format, add } from 'https://cdn.jsdelivr.net/npm/date-fns@2.30.0/+esm';

export function formatToRelativeDate(unformattedDate) {
    return formatDistanceToNow(parseISO(unformattedDate), {addSuffix: true});
}

export function isDateUpcoming(date) {

    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const dateInTwoWeeks = format(add(parseISO(currentDate), {weeks: 2}), 'yyyy-MM-dd')
    return (date > currentDate && date < dateInTwoWeeks) 
}