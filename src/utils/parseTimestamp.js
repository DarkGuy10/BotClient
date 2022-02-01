/**
 * Parses timestamp as mm-dd-yyyy string
 * @param {*} timestamp Timestamp to parse
 * @returns String
 */
const parseTimestamp = timestamp => {
	let dateObject = new Date(timestamp)
	return `${
		dateObject.getMonth() + 1
	}/${dateObject.getDate()}/${dateObject.getFullYear()}`
}

export default parseTimestamp
