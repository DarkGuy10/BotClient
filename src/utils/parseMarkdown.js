import React from 'react'
import Markdown from 'markdown-to-jsx'

/**
 * Parse markdowns to JSX
 * @param {String} str The string to parse
 * @returns {React.Component}
 */
const parseMarkdown = str => {
	return <Markdown options={{ disableParsingRawHTML: true }}>{str}</Markdown>
}

export default parseMarkdown
