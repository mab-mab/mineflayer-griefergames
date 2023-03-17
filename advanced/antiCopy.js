// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const antiCopy = bot.ggData.antiCopy
    bot.loadChatPatterns(bot.ggData.antiCopy)

    bot.antiCopy = {}

    bot.antiCopy.getProtector = (stack) => {
        if (stack.customLore && stack.customLore.length >= 1) {
            return stack.customLore[0].replace(/§./g, '').match(antiCopy.loreRegex)?.[1]
        }
        return null
    }

    bot.antiCopy.addProtection = () => {
        return bot.chat.getChatActionResult(antiCopy.commands.toggleProtection(), 'mapAntiCopyProtectionAdded', ['mapAntiCopyNotOwnerError', 'mapAntiCopyProtectionRemoved'], 7500)
    }

    bot.antiCopy.removeProtection = () => {
        return bot.chat.getChatActionResult(antiCopy.commands.toggleProtection(), 'mapAntiCopyProtectionRemoved', ['mapAntiCopyProtectionAdded', 'mapAntiCopyNotOwnerError'], 7500)
    }
}
