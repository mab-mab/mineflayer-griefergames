module.exports = function inject(bot, options) {
    const vote = bot.ggData.loadPatternsAndGetData('vote')

    bot.vote = {}

    bot.vote.collectPresent = () => {
        return bot.chat.getChatActionResult(
            'vote',
            'collectPresent',
            'presentCollected',
            ['noPresents'],
            5000
        )
    }
}
