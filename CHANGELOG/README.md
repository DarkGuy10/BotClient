# CHANGELOG

## v0.8.1-alpha

-   fix: some non-voice channels have nullish member props, causing channel list to become empty (#31)
-   fix: unhandled promise rejection while fetching message-reference (#31)

## v0.8.0-alpha

-   Added emoji parsing
-   Added markdown parsing
-   Added non-blocking mention fetching
-   Voice channels now show in-call members
-   Added message action buttons (copy link, copy id)
-   Added title toolbar icons
-   Fixed bug in Client#getUserData
-   Fixed minor styling issues
-   Rewritten docs

## v0.7.0-alpha

-   Added DMs
-   Fixed bug in sticker rendering
-   Removed blocking code from mention formating

## v0.6.0-alpha

-   Added autoupdates
-   Fixed build configs for `linux` and `win32`

## v0.5.0-alpha

-   Added replying feature
-   Corrected styling on guild items without icons
-   Created serializers for cleaner code

## v0.4.2-alpha

-   Migrated to yarn 2
-   Added message mention formatting and highlighting
-   Fixed multiline message rendering
-   Created CSS overrides for @skyra-project/discord-components

## v0.4.1-alpha

-   Refactored a bunch of stuff; no bug fixes, no features added.

## v0.4.0-alpha

-   Added User Settings (persistant login)
-   Create `AppData` service
-   Re-brand logo and bootloops

## v0.3.0-alpha

-   Complete React rewrite
-   Added a neat alert management system
-   Fixed "stuck on bootloop" issue
-   Switched to appdata instead of localstorage
-   Added logout feature
-   Added member list
-   Updated file upload to match discord
-   Fixed CSS to match discord
-   Switched to `yarn` package manager
-   Added scripts to `package.json`
-   Added other dependencies (check `package.json`)
-   Added prettier hook for linting
-   Re-organized project structure

## v0.2.2-alpha

-   Updated dependencies
-   Changed preload message count to 100

## v0.2.1-alpha

-   Added svg for uploadButton
-   Refactor: rename color/bgcolors to `.dark-theme` variables
-   Fixed styling for messageField to match originl client

## v0.2.0-alpha

-   Added file upload
-   Fixed fonts to match original client
-   Fixed image attachment resize to match original client
-   Fixed styling to match original client's `.dark-theme`

## v0.1.0-alpha

-   Temp fix for auto-scrolling
-   Added sticker support
-   Fixed faulty image resize
-   Added message replies
-   Added Tenor-gif support
-   Added video-embed support (limited)

## v0.0.2-alpha

-   Fixed `./app` structure
-   Fixed code readability
-   Added code comments

## v0.0.1-alpha

-   First alpha release
