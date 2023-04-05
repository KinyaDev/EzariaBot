const { SlashCommandBuilder, CommandInteraction } = require("discord.js");
const hrpChannels = [
  "1042757971895128105",
  "1049303180317569105",
  "1049037836743094282",
  "1049294575157653564",
  "1049295564690432050",
  "1049023959053639782",
];

module.exports.data = new SlashCommandBuilder()
  .setName("see")
  .setDescription("Get access to a category using its name")
  .addStringOption((option) =>
    option
      .setDescription("Category")
      .setName("category")
      .setRequired(true)
      .setChoices(
        { value: "Plaines", name: "Plaines" },
        { value: "Forêt", name: "Forêt" },
        { value: "Ville", name: "Ville" },
        { value: "Hôtel", name: "Hôtel" },
        { value: "Montagnes", name: "Montagnes" },
        { value: "Îles Volantes", name: "Îles Volantes" },
        { value: "Ville Volante", name: "Ville Volante" },
        { value: "Jungle", name: "Jungle" },
        { value: "Désert", name: "Désert" },
        { value: "Zone Gelée", name: "Zone Gelée" }
      )
  )
  .addStringOption((option) =>
    option
      .setDescription("Character Name")
      .setName("charname")
      .setRequired(false)
  );

/**
 * @param {CommandInteraction} interaction
 */
module.exports.run = async (interaction) => {
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
        permissionOverwrites: [{ id: interaction.member, deny: "ViewChannel" }],
      });
    }
  }

  let role = await interaction.guild.roles.fetch(process.env.VERIFIED_ROLE_ID);

  function children(id) {
    return interaction.guild.channels.cache.filter((c) => c.parentId === id);
  }

  if (role.members.get(interaction.user.id)) {
    if (interaction.commandName === "see") {
      let channels = interaction.guild.channels.cache
        .filter((h) => !hrpChannels.includes(h.id))
        .filter((h) => !h.parent);

      let name = interaction.options.get("category", true).value;
      let ch = channels.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );

      if (typeof ch !== "undefined") {
        let charname = interaction.options.get("charname");
        let notIt = channels.filter((c) => c.id !== ch.id);
        const usn = charname ? charname : interaction.member.user;

        interaction.channel.send(`${usn} voyages vers <#${ch.id}>`);

        ov(true, ch);
        for (let [child_id, child] of interaction.guild.channels.cache.filter(
          (c) => c.parentId === ch.id
        )) {
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
};
