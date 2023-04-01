require("dotenv").config();

const hrpChannels = [
  "1042757971895128105",
  "1049303180317569105",
  "1049037836743094282",
  "1049294575157653564",
  "1049295564690432050",
];

const TOKEN = process.env.TOKEN.toString();

const {
  REST,
  Routes,
  Client,
  SlashCommandBuilder,
  ActivityType,
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

bot.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand() && interaction.channel.isTextBased()) {
    /**
     *
     * @param {Collection<string, GuildBasedChannel>} channels
     * @param {string} name
     */

    function ov(bool, ch) {
      if (bool) {
        ch.edit({
          permissionOverwrites: [
            { id: interaction.member, allow: "ViewChannel" },
          ],
        });
      } else {
        ch.edit({
          permissionOverwrites: [
            { id: interaction.member, deny: "ViewChannel" },
          ],
        });
      }
    }

    let role = await interaction.guild.roles.fetch("1091738601835986954");

    function children(id) {
      return interaction.guild.channels.cache.filter((c) => c.parentId === id);
    }

    if (role.members.get(interaction.user.id)) {
      if (interaction.commandName === "see") {
        let channels = bot.guilds.cache
          .get(guildID)
          .channels.cache.filter((h) => !hrpChannels.includes(h.id))
          .filter((h) => !h.parent);

        let name = interaction.options.get("category", true).value;
        let ch =
          name === "Aléatoire"
            ? channels.at(Math.floor(Math.random() * channels.size))
            : channels.find((c) => c.name.toLowerCase() === name.toLowerCase());

        if (typeof ch !== "undefined") {
          let charname = interaction.options.get("charname");
          let notIt = channels.filter((c) => c.id !== ch.id);
          const usn = charname ? charname : interaction.member.user;

          interaction.channel.send(`${usn} voyages vers <#${ch.id}>`);

          ov(true, ch);
          for (let [child_id, child] of children(ch.id)) {
            ov(true, child);
          }

          notIt.forEach((ch) => {
            ov(false, ch);
            for (let [child_id, child] of children(ch.id)) {
              ov(false, child);
            }
          });
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
