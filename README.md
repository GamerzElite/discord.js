# discord.js
Fork of discord.js

Added CommandHandling, Phrases/Translation Support

**Folders:** src/{command}/index.js

**Example Command:** src/help/index.js

**index.js** 

```
const Discord = require('discord.js');
const config = require('config');

module.exports = async (bot, command) => {
  return await command.channel.send(new Discord.MessageEmbed()
    .setColor('#426cf5')
    .setDescription(bot.phrase().getByName(command.language, `${config.app.keyword}_help`)) // Call phrase based on language and name
    .setAuthor(command.author.username, command.author.displayAvatarURL())
    .setTimestamp());
};

```

**Loading Commands and Phrases**

Base Directory index.js

```
const Discord = require('discord.js');
const bot = new Discord.Client();

//Load phrases to the bot
for (const phrase of fs.readdirSync('./phrases').filter(file => file.endsWith('.json'))) {
  bot.phrase().loadFromFile(`./phrases/${phrase}`);
}

const keyword = config.app.keyword;

const help = require('./src/help');

bot.commandHandler.register([
  new Discord.Command(`${keyword}_command_command`, { guild: (command) => help(bot, command) },
    [
      new Discord.Command(`${keyword}_command_help`, { guild: (command) => help(bot, command) }),
    ])
]);

```
