const fs = require("fs");
const { Client } = require("discord.js");
const { TOKEN } = require("./credentials.json");

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
bot.interactions = new Map();
bot.events = new Map();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  bot.commands.set(command.data.name, command);
}

let interactionFiles = fs
  .readdirSync("./interactions")
  .filter((file) => file.endsWith(".js"));

for (const file of interactionFiles) {
  const interaction = require(`./interactions/${file}`);
  bot.interactions.set(file.replace(".js", ""), interaction);
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

    if (interaction.isButton()) {
      let interac = bot.interactions.get(interaction.customId);
      if (!interac) return;

      interac(interaction);
    }
  }
});

bot.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.channel.id === "1094634138646093925" && !user.bot) {
    let authorId = reaction.message.embeds[0].footer.text;
    let author = await reaction.message.guild.members.fetch(authorId);
    let guildReactor = await reaction.message.guild.members.fetch(user.id);
    let role = await reaction.message.guild.roles.fetch("1091738601835986954");
    let realCount = reaction.users.cache.has(authorId)
      ? reaction.count - 2
      : reaction.count - 1;

    if (reaction.emoji.name === "✅") {
      if (guildReactor.permissions.has("Administrator")) {
        author.roles.remove(role);
      } else if (realCount < 8) author.roles.remove(role);
    }
  }
});

bot.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.channel.id === "1094634138646093925" && !user.bot) {
    let authorId = reaction.message.embeds[0].footer.text;
    let author = await reaction.message.guild.members.fetch(authorId);
    let guildReactor = await reaction.message.guild.members.fetch(user.id);
    let role = await reaction.message.guild.roles.fetch("1091738601835986954");
    let realCount = reaction.users.cache.has(authorId)
      ? reaction.count - 2
      : reaction.count - 1;

    if (reaction.emoji.name === "✅") {
      if (guildReactor.permissions.has("Administrator")) {
        author.roles.add(role);
      } else if (realCount >= 8) author.roles.add(role);
    }

    if (reaction.emoji.name === "❌") {
      if (guildReactor.permissions.has("Administrator") && author.kickable) {
        author.kick("Pas accepté par les modérateurs");
      } else if (realCount >= 8 && author.kickable)
        author.kick("Pas accepté par les modérateurs");
    }
  }
});

bot.events.forEach((v, k) => {
  bot.on(k, v);
});

bot.login(TOKEN);
