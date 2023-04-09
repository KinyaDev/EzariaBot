const { SlashCommandBuilder, CommandInteraction } = require("discord.js");

const linked_places = require("./linked_places.json");
const RPChannels = Object.keys(linked_places);

/**
 * @param {CommandInteraction} interaction
 * @param {string} id
 */
async function isLinked(interaction, id) {
  let ret = false;
  if (
    interaction.channel.isTextBased() &&
    RPChannels.includes(interaction.channel.parent.id)
  ) {
    /**
     * @type {string[]}
     */
    let linked = linked_places[interaction.channel.parent.id];
    let channels = (await interaction.guild.channels.fetch())
      .filter((ch) => RPChannels.includes(ch.id))
      .filter((c) => !c.parent)
      .filter((c) => linked.includes(c.id));

    console.log(channels);

    if (channels.find((c) => c.id === id)) ret = true;
  }

  return ret;
}

/**
 * @param {CommandInteraction} interaction
 * @param {string} id
 */
async function travel(interaction, id) {
  function ov(bool, ch) {
    ch.permissionOverwrites.create(interaction.member, { ViewChannel: bool });
  }

  function children(id) {
    return interaction.guild.channels.cache.filter((c) => c.parentId === id);
  }

  let channels = (await interaction.guild.channels.fetch())
    .filter((h) => RPChannels.includes(h.id))
    .filter((h) => !h.parent);

  let linked = await isLinked(interaction, id);
  if (linked) {
    let aimed_channel = channels.find((c) => c.id === id);
    if (aimed_channel) {
      ov(true, aimed_channel);
      for (let [child_id, child] of children(aimed_channel.id)) {
        if (child.name.includes("❓")) {
          ov(false, child);
        } else {
          ov(true, child);
        }
      }

      let others = channels.filter((c) => c.id !== id);

      others.forEach((ch) => {
        ov(false, ch);
        for (let [child_id, child] of children(ch.id)) {
          ov(false, child);
        }
      });

      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

module.exports.data = new SlashCommandBuilder()
  .setName("see")
  .setDescription("Get access to a category using its name")
  .addStringOption((option) =>
    option.setDescription("Category").setName("category").setRequired(true)
  );

/**
 * @param {CommandInteraction} interaction
 */
module.exports.run = async (interaction) => {
  let role = await interaction.guild.roles.fetch(process.env.VERIFIED_ROLE_ID);

  if (!role.members.get(interaction.user.id))
    return interaction.reply({
      content: "Tu n'es pas vérifié pour faire cela!",
      flags: ["Ephemeral"],
    });

  let name = interaction.options.get("category").value;
  let ch = interaction.guild.channels.cache.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );

  let good = await travel(interaction, ch.id);
  if (good) {
    interaction.reply({
      content: `Vous voilà à <#${ch.id}>`,
      flags: ["Ephemeral"],
    });
  } else {
    interaction.reply({
      content: `Une erreur est survenue! <#${ch.id}>`,
      flags: ["Ephemeral"],
    });
  }
};
