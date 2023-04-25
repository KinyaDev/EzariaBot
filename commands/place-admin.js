// You can change the name of this command,
// but it's like the see command but admins can cange view category of any members

const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");

module.exports.data = new SlashCommandBuilder()
  .setName("place-admin")
  .setDescription(
    "Afficher ou Cacher un salon / une catégorie à un membre où un rôle"
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addMentionableOption((option) =>
    option
      .setName("mentionable")
      .setDescription("Role ou Membre")
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("le salon ou la catégorie")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("which")
      .setDescription("Cacher ou Afficher ?")
      .addChoices(
        { name: "Cacher", value: "Cacher" },
        { name: "Afficher", value: "Afficher" }
      )
  );

/**
 * @param {CommandInteraction} interaction
 */
module.exports.run = async (interaction) => {
  let mentionable =
    interaction.options.get("mentionable").role ||
    interaction.options.get("mentionable").member;

  let channel = interaction.options.get("channel").channel;
  let which = interaction.options.get("which").value;

  function children(id) {
    return interaction.guild.channels.cache.filter((c) => c.parentId === id);
  }

  function ov(ch) {
    ch.permissionOverwrites.create(mentionable, {
      ViewChannel: which === "Cacher" ? false : true,
    });
  }

  if (channel.parent === null) {
    ov(channel);
    for (let [child_id, child] of children(channel.id)) {
      ov(child);
    }
    interaction.reply({ content: "Fait !", flags: ["Ephemeral"] });
  } else {
    ov(channel);
    interaction.reply({ content: "Fait !", flags: ["Ephemeral"] });
  }
};
