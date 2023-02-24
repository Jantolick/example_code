A personal-use Discord bot set up with some async features and a skeleton which allows for some easy future modifications/expansion.

Primary features:

- Easy integration with Discord using DiscordJS
- DB integration with models via Sequelize and Postgres, though swapping out DBs should be trivial
- Rock Paper Scissors, a scheduler bot with a demo channel announcement setup and user registration system
- Bot puppeting for channels

.env file in root requires:

- token: the Discord token for bot use
- PUBLIC_KEY: public key generated from the Discord developers page
- BOT_URL: bot url from same
- BOT_CLIENT_ID: client id for use with the bot, again received from the Discord developers page
- BOT_GUILD_ID: primary channel ID for some of the bot's speaking functions
- BOT_MASTER_ID: name of the user who will have puppeting access for the bot's in-channel speaking features
- TARGET_CHANNEL_ID: channel that the bot will join and be listening to users for potential /action-less reactions
- ART_CHANNEL_ID: The bot's timer announcements were built with an art challenge in mind

Use of the database requires:

- HOST: DB host
- PORT: DB port
- DATABASE: DB name
- DBUSER: DB user login name
- PASSWORD: DB user password
- SSL: relative location of root.crt
