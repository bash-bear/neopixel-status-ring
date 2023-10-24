const colorString = require("color-string");

/**
 * Helper Function that converts any color input into a renderable number
 * @param {*} color rgb, hsl, hex, or keyword.
 * @returns {int} renderable number
 */
const convertColor = (color = "green") => {
    let colArr = [255,255,255]
    if(Array.isArray(color) && (color.length === 3 ||
        color.length === 4)) {
            colArr = color
    } else {
        colArr = colorString.get(color) ? colorString.get(color).value : colArr
    }

    colArr = colorString.to.hex(colArr) ? colorString.to.hex(colArr).replace("#","0x") : "0x0000FF"
    return Number(colArr)
}


/**
 * Returns a prepooulated Array
 * @param {*} count of leds
 * @param {*} value to set. Defaults to 0x000000
 * @returns {Array} of Numbers with off values 
 */
const getPopulatedValueArray = (count, value = 0x000000) => {
    let offArr = []
    for (let i = 0; i < count; i++) {
        offArr[i] = value;
    }
    return offArr;
}


/**
 * Returns an array with dead pixels
 * @param {*} ledArray of leds and values
 * @param {*} deadPixels array
 * @returns {Array} cleaned Array
 */
const cleanDeadPixels = (ledArray, deadPixels ) => {
    deadPixels.forEach( index => {
        if(ledArray[index]){
            ledArray[index] = 0x000000
        }
    });

    return ledArray;
}


module.exports = {
    convertColor,
    getPopulatedValueArray,
    cleanDeadPixels
}