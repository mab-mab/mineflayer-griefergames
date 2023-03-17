const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const serverInfo = bot.ggData.serverInfo
    bot.serverInfo = {
        events: new EventEmitter()
    }

    bot.serverInfo.getCurrentServer = () => bot.scoreboard.sidebar.items[2].displayName.toString()

    bot.serverInfo.getBalance = () => bot.scoreboard.sidebar.items[5].displayName.toString()

    bot.serverInfo.getOnlineCount = () => bot.scoreboard.sidebar.items[8].displayName.toString()

    bot.serverInfo.getPlaytime = () => bot.scoreboard.sidebar.items[11].displayName.toString()

    bot.serverInfo.getTranslatedServer = () => {
        const scoreboardServer = bot.serverInfo.getCurrentServer()
        if (serverInfo.scoreboardCitybuildRegex.test(scoreboardServer) || (serverInfo.nonCitybuildServer.includes(scoreboardServer.toLowerCase()) || serverInfo.abnormallyNamedCitybuildServer.includes(scoreboardServer.toLowerCase()))) {
            return scoreboardServer.toLowerCase()
        }

        const switcherName = serverInfo.scoreboardToSwitcherMap[scoreboardServer]
        if (switcherName) {
            return switcherName
        }
    }

    bot.serverInfo.isOnCitybuild = () => !serverInfo.nonCitybuildServer.includes(bot.serverInfo.getTranslatedServer())

    bot.serverInfo.isHub = () => bot.serverInfo.getTranslatedServer() === serverInfo.hubIdentifier

    bot.serverInfo.isPortal = () => bot.serverInfo.getTranslatedServer() === serverInfo.portalIdentifier

    bot.on('scoreUpdated', (_, scoreboardItem) => {
        if (scoreboardItem.value === 14) {
            bot.serverInfo.events.emit('scoreboardLoaded')
            bot.serverInfo.events.emit('join')
        }
    })
}