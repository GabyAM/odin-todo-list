import { parseISO, formatDistanceToNow } from 'https://cdn.jsdelivr.net/npm/date-fns@2.30.0/+esm';

export function formatToRelativeDate(unformattedDate) {
    return formatDistanceToNow(parseISO(unformattedDate), {addSuffix: true});
}