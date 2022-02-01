# BUG TRACK

I'm using this file to keep a track of the bugs I encountered, and their solutions <br>

###### Yes I have a really bad memory...

1. #### discord.js v13 syntax not supported on renderer process

    ~~Downgrade to djs v12 (I really wish there was an alternative)~~<br>
    Establish IPC

2. #### CORS while interacting with discord API
    ~~Set `webSecurity: false` in `mainWindow.webPreferences` and edit `User-Agent` for all outgoing requests as required by Discord API (`Discord Bot ($url, $version)`)~~ <br>
    Make all API interactions from main process and use IPC invoke-handle for data fetching.
