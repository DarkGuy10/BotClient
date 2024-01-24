# CHANGELOG

## v0.12.1-alpha

- fix: wrong filepath to build resources
- fix: wrong build script in workflow file

## v0.12.0-alpha

- fix: avoid login attempt with empty tokens
- chore: bump djs-related deps
- chore: bump electron to 28.1.4
- chore: bump yarn to 4.0.2
- chore: bump react, react-dom to 18.2.0
- chore: bump react-scripts to 5.0.1
- chore: bump misc dependencies

## v0.11.0-alpha

- feat: add context menu api
- feat: add context menu to message elements
- feat: migrate to `discord.js@v14`

## v0.10.4-alpha

- fix: upgrade discord.js to support breaking API changes (#46)

## v0.10.3-alpha

- fix: add missing svg for private announcement channel
- fix: correct svg fill colors
- fix: disable opening DMs for other bots
- fix: prevent Chat component unload on server switching
- fix: correct replying and mention styles

## v0.10.2-alpha

- fix: home screen message

## v0.10.1-alpha

- feat: add WordFromDevelopers on homescreen
- fix: minor styling issues
- refactor: a bunch of stuff
- chore: migrate to React 18
- chore(deps): bump all deps

## v0.10.0-alpha

- feat: load older messages on scrolling up (#33)
- feat: add ErrorBoundary for handling crashes
- feat: add channel start header
- feat: add window reload shortcut
- feat: show status indicators
- fix: prevent selecting disallowed channels (#34)
- fix: bad autoscrolling
- fix: correct bad styling
- fix: open home by default (#35)
- refactor: export SVGDropDown
- refactor: add ready event

## v0.9.0-alpha

- feat: delete messages
- fix: add highlighting on `@everyone` mentions
- feat: directly open DMs from message
- refactor: add separate component for MessageAction
- feat: render common system messages

## v0.8.3-alpha

- feat: add tooltips
- refactor: now App state is not provided to UserSettings
- refactor: remove useless styles from index.css
- chore: update dependencies
- chore: remove extra assets
- chore: update build.yml

## v0.8.2-alpha

- fix: (#31)

## v0.8.1-alpha

- fix: some non-voice channels have nullish member props, causing channel list to become empty (#31)
- fix: unhandled promise rejection while fetching message-reference (#31)

## v0.8.0-alpha

- Added emoji parsing
- Added markdown parsing
- Added non-blocking mention fetching
- Voice channels now show in-call members
- Added message action buttons (copy link, copy id)
- Added title toolbar icons
- Fixed bug in Client#getUserData
- Fixed minor styling issues
- Rewritten docs

## v0.7.0-alpha

- Added DMs
- Fixed bug in sticker rendering
- Removed blocking code from mention formating

## v0.6.0-alpha

- Added autoupdates
- Fixed build configs for `linux` and `win32`

## v0.5.0-alpha

- Added replying feature
- Corrected styling on guild items without icons
- Created serializers for cleaner code

## v0.4.2-alpha

- Migrated to yarn 2
- Added message mention formatting and highlighting
- Fixed multiline message rendering
- Created CSS overrides for @skyra-project/discord-components

## v0.4.1-alpha

- Refactored a bunch of stuff; no bug fixes, no features added.

## v0.4.0-alpha

- Added User Settings (persistant login)
- Create `AppData` service
- Re-brand logo and bootloops

## v0.3.0-alpha

- Complete React rewrite
- Added a neat alert management system
- Fixed "stuck on bootloop" issue
- Switched to appdata instead of localstorage
- Added logout feature
- Added member list
- Updated file upload to match discord
- Fixed CSS to match discord
- Switched to `yarn` package manager
- Added scripts to `package.json`
- Added other dependencies (check `package.json`)
- Added prettier hook for linting
- Re-organized project structure

## v0.2.2-alpha

- Updated dependencies
- Changed preload message count to 100

## v0.2.1-alpha

- Added svg for uploadButton
- Refactor: rename color/bgcolors to `.dark-theme` variables
- Fixed styling for messageField to match originl client

## v0.2.0-alpha

- Added file upload
- Fixed fonts to match original client
- Fixed image attachment resize to match original client
- Fixed styling to match original client's `.dark-theme`

## v0.1.0-alpha

- Temp fix for auto-scrolling
- Added sticker support
- Fixed faulty image resize
- Added message replies
- Added Tenor-gif support
- Added video-embed support (limited)

## v0.0.2-alpha

- Fixed `./app` structure
- Fixed code readability
- Added code comments

## v0.0.1-alpha

- First alpha release
