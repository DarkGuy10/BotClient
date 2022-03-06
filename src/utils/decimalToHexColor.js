/**
 * Convert decimal color to hex with a leading #
 * @param {Number} dColor Decimal color
 * @returns String
 */
const decimalToHexColor = color => {
	return color ? `#${color.toString(16).padStart(6, '0')}` : ''
}

export default decimalToHexColor
