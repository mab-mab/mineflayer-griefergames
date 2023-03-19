// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const home = bot.ggData.home
    bot.loadChatPatterns(home)
    // tpFailure
    // tpSpamWarning

    bot.home = {}

    bot.home.getRawList = () => {
        return bot.chat.getChatActionResult(
            home.commands.getHomes,
            ['chat:homeList', 'chat:homesUnset'],
            [],
            5000
        )
    }

    bot.home.setHome = (homeIdentifier) => {
        return bot.chat.getChatActionResult(
            bot.buildCommand(home.commands.setHome, homeIdentifier),
            'chat:homeSet',
            [],
            5000
        )
    }

    bot.home.deleteHome = (homeIdentifier) => {
        return bot.chat.getChatActionResult(
            bot.buildCommand(home.commands.deleteHome, homeIdentifier),
            'chat:homeDeleted',
            ['chat:homeNotFoundError'],
            5000
        )
    }

    bot.home.teleportTo = (homeIdentifier) => {
        return bot.chat.getChatActionResult(
            bot.buildCommand(home.commands.teleportTo, homeIdentifier),
            'forcedMove',
            ['chat:homeNotFoundError', 'chat:tpFailure', 'chat:tpSpamWarning'],
            5000
        )
    }

    bot.home.parseList = (str) => {
        if (str === 'keine') return []
        return str.split(', ')
    }
}
