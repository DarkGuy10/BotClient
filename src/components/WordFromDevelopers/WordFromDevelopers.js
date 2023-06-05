import styles from './WordFromDevelopers.module.css'
import menheraWave from './../../assets/images/menhera-wave.png'
import { DiscordCustomEmoji } from '@skyra/discord-components-react'

const WordFromDevelopers = props => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<img src={menheraWave} className={styles.lightFade} alt="nice knee" />
				<h1 className={styles.headerText}>Word From Developers</h1>
				<div className={styles.subtext}>Yo!</div>
				<div className={styles.content}>
					<p>
						Thanks for using our client!{' '}
						<DiscordCustomEmoji
							url="https://cdn.discordapp.com/emojis/816599114740924459.webp?size=44&quality=lossless"
							name="AE_HeartHug"
						/>
						<br />I started this as a hobby project and stayed since ya'll loved
						it.{' '}
						<DiscordCustomEmoji
							url="https://cdn.discordapp.com/emojis/768205430785704006.webp?size=44&quality=lossless"
							name="S_UrushiBigSmiles"
						/>
						<br />
						And I kid you not, I've never had these many users before!?{' '}
						<DiscordCustomEmoji
							url="https://cdn.discordapp.com/emojis/818794157090537472.gif?size=44&quality=lossless"
							name="AE_ShockedWhat"
						/>
					</p>
					<p>
						<DiscordCustomEmoji
							url="https://cdn.discordapp.com/emojis/848436016675422248.webp?size=44&quality=lossless"
							name="ZeroTwo_Peek"
						/>
						If you had fun, please leave a star on the{' '}
						<a href="https://github.com/DarkGuy10/BotClient">repo</a>
						. It really motivates me to work on the project!
						<br />{' '}
						<DiscordCustomEmoji
							url="https://cdn.discordapp.com/emojis/852960915011534910.webp?size=44&quality=lossless"
							name="ZeroTwo_Heart"
						/>{' '}
						If you want to show support, you can{' '}
						<a href="https://www.patreon.com/darkguy10">become a patreon!</a>
						<br /> Any tier is fine, its the thought that matters.{' '}
						<DiscordCustomEmoji
							url="https://cdn.discordapp.com/emojis/736584323511091272.webp?size=44&quality=lossless"
							name="AE_KioYes"
						/>
					</p>
					<p>
						Have a blast of a day ahead!!{' '}
						<DiscordCustomEmoji
							url="https://cdn.discordapp.com/emojis/816588263816822794.webp?size=44&quality=lossless"
							name="AE_ThumbsUpCool"
						/>
					</p>
					<p>
						- <a href="https://github.com/DarkGuy10/">@DarkGuy10</a>
					</p>
				</div>
			</div>
		</div>
	)
}

export default WordFromDevelopers
