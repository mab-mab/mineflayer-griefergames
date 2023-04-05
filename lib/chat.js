const chalk = require('chalk')

const { once } = require('events')

module.exports = function inject(bot, options) {
	const chat = bot.loadPatternsAndGetData('chat')
	bot.chatNative = bot.chat
	bot.chat = {
		commandBatchStart: Date.now(),
		commandBatchCount: 0,
		commandSpamLock: false,
		lastCommand: null,
		sentMsgLately: false,
		commandErrorEvents: ['chat:chat->blacklistError', 'chat:chat->unknownCommandError', 'chat:chat->insufficientPermissionsError'],
		events: [
			'commandSpamLockReleased',
			'messageCountdownExpired',
			
		]
	}

	bot.chat.sendCommand = async (msg) => {
		if (Date.now() - bot.switch.serverJoinedAt < chat.commandBatchDelay) await bot.delay(chat.commandBatchDelay - (Date.now() - bot.switch.serverJoinedAt))
		while ((Date.now() - bot.chat.commandBatchStart) < chat.commandBatchDelay && bot.chat.commandBatchCount >= 3) await bot.delay(chat.commandBatchDelay - (Date.now() - bot.chat.commandBatchStart))

		const now = Date.now()
		if (now - bot.chat.commandBatchStart >= chat.commandBatchDelay) {
			bot.chat.commandBatchStart = now
			bot.chat.commandBatchCount = 0
		}
		bot.chat.commandBatchCount++

		if (bot.chat.commandSpamLock) await once(bot, 'misc:chat->commandSpamLockReleased')

		bot.chat.lastCommand = msg
		bot.chatNative(msg)
	}

	bot.chat.sendMessage = async (msg) => {
		while (bot.chat.sentMsgLately) await once(bot, 'misc:chat->messageCountdownExpired')

		bot.chatNative(msg)

		bot.chat.sentMsgLately = true
		await bot.delay([1, 10][+bot.slowChat.active] * 1000)
		bot.chat.sentMsgLately = false
		bot.emit('misc:chat->messageCountdownExpired')
	}

	bot.chat.send = (msg, priority) => {
		return msg.startsWith('/') ?
			bot.chat.sendCommand(msg, priority) :
			bot.chat.sendMessage(msg)
	}

	bot.chat.onBlacklistError = ([[msg]]) => {
		if (msg.startsWith('/')) bot.chat.commandBatchCount--
		else bot.chat.sentMsgLately = false
	}

	bot.chat.sendFallible = (options) => {
		const {
			patternHeads = [],
			patternHead,
			command
		} = options

		if (patternHead !== undefined) { // TODO: remove this redundant code
			patternHeads.push(patternHead)
			delete options.patternHead
		}

		const resolvedCommand = bot.chat.resolveCommand(patternHeads, command instanceof Array ? command[0] : command) ?? command
		const msg = command instanceof Array ? bot.chat.buildCommand(resolvedCommand, ...command.splice(1)) : resolvedCommand

		return new Promise((res) => {
			const onCommandError = (commandErrorEvent, ...eventArgs) => {
				res(new bot.ActionResult(bot.actionResultStatus.FAILURE, commandErrorEvent, eventArgs))
			}
			const sendToChat = () => {
				bot.once('chat:chat->spamWarning', sendToChat)
				bot.chat.commandErrorEvents.forEach(commandErrorEvent => {
					bot.once(commandErrorEvent, onCommandError)
				})
				bot.chat.send(msg)
			}
			bot.getActionResult(options).then((actionResult) => {
				bot.chat.commandErrorEvents.forEach(commandErrorEvent => {
					bot.off(commandErrorEvent, onCommandError)
				})
				bot.removeListener('chat:chat->spamWarning', sendToChat)
				res(actionResult)
			})
			sendToChat()
		})
	}

	bot.chat.buildCommand = (blueprint, ...commandArgs) => {
		let returnCommand = blueprint
		const commandArgMatches = returnCommand.match(/\$[1-9]+/g)
		if (commandArgMatches) {
			for (commandArgMatch of commandArgMatches) {
				const commandIndex = +commandArgMatch.substring(1)
				returnCommand = returnCommand.replace(new RegExp('\\$' + commandIndex, 'g'), (commandArgs[commandIndex - 1] ?? ''))
			}
		}
		return returnCommand.trim()
	}

	bot.on('chat:chat->spamWarning', async ([[recommendedWaitDuration]]) => {
		const waitDelay = (recommendedWaitDuration * 1000) || chat.commandBatchDelay
		bot.chat.commandSpamLock = true
		await bot.delay(waitDelay)
		bot.emit('misc:chat->commandSpamLockReleased')
		bot.chat.commandSpamLock = false
	})

	bot.on('chat:chat->blacklistError', bot.chat.onBlacklistError)
}