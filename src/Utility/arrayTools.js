// Compare 2 arrays, if any of the elements matched, return true
export const arrayPartlyMatched = (array1, array2) => {
    // loop through array1, if any value is found in array2, return true
    for (let key in array1){
        if (array2.includes(array1[key])){
            return true
        }
    }
    // if no return after loop
    return false
}