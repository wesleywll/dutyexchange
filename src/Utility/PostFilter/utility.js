import cnst from './constant'
import Moment from 'moment'


// -------------- Validator ----------------------------
// validate field
export const getFieldValidity = (field, value) => {
    let isValid = true;
    let error = '';
    switch (field) {
        case cnst.OFFER_FLIGHT_CODE:
        case cnst.REQUEST_FLIGHT_CODE:
            isValid = value.length > 0;
            error = isValid ? '' : 'cannot be empty';
            break;

        case cnst.OFFER_START_DATE:
        case cnst.OFFER_END_DATE:
        case cnst.REQUEST_START_DATE:
        case cnst.REQUEST_END_DATE:
            isValid = !Moment(value).isBefore(Moment(), 'day');
            error = isValid ? '' : 'date passsed';
            break;

        default:
            // default return true
            break;
    }
    return { isValid: isValid, error: error };
}

// ----------- Formatter -------------------------------
// format input value
export const getFormattedValue = (field, value) => {
    switch (field) {
        case cnst.OFFER_ROSTER_CODE:
        case cnst.REQUEST_ROSTER_CODE:
            return value.trim().toUpperCase();

        case cnst.OFFER_FLIGHT_CODE:
        case cnst.REQUEST_REGION_CODE:
        case cnst.REQUEST_FLIGHT_CODE:
            if (value.length === 0) {
                // if no selection, default to 'Any'
                value = [cnst.ANY] // flight and region codes are array
            } else if (value.length > 1 && value.includes(cnst.ANY)) {
                // if more than one selection, remove 'Any'
                value.splice(value.indexOf(cnst.ANY), 1)
            }
            return value

        default:
            return value
    }
}