/**
 * Convert decimal color to hex with a leading #
 * @param {Number} dColor Decimal color
 * @returns String
 */
const decimalToHexColor = dColor => {
	return dColor ? '#' + dColor.toString(16) : ''
}

export default decimalToHexColor
