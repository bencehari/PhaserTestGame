"use strict"

/**
 * @param {number} fontSize
 * @returns {TextStyle}
 */
export function defaultTextStyle(fontSize) {
    return {
        font: `${fontSize}px Arial`,
        fill: '#FFFFFF',
    }
}
