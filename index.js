require("dotenv").config();

const hrpChannels = [
  "1042757971895128105",
  "1049303180317569105",
  "1049037836743094282",
  "1049294575157653564",
  "1049295564690432050",
];

const TOKEN = process.env.TOKEN;

const {
  REST,
  Routes,
  Client,
  SlashCommandBuilder,
  ActivityType,
  CommandInteraction,
} = require("discord.js");

const bot = new Client({
  intents: [
    "GuildMembers",
    "GuildMessages",
    "Guilds",
    "MessageContent",
    "GuildIntegrations",
  ],
});

const guildID = "1042757971895128104";

/**
 *
 * @param {*} channels
 * @param {*} name
 * @param {CommandInteraction} interaction
 */
function switche(channels, name, interaction) {
  let ch = channels.find((c) => c.name.toLowerCase() === name.toLowerCase());
  let charname = interaction.options.get("charname");

  let notIt = channels.filter((c) => c.id !== ch.id);

  // Hewwo
  if (ch) {
    if (!charname) {
      interaction.channel.send(
        `${interaction.member.user} voyages vers <#${ch.id}>`
      );
    } else {
      interaction.channel.send(`${charname.value} voyages vers <#${ch.id}>`);
    }

    ch.edit({
      permissionOverwrites: [{ id: interaction.member, allow: "ViewChannel" }],
    });

    if (!ch.parent) {
      ch.children.cache.forEach((ch) => {
        ch.edit({
          permissionOverwrites: [
            { id: interaction.member, allow: "ViewChannel" },
          ],
        });
      });
    }

    notIt.forEach((ch) => {
      ch.edit({
        permissionOverwrites: [{ id: interaction.member, deny: "ViewChannel" }],
      });

      if (!ch.parent) {
        ch.children.cache.forEach((ch) => {
          ch.edit({
            permissionOverwrites: [
              { id: interaction.member, deny: "ViewChannel" },
            ],
          });
        });
      }
    });
  } else {
    interaction.reply({ content: "Salon introuvable", flags: ["Ephemeral"] });
  }
}

bot.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (
      interaction.guild.members.cache
        .get(interaction.user.id)
        .roles.cache.get("1091738601835986954")
    ) {
      if (interaction.commandName === "see") {
        let channels = bot.guilds.cache
          .get(guildID)
          .channels.cache.filter((h) => !hrpChannels.includes(h.id))
          .filter((h) => !h.parent);

        let name = interaction.options.get("category", true).value;

        if (name.toLowerCase() === "Aléatoire".toLowerCase()) {
          switche(
            channels,
            channels.at([Math.floor(Math.random() * channels.size)]).name,
            interaction
          );
        } else {
          switche(channels, name, interaction);
        }
      }
    } else {
      interaction.reply({
        content: "Tu n'es pas vérifié pour faire cela!",
        flags: ["Ephemeral"],
      });
    }
  }
});

bot.on("ready", async () => {
  bot.user.setActivity({
    name: "Je vous fais voyager dans Ezaria!",
    type: ActivityType.Listening,
  });

  let command = new SlashCommandBuilder()
    .setName("see")
    .setDescription("Get access to a category using its name")
    .addStringOption((option) =>
      option
        .setDescription("Category")
        .setName("category")
        .addChoices(
          { value: "Plaines", name: "Plaines" },
          { value: "Forêt", name: "Forêt" },
          { value: "Ville", name: "Ville" },
          { value: "Hôtel", name: "Hôtel" },
          { value: "Montagnes", name: "Montagnes" },
          { value: "Îles Volantes", name: "Îles Volantes" },
          { value: "Ville Volante", name: "Ville Volante" },
          { value: "Jungle", name: "Jungle" },
          { value: "Désert", name: "Désert" },
          { value: "Zone Gelée", name: "Zone Gelée" },
          { value: "Aléatoire", name: "Aléatoire" }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setDescription("Character Name")
        .setName("charname")
        .setRequired(false)
    );

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands("1090661085884981408"), {
      body: [command],
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }

  console.log("Connected");
});

bot.login(TOKEN);
