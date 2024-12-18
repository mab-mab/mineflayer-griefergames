module.exports = function load(bot, ns) {
    const orbs = ns['orbs'].data

    ns.orbs.getBalance = (window) => {
        return bot.pattern.item.findMatching(window)
    }

    ns.orbs.tryToOpen = (traderEntity) => {
        bot.activateEntity(traderEntity)
        return bot.getActionResult({
            patternHead: 'orbs',
            successEvents: ["windowOpen:trader"],
            failureEvents: []
        })
    }

    ns.orbs.sellItem = (window, quantityOption = 2) => {
        const sellOptions = bot.pattern.item.findMatching(window)
        return bot.window.clickFallible({
            window,
            slot: sellOptions[quantityOption],
            patternHead: 'orbTrader',
            successEvent: 'saleSuccessful',
            currentWindowPatternName: 'sellItem',
            timeout: 1000
        })
    }
}
