const PLUGINS_PATH = './'

function getPlugin (name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    getPlugin('plot'),
    getPlugin('antiAfk'),
    getPlugin('chat'),
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
    bot.loadPlugins(plugins)
    bot.cbBlocks = require('../../coords/cbblocks.json')
    bot.delay = (ms => new Promise(res => setTimeout(res, ms)))
    bot.timeStamp = () => '[' + (new Date()).toLocaleTimeString() + ']'

    const resultStatus = {
        SUCCESS: 0,
        FAILURE: 1,
        TIMEOUT: 2
    }

    bot.getActionResult = async (successEvents, failureEvents = [], timeoutLimit = 20000, successEventEmitter = bot, failureEventEmitter = bot) => {
        if (typeof successEvents === 'string') {
            successEvents = [ successEvents ]
        }
		return new Promise((res, rej) => {
            bot.delay(timeoutLimit).then(() => {
                res({
                    status: resultStatus.TIMEOUT
                })
            })
            
            const onSuccess = (successEvent, ...eventArgs) => {
                res({
                    status: resultStatus.SUCCESS,
                    triggeredEvent: successEvent,
                    eventArgs: eventArgs
                })
            }

            const onFailure = (failureEvent, ...eventArgs) => {
                res({
                    status: resultStatus.FAILURE,
                    triggeredEvent: failureEvent,
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
}