import { ChannelType } from 'discord-api-types/v10'
import { ReactComponent as SVGCaret } from './../assets/svg/caret.svg'
import { ReactComponent as SVGCogsThick } from './../assets/svg/cogs-thick.svg'
import { ReactComponent as SVGCloseButtonCircle } from './../assets/svg/close-button-circle.svg'
import { ReactComponent as SVGDM } from './../assets/svg/dm.svg'
import { ReactComponent as SVGText } from './../assets/svg/text.svg'
import { ReactComponent as SVGTextLimited } from './../assets/svg/text-limited.svg'
import { ReactComponent as SVGVoice } from './../assets/svg/voice.svg'
import { ReactComponent as SVGVoiceLimited } from './../assets/svg/voice-limited.svg'
import { ReactComponent as SVGRules } from './../assets/svg/rules.svg'
import { ReactComponent as SVGAnnouncement } from './../assets/svg/announcements.svg'
import { ReactComponent as SVGAnnouncementLimited } from './../assets/svg/announcements-limited.svg'
import { ReactComponent as SVGDropDown } from './../assets/svg/drop-down.svg'
import { ReactComponent as SVGUpload } from './../assets/svg/upload.svg'
import { ReactComponent as SVGSpoilerHidden } from './../assets/svg/spoiler-hidden.svg'
import { ReactComponent as SVGSpoilerVisible } from './../assets/svg/spoiler-visible.svg'
import { ReactComponent as SVGTrashCan } from './../assets/svg/trash-can.svg'
import { ReactComponent as SVGTrashCanWhite } from './../assets/svg/trash-can-white.svg'
import { ReactComponent as SVGLogout } from './../assets/svg/logout.svg'
import { ReactComponent as SVGMimeVideo } from './../assets/svg/mime-video.svg'
import { ReactComponent as SVGMimeAudio } from './../assets/svg/mime-audio.svg'
import { ReactComponent as SVGMimeImage } from './../assets/svg/mime-image.svg'
import { ReactComponent as SVGMimePdf } from './../assets/svg/mime-pdf.svg'
import { ReactComponent as SVGMimeCode } from './../assets/svg/mime-code.svg'
import { ReactComponent as SVGMimeZip } from './../assets/svg/mime-zip.svg'
import { ReactComponent as SVGMimeText } from './../assets/svg/mime-text.svg'
import { ReactComponent as SVGMimeUnkown } from './../assets/svg/mime-unknown.svg'
import { ReactComponent as SVGBotTagVerified } from './../assets/svg/bot-tag-verified.svg'
import { ReactComponent as SVGRadioUnchecked } from './../assets/svg/radio-unchecked.svg'
import { ReactComponent as SVGRadioChecked } from './../assets/svg/radio-checked.svg'
import { ReactComponent as SVGToggleUnchecked } from './../assets/svg/toggle-unchecked.svg'
import { ReactComponent as SVGToggleChecked } from './../assets/svg/toggle-checked.svg'
import { ReactComponent as SVGCloseButton } from './../assets/svg/close-button.svg'
import { ReactComponent as SVGReplyButton } from './../assets/svg/reply-button.svg'
import { ReactComponent as SVGIDButton } from './../assets/svg/id-button.svg'
import { ReactComponent as SVGMoreButton } from './../assets/svg/more-button.svg'
import { ReactComponent as SVGOpenDMButton } from './../assets/svg/open-dm.svg'
import { ReactComponent as SVGLinkButton } from './../assets/svg/link-button.svg'
import { ReactComponent as SVGGithubLogo } from './../assets/svg/github-logo.svg'
import { ReactComponent as SVGDiscordLogo } from './../assets/svg/discord-logo.svg'
import { ReactComponent as SVGHelp } from './../assets/svg/help.svg'
import { ReactComponent as SVGSelfDeaf } from './../assets/svg/self-deaf.svg'
import { ReactComponent as SVGSelfMute } from './../assets/svg/self-mute.svg'
import { ReactComponent as SVGServerDeaf } from './../assets/svg/server-deaf.svg'
import { ReactComponent as SVGServerMute } from './../assets/svg/server-mute.svg'
import { ReactComponent as SVGSelfVideo } from './../assets/svg/self-video.svg'

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
