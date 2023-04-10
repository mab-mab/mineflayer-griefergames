module.exports = function (bot, options) {
    const extractNonBoldColorCodes = (str) => {
        let colorCodes = ''
        for (let i = 0; i < str.length; i++) {
            if (str[i - 1] === '§' && str[i] !== 'l') colorCodes += str[i]
        }
        return colorCodes
    }

    const clearDoubleCodes = (str) => {
        let clearedStr = ''
        for (let i = 0; i < str.length; i++) {
            if (str[i] === clearedStr[clearedStr.length - 1]) {
                continue
            } else {
                clearedStr += str[i]
            }
        }
        return clearedStr
    }

    bot.pattern.prefix = {}

    bot.pattern.prefix.matchFormattedString = (str, pattern) => {
        const codes = clearDoubleCodes(extractNonBoldColorCodes(str))
        pattern = clearDoubleCodes(pattern)

        let isMatch = true
        for (let i = 0; i < codes.length; i++) {
            isMatch = codes[i] === pattern[0][i % pattern.length]
        }
        return isMatch
    }

    bot.pattern.prefix.match = (displayName, prefixPattern) => {
        const [rank, _, name] = displayName.toMotd().split(' ')

        if (typeof prefixPattern === 'string') {
            prefixPattern = [prefixPattern, prefixPattern]
        }

        return (
            bot.pattern.prefix.matchFormattedString(rank, prefixPattern[0]) &&
            bot.pattern.prefix.matchFormattedString(name, prefixPattern[1])
        )
    }
}