const GENERAL_MENTION_PATTERN =
	/(@everyone|@here|<@!?\d{17,19}>|<@&\d{17,19}>|<#\d{17,19}>)/g

const EVERYONE_PATTERN = /@(everyone|here)/
const USERS_PATTERN = /<@!?(\d{17,19})>/
const ROLES_PATTERN = /<@&(\d{17,19})>/
const CHANNELS_PATTERN = /<#(\d{17,19})>/

export {
	GENERAL_MENTION_PATTERN,
	EVERYONE_PATTERN,
	USERS_PATTERN,
	ROLES_PATTERN,
	CHANNELS_PATTERN,
}
