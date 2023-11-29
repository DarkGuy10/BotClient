import { ChannelType } from 'discord-api-types/v10'
import SVGCaret from './../../public/svg/caret.svg'
import SVGCogsThick from './../../public/svg/cogs-thick.svg'
import SVGCloseButtonCircle from './../../public/svg/close-button-circle.svg'
import SVGDM from './../../public/svg/dm.svg'
import SVGText from './../../public/svg/text.svg'
import SVGTextLimited from './../../public/svg/text-limited.svg'
import SVGVoice from './../../public/svg/voice.svg'
import SVGVoiceLimited from './../../public/svg/voice-limited.svg'
import SVGRules from './../../public/svg/rules.svg'
import SVGAnnouncement from './../../public/svg/announcements.svg'
import SVGAnnouncementLimited from './../../public/svg/announcements-limited.svg'
import SVGDropDown from './../../public/svg/drop-down.svg'
import SVGUpload from './../../public/svg/upload.svg'
import SVGSpoilerHidden from './../../public/svg/spoiler-hidden.svg'
import SVGSpoilerVisible from './../../public/svg/spoiler-visible.svg'
import SVGTrashCan from './../../public/svg/trash-can.svg'
import SVGTrashCanWhite from './../../public/svg/trash-can-white.svg'
import SVGLogout from './../../public/svg/logout.svg'
import SVGMimeVideo from './../../public/svg/mime-video.svg'
import SVGMimeAudio from './../../public/svg/mime-audio.svg'
import SVGMimeImage from './../../public/svg/mime-image.svg'
import SVGMimePdf from './../../public/svg/mime-pdf.svg'
import SVGMimeCode from './../../public/svg/mime-code.svg'
import SVGMimeZip from './../../public/svg/mime-zip.svg'
import SVGMimeText from './../../public/svg/mime-text.svg'
import SVGMimeUnkown from './../../public/svg/mime-unknown.svg'
import SVGBotTagVerified from './../../public/svg/bot-tag-verified.svg'
import SVGRadioUnchecked from './../../public/svg/radio-unchecked.svg'
import SVGRadioChecked from './../../public/svg/radio-checked.svg'
import SVGToggleUnchecked from './../../public/svg/toggle-unchecked.svg'
import SVGToggleChecked from './../../public/svg/toggle-checked.svg'
import SVGCloseButton from './../../public/svg/close-button.svg'
import SVGReplyButton from './../../public/svg/reply-button.svg'
import SVGIDButton from './../../public/svg/id-button.svg'
import SVGMoreButton from './../../public/svg/more-button.svg'
import SVGOpenDMButton from './../../public/svg/open-dm.svg'
import SVGLinkButton from './../../public/svg/link-button.svg'
import SVGGithubLogo from './../../public/svg/github-logo.svg'
import SVGDiscordLogo from './../../public/svg/discord-logo.svg'
import SVGHelp from './../../public/svg/help.svg'
import SVGSelfDeaf from './../../public/svg/self-deaf.svg'
import SVGSelfMute from './../../public/svg/self-mute.svg'
import SVGServerDeaf from './../../public/svg/server-deaf.svg'
import SVGServerMute from './../../public/svg/server-mute.svg'
import SVGSelfVideo from './../../public/svg/self-video.svg'

const SVGChannels = {
	[ChannelType.DM]: <SVGDM />,
	[ChannelType.GuildText]: <SVGText />,
	[ChannelType.GuildText + '_LIMITED']: <SVGTextLimited />,
	[ChannelType.GuildVoice]: <SVGVoice />,
	[ChannelType.GuildVoice + '_LIMITED']: <SVGVoiceLimited />,
	RULES: <SVGRules />,
	[ChannelType.GuildAnnouncement]: <SVGAnnouncement />,
	[ChannelType.GuildAnnouncement + '_LIMITED']: <SVGAnnouncementLimited />,
	[ChannelType.GuildCategory]: <SVGDropDown />,
}

const SVGMimes = {
	VIDEO: <SVGMimeVideo />,
	AUDIO: <SVGMimeAudio />,
	IMAGE: <SVGMimeImage />,
	CODE: <SVGMimeCode />,
	ZIP: <SVGMimeZip />,
	PDF: <SVGMimePdf />,
	TEXT: <SVGMimeText />,
	UNKNOWN: <SVGMimeUnkown />,
}

const SVGVoiceStates = {
	selfDeaf: <SVGSelfDeaf />,
	selfMute: <SVGSelfMute />,
	serverDeaf: <SVGServerDeaf />,
	serverMute: <SVGServerMute />,
	selfVideo: <SVGSelfVideo />,
}

export {
	SVGCaret,
	SVGChannels,
	SVGCogsThick,
	SVGCloseButtonCircle,
	SVGLogout,
	SVGUpload,
	SVGSpoilerHidden,
	SVGSpoilerVisible,
	SVGTrashCan,
	SVGTrashCanWhite,
	SVGMimes,
	SVGBotTagVerified,
	SVGRadioUnchecked,
	SVGRadioChecked,
	SVGToggleUnchecked,
	SVGToggleChecked,
	SVGCloseButton,
	SVGReplyButton,
	SVGIDButton,
	SVGMoreButton,
	SVGLinkButton,
	SVGOpenDMButton,
	SVGGithubLogo,
	SVGDiscordLogo,
	SVGHelp,
	SVGVoiceStates,
	SVGDropDown,
}
