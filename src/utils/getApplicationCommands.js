module.exports = async (client, guildId) => {
  let applicationComamnds;

  if (guildId) {
    const guild = await client.guilds.fetch(guildId);
    applicationComamnds = guild.commands;
  } else {
    applicationComamnds = await client.application.commands;
  }

  await applicationComamnds.fetch();
  return applicationComamnds;
};
