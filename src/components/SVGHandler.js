import { ReactComponent as SVGCogsThick } from './../assets/svg/cogs-thick.svg'
import { ReactComponent as SVGText } from './../assets/svg/text.svg'
import { ReactComponent as SVGTextLimited } from './../assets/svg/text-limited.svg'
import { ReactComponent as SVGVoice } from './../assets/svg/voice.svg'
import { ReactComponent as SVGVoiceLimited } from './../assets/svg/voice-limited.svg'
import { ReactComponent as SVGRules } from './../assets/svg/rules.svg'
import { ReactComponent as SVGAnnouncement } from './../assets/svg/announcements.svg'
import { ReactComponent as SVGDropDown } from './../assets/svg/drop-down.svg'
import { ReactComponent as SVGUpload } from './../assets/svg/upload.svg'

const SVGChannels = {
	GUILD_TEXT: <SVGText />,
	GUILD_TEXT_LIMITED: <SVGTextLimited />,
	GUILD_VOICE: <SVGVoice />,
	GUILD_VOICE_LIMITED: <SVGVoiceLimited />,
	RULES: <SVGRules />,
	GUILD_NEWS: <SVGAnnouncement />,
	GUILD_CATEGORY: <SVGDropDown />,
}

export { SVGChannels, SVGCogsThick, SVGUpload }
