/* eslint-disable prettier/prettier */
'use strict';
const Command = require('../Command');

/**
Cancerous code, dont care lol, it works.
*/
class CommandHandler {
  constructor(bot) {
    this.bot = bot;
    this.commands = [];
    bot.on('message', message => this.processMessage(message));
  }

  isCommand(input) {
    return this.commands.reduce((result, command) => {
      if (!result) {
        const phrases = this.bot.phrase().getAllByName(command.trigger);

        const match = phrases.find(phrase => phrase.value.toLowerCase() === input);

        if (match) {
          result = true;
        }
      }

      return result;
    }, false);
  }
  register(commands) {
    const validateCommands = cmds => {
      cmds.forEach(command => {
        const phrase = this.bot.phrase().getAllByName(command.trigger);

        if (!phrase) {
          throw Error(`Missing phrase ${command.trigger}`);
        }

        if (command.children.length > 0) {
          validateCommands(command.children);
        }
      });
    };

    validateCommands(commands);

    this.commands = commands;
  }

  async processMessage(message) {
    if (!message.content || message.author.id === this.bot.user.id) {
      return Promise.resolve();
    }

    const cmd = {
      isGuild: message.Guild !== null,
      guild: message.guild,
      channel: message.channel,
      author: message.author,
      attachments: message.attachments,
      reactions: message.reactions,
      mentions: message.mentions,
      language: null,
      argument: message.content,
      member: message.member,
      message: message,
    };

    const baseCommand = this.commands.reduce((result, command) => {
      if (!result) {
        const phrases = this.bot.phrase().getAllByName(command.trigger);

        const match = phrases.find(phrase => phrase.value.toLowerCase() === cmd.argument.split(/[\s]+/)[0]);

        if (match) {
          if (
            command.commandCallbackTypes.includes(Command.getCallback.BOTH) ||
            (cmd.isGuild && command.commandCallbackTypes.includes(Command.getCallback.GUILD)) ||
            (!cmd.isGuild && command.commandCallbackTypes.includes(Command.getCallback.DIRECT))
          ) {
            cmd.argument = cmd.argument.substr(match.value.length).trim();
            cmd.language = match.language;
            cmd.callback = command.commandCallbackTypes.includes(Command.getCallback.BOTH)
              ? command.commandCallbacks.both
              : !cmd.isGuild
              ? command.commandCallbacks.direct
              : command.commandCallbacks.guild;
            return command;
          }
        }
      }
      return result;
    }, false);

    if (!baseCommand) {
      return Promise.resolve();
    }

    const command = this._getChildCommand(baseCommand, cmd);

    const callback = command.callback;

    delete command.callback;

    return callback.call(this, command);
  }

  _getChildCommand(command, cmd) {
    if (!cmd.argument) {
      return cmd;
    }

    const foundCommand = command.children.reduce((result, _cmd) => {
      if (!result) {
        const phrase = this.bot.phrase().getByName(command.language, _cmd.trigger);

        if (phrase) {
        if (phrase.toLowerCase() === cmd.argument.split(' ')[0]) {
          if (
            _cmd.commandCallbackTypes.includes(Command.getCallback.BOTH) ||
            (cmd.isGuild && _cmd.commandCallbackTypes.includes(Command.getCallback.GUILD)) ||
            (!cmd.isGuild && _cmd.commandCallbackTypes.includes(Command.getCallback.DIRECT))
          ) {
            cmd.argument = cmd.argument.substr(phrase.length).trim();
            cmd.callback = _cmd.commandCallbackTypes.includes(Command.getCallback.BOTH)
              ? _cmd.commandCallbacks.both
              : !cmd.isGuild
              ? _cmd.commandCallbacks.direct
              : _cmd.commandCallbacks.guild;
            return _cmd;
          }
        }
      }
      }
      return result;
    }, false);

    if (!foundCommand) {
      return cmd;
    }

    return this._getChildCommand(foundCommand, cmd);
  }
}

module.exports = CommandHandler;
