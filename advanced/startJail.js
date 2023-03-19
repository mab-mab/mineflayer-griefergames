module.exports = function inject(bot, options) {
    const startJail = bot.ggData.startJail
    bot.chat.loadPatterns(startJail)
    bot.window.loadPatterns(startJail)

    bot.startJail = {}

    bot.startJail.openMenu = () => {
        return bot.chat.getChatActionResult(
            startJail.commands.openWindow,
            'windowOpen:startJailMenu',
            [],
            5000
        )
    }

    bot.startJail.startTokenPurchase = (window) => {
        return bot.window.getClickActionResult(
            window,
            bot.window.getMatchingItem(window, startJail.itemPatterns.purchaseToken).slot,
            0,
            'windowOpen:confirmPurchase',
            [],
            1000
        )
    }

    bot.startJail.confirmTokenPurchase = (window) => {
        return bot.window.getClickActionResult(
            window,
            bot.window.getMatchingItem(window, startJail.itemPatterns.confirmPurchase).slot,
            0,
            'chat:purchaseSuccess',
            ['insufficientBalanceError'],
            1000
        )
    }

    bot.startJail.cancelTokenPurchase = (window) => {
        return bot.window.getClickActionResult(
            window,
            bot.window.getMatchingItem(window, startJail.itemPatterns.cancelPurchase).slot,
            0,
            'chat:purchaseCancelled',
            [],
            1000
        )
    }
}