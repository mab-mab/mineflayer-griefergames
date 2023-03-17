const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const playerUtils = bot.ggData.playerUtils
    bot.loadChatPatterns(playerUtils)
    
    const ChatMessage = require('prismarine-chat')(bot.version)
    
    bot.playerUtils = {
        events: new EventEmitter()
    }

    bot.playerUtils.getRank = (username = bot.entity.username) => {
        const displayNameParts = bot.players[username].displayName.toString().split(' ')
        if (displayNameParts.length === 3) {
            return displayNameParts[0]
        }
        return null
    }

    bot.playerUtils.resolveNickname = (nickname) => {
		if (!nickname.startsWith(playerUtils.nicknamePrefix) || bot.players[nickname]) return nickname

        for (const player of Object.values(bot.players)) {
            const splitDisplayName = player.displayName.toString().split(' ')
            if (splitDisplayName.length !== 3) continue
            if (splitDisplayName[2] === nickname) return player.username
        }
        return null
	}

    bot.playerUtils.getInventory = (username) => {
        return bot.chat.getChatActionResult(playerUtils.commands.getInventory(username), 'inventoryOpened', ['chat:playerNotFoundError'], 5000, bot.playerUtils.events)
    }

    bot.playerUtils.getEnderChest = (username) => {
        return bot.chat.getChatActionResult(playerUtils.commands.getEnderChest(username), 'enderChestOpened', ['chat:playerNotFoundError'], 5000, bot.playerUtils.events)
    }

    bot.playerUtils.getMiscView = (username) => {
        return bot.chat.getChatActionResult(playerUtils.commands.getMiscView(username), 'miscViewOpened', ['chat:playerNotFoundError'], 6000, bot.playerUtils.events)
    }

    bot.on('windowOpen', window => {
        const title = ChatMessage.fromNotch(window.title).toString()
        if (title === 'Inventory') {
            bot.playerUtils.events.emit('inventoryOpened', window)
        } else if (title === 'Ender Chest') {
            bot.playerUtils.events.emit('enderChestOpened', window)
        } else if (title.startsWith('Ansicht - ')) {
            bot.playerUtils.events.emit('miscViewOpened', window)
        }
    })
}