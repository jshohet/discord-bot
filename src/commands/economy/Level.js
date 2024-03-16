const {
  ApplicationCommandOptionType,
  Client,
  Interaction,
  AttachmentBuilder,
} = require("discord.js");
const Level = require("../../models/Level");
const { Font, RankCardBuilder } = require("canvacord");
const calculateLevelXp = require("../../utils/calculateLevelXp");

module.exports = {
  name: "level",
  description: "Shows your/someone's level.",
  options: [
    {
      name: "target-user",
      description: "the user whose level you want to see.",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("You can only run this command inside a server");
      return;
    }

    await interaction.deferReply();

    const mentionedUserId = interaction.options.get("target-user")?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const fetchedLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      interaction.editReply(
        mentionedUserId
          ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
          : "you don't have any levels yet. chat a little more and try again."
      );
      return;
    }

    let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
      "-_id userId level xp"
    );
    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    let currentRank =
      allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

    Font.loadDefault();    

    const rank = new RankCardBuilder()
      .setDisplayName(targetUserObj.user.displayName) // Big name
      .setUsername(`@${targetUserObj.user.username}`) // small name, do not include it if you want to hide it
      .setAvatar("https://cdn.discordapp.com/embed/avatars/2.png") // user avatar
      .setCurrentXP(fetchedLevel.xp) // current xp
      .setRequiredXP(calculateLevelXp(fetchedLevel.level)) // required xp
      .setLevel(fetchedLevel.level) // user level
      .setRank(currentRank) // user rank

    const data = await rank.build();

    interaction.editReply({ files: [data] });
  },
};
