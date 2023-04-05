require("dotenv").config();
const fs = require("fs");

const {
  REST,
  Routes,
  Client,
  ActivityType,
  ChannelType,
  ActionRowBuilder,
} = require("discord.js");
const { celebrateButton } = require("./lib");

const bot = new Client({
  intents: [
    "GuildMembers",
    "GuildMessages",
    "Guilds",
    "MessageContent",
    "GuildIntegrations",
  ],
});

const TOKEN = process.env.TOKEN;

let commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

const commands = [];
const interactions = [];
bot.commands = new Map();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  interactions.push(command.run);
  bot.commands.set(command.data.name, command);
}

bot.on("interactionCreate", async (interaction) => {
  if (interaction.channel.isTextBased()) {
    if (interaction.isButton() && interaction.customId === "celebratebtn") {
      let celebratecount =
        parseInt(
          interaction.message.embeds[0].data.footer.text.split(" ")[0]
        ) || 0;

      let embed = interaction.message.embeds[0].data;
      interaction.message.edit({
        embeds: [
          {
            thumbnail: { url: embed.thumbnail.url },
            author: {
              name: embed.author.name,
              icon_url: embed.author.icon_url,
            },
            title: embed.title,
            description: embed.description,
            footer: { text: `${celebratecount + 1} célèbrent votre venue!` },
          },
        ],
        components: [
          new ActionRowBuilder().addComponents(celebrateButton).toJSON(),
        ],
      });

      interaction.reply({
        content: "Merci d'avoir souhaité la Bienvenue!",
        flags: ["Ephemeral"],
      });
    }
    if (interaction.isChatInputCommand()) {
      interactions.forEach((c) => c(interaction));
    }
  }
});

bot.on("guildMemberAdd", async (member) => {
  let welcomeChannel = await member.guild.channels.fetch(
    process.env.WELCOME_CHANNEL_ID
  );
  if (welcomeChannel && welcomeChannel.type === ChannelType.GuildText) {
    welcomeChannel.send({
      embeds: [
        {
          title: `Bienvenue ${member.user.username} !`,
          description: `Merci d'être venu! Nous sommes maintenant ${
            member.guild.memberCount -
            member.guild.members.cache.filter((f) => f.user.bot).size
          }`,
          thumbnail: { url: member.user.avatarURL() || member.avatarURL() },
          author: {
            name: member.user.username,
            icon_url: member.user.avatarURL() || member.avatarURL(),
          },

          footer: { text: `0 célèbrent votre venue!` },
        },
      ],
      components: [
        new ActionRowBuilder().addComponents(celebrateButton).toJSON(),
      ],
    });
  }
});

bot.on("ready", async () => {
  bot.user.setActivity({
    name: "Je vous fais voyager dans Ezaria!",
    type: ActivityType.Listening,
  });

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  (async () => {
    try {
      if (process.env.ENV === "production") {
        await rest.put(Routes.applicationCommands(bot.user.id), {
          body: commands,
        });

        console.log("Successfully Registered Commands");
      } else {
        await rest.put(
          Routes.applicationCommands(bot.user.id, process.env.GUILD_ID),
          {
            body: commands,
          }
        );

        console.log("Successfully Registered Commands");
      }
    } catch (e) {
      console.error(e);
    }
  })();

  console.log("Connected");
});

bot.login(TOKEN);
