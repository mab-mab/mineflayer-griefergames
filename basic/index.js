const PLUGINS_PATH = './'

function getPlugin(name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    getPlugin('chat'),
    getPlugin('window'),

    getPlugin('plot'),
    getPlugin('afk'),
    getPlugin('ggauth'),
    getPlugin('globalChat'),
    getPlugin('home'),
    getPlugin('itemClear'),
    getPlugin('mobRemover'),
    getPlugin('money'),
    getPlugin('mysteryMod'),
    getPlugin('near'),
    getPlugin('pathfinder'),
    getPlugin('playerUtils'),
    getPlugin('privateChat'),
    getPlugin('serverInfo'),
    getPlugin('shutdown'),
    getPlugin('switcher'),
    getPlugin('tpa'),
    getPlugin('warp')
]

module.exports = function inject(bot, options) {
    bot.delay = (ms => new Promise(res => setTimeout(res, ms)))
    bot.timeStamp = () => '[' + (new Date()).toLocaleTimeString() + ']'
    bot.parseFormattedDate = (date, time) => Date.parse(date.split('.').reverse().join('-') + 'T' + time)

    bot.actionResultStatus = {
        SUCCESS: 0,
        FAILURE: 1,
        TIMEOUT: 2
    }

    bot.getActionResult = async (successEvents, failureEvents = [], timeoutLimit = 20000, successEventEmitter = bot, failureEventEmitter = bot) => {
        if (typeof successEvents === 'string') {
            successEvents = [successEvents]
        }
        return new Promise((res, rej) => {
            bot.delay(timeoutLimit).then(() => {
                res({
                    status: bot.actionResultStatus.TIMEOUT
                })
            })

            // important: add collection operator before eventArgs
            // if not using some wrapper
            const onSuccess = (successEvent, eventArgs) => {
                res({
                    status: bot.actionResultStatus.SUCCESS,
                    event: successEvent,
                    eventArgs: eventArgs
                })
            }

            // important: add collection operator before eventArgs
            // if not using some wrapper
            const onFailure = (failureEvent, eventArgs) => { 
                res({
                    status: bot.actionResultStatus.FAILURE,
                    event: failureEvent,
                    eventArgs: eventArgs
                })
            }

            successEvents.forEach(successEvent => {
                const onSuccessWrapper = (...args) => {
                    onSuccess(successEvent, args)
                }
                successEventEmitter.once(successEvent, onSuccessWrapper)
                bot.delay(timeoutLimit).then(() => {
                    successEventEmitter.off(successEvent, onSuccessWrapper)
                })
            })

            failureEvents.forEach(failureEvent => {
                const onFailureWrapper = (...args) => {
                    onFailure(failureEvent, args)
                }
                failureEventEmitter.once(failureEvent, onFailureWrapper)
                bot.delay(timeoutLimit).then(() => {
                    failureEventEmitter.off(failureEvent, onFailureWrapper)
                })
            })
        })
    }

    bot.loadPlugins(plugins)

    bot.loadPatterns = (ggDataObj, patternHead) => {
        bot.chat.loadPatterns(ggDataObj, patternHead)
        bot.window.loadPatterns(ggDataObj, patternHead)
    }

    bot.loadPatternsAndGetData = (ggDataObjName) => {
        const ggDataObj = bot.ggData[ggDataObjName]
        bot.loadPatterns(ggDataObj, ggDataObjName)
        return ggDataObj
    }
}
