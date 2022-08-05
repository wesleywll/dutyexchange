import cnst from './constant'

// -------------- Validator ----------------------------
// validate field
export const getFieldValidity = (field, value) => {
    let pattern = null;
    let isValid = true;
    let error= '';
    switch (field) {
        case cnst.EMAIL:
        case cnst.CONTACT_EMAIL:
            pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value);
            error= isValid? '':'invalid email format'
            break;

        case cnst.PASSWORD:
            isValid = value.length >= 6;
            error= isValid? '':'at least 6 characters'            
            break;

        case cnst.FIRST_NAME:
        case cnst.LAST_NAME:
        case cnst.RANK:
        case cnst.FLEET:
        case cnst.ROSTER_NAME:
        case cnst.IS_COMPANY_CHECK:
        case cnst.FB_USERNAME:
            isValid = value.length > 0;
            error= isValid? '':'cannot be empty'            
            break;

        case cnst.MOBILE:
            pattern = /^\d+$/;
            isValid = pattern.test(value);
            error= isValid? '':'number only'
            break;

        default:
            // default return true
            break;
    }
    return {isValid: isValid, error: error};
}

// ----------- Formatter -------------------------------
// format input value
export const getFormattedValue = (field, value) => {
    switch (field) {
        case cnst.EMAIL:
        case cnst.CONTACT_EMAIL:
            // remvoe whitespace
            return value.trim()

        case cnst.FIRST_NAME:
        case cnst.LAST_NAME:
            return value

        case cnst.ROSTER_NAME:
            // all upper case
            return value.toUpperCase()

        case cnst.IS_COMPANY_CHECK:
            // remove decimal 
            return value.replace('.', '')

        case cnst.MOBILE:
            // remove non-number
            return value.replace(/\D/g, '')

        default:
            return value
    }
}