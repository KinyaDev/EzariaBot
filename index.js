const fs = require("fs");
const { Client } = require("discord.js");
const { accessId, verifiyId } = require("./ids");
require("dotenv").config();

const bot = new Client({
  intents: [
    "GuildMembers",
    "GuildMessageReactions",
    "GuildMessages",
    "MessageContent",
    "Guilds",
    "MessageContent",
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

let commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

const commands = [];
bot.commands = new Map();
bot.events = new Map();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  bot.commands.set(command.data.name, command);
}

let eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  bot.events.set(file.replace(".js", ""), event);
}

bot.on("interactionCreate", async (interaction) => {
  if (interaction.channel.isTextBased()) {
    if (interaction.isCommand()) {
      const command = bot.commands.get(interaction.commandName);
      if (!command) return;

      await command.run(interaction);
    }
  }
});

function accept(bool, author, channel) {
  if (bool) {
    channel.send(`<@${author.id}>, vous avez été accepté dans le serveur`);
  } else {
    channel.send(`<@${author.id}> n'a pas été accepté`);
  }
}

function cancelVerif(author, channel) {
  channel.send(`<@${author.id}>, votre vérifiction a été annulé`);
}

bot.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.channel.id === accessId && !user.bot) {
    let authorId = reaction.message.embeds[0].footer.text;
    let author = await reaction.message.guild.members.fetch(authorId);
    let guildReactor = await reaction.message.guild.members.fetch(user.id);
    let role = await reaction.message.guild.roles.fetch(verifiyId);
    let realCount = reaction.users.cache.has(authorId)
      ? reaction.count - 2
      : reaction.count - 1;

    if (reaction.emoji.name === "✅") {
      if (guildReactor.permissions.has("Administrator", true)) {
        author.roles.remove(role);
        cancelVerif(author, reaction.message.channel);
      } else if (realCount < 8) {
        author.roles.remove(role);
        cancelVerif(author, reaction.message.channel);
      }
    }
  }
});

bot.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.channel.id === accessId && !user.bot) {
    let authorId = reaction.message.embeds[0].footer.text;
    let author = await reaction.message.guild.members.fetch(authorId);
    let guildReactor = await reaction.message.guild.members.fetch(user.id);
    let role = await reaction.message.guild.roles.fetch(verifiyId);
    let realCount = reaction.users.cache.has(authorId)
      ? reaction.count - 2
      : reaction.count - 1;

    if (reaction.emoji.name === "✅") {
      if (guildReactor.permissions.has("Administrator", true)) {
        author.roles.add(role);
        accept(true, author, reaction.message.channel);
      } else if (realCount >= 8) {
        author.roles.add(role);
        accept(true, author, reaction.message.channel);
      }
    }

    if (reaction.emoji.name === "❌") {
      if (guildReactor.permissions.has("Administrator", true)) {
        reaction.message.delete();
        accept(false, author, reaction.message.channel);
        if (author.kickable) author.kick("Pas accepté par les modérateurs");
      } else if (realCount >= 8) {
        reaction.message.delete();
        accept(false, author, reaction.message.channel);
        if (author.kickable) author.kick("Pas accepté par les modérateurs");
      }
    }
  }
});

bot.events.forEach((v, k) => {
  bot.on(k, v);
});

bot.login(process.env.TOKEN);
