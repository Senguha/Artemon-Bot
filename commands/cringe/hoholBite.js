const {
  SlashCommandBuilder,
  Collection,
  PermissionFlagsBits,
} = require("discord.js");

const wait = require('node:timers/promises').setTimeout;

function getRandom(x, y) {
  const range = y - x + 1;
  const rng = Math.floor(Math.random() * range);
  return rng + x;
}
const hoholCooldown = new Collection();
const hoholCooldownTime = 60 * 60;
const cooldownAmount = hoholCooldownTime * 1000;
const deleteDelay = 60 * 1000;



module.exports = {
  data: new SlashCommandBuilder()
    .setName("hoholbite")
    .setDescription("Заражает другого пользователя хохловирусом с шансом 20%.")
    .addUserOption((option) =>
      option
        .setName("targetuser")
        .setDescription("Пользователь которому нужно укусить жопа.")
        .setRequired(true)
    ),
  async execute(interaction) {
    
    const hohol = interaction.member;
    const user = interaction.options.getUser("targetuser");
    const member = interaction.options.getMember("targetuser");

    if (
      !(
        interaction.member.roles.cache.has("1150705209165762642") ||
        interaction.member.permissions.has(PermissionFlagsBits.Administrator)
      )
    ) {
      return interaction.reply({
        content: "Заражать хохловирусом могут только опущенные хохлы!",
        ephemeral: true,
      });
    }
    if (member.roles.cache.has("1150705209165762642")) {
      interaction.reply({
        content: `Вы не можете заразить хохловирусом своего друга хохла ${user}.`,
        ephemeral: true,
      });
      return;
    }
    if (member.roles.cache.has("1226980533972500490")) {
      interaction.reply({
        content: `Вы не можете заразить пользователя, обладажющего ролью <@&1226980533972500490>.`,
        allowedMentions: { parse: [] },
        ephemeral: true,
      });
      return;
    }
    const now = Date.now();
    if (hoholCooldown.has(interaction.user.id)) {
      const expTime = hoholCooldown.get(interaction.user.id) + cooldownAmount;
      if (now < expTime) {
        const expTimestamp = Math.round(expTime / 1000);
        return interaction.reply({
          content: `Ты на кд Вася, следующая попытка будет <t:${expTimestamp}:R>`,
          ephemeral: true,
        });
      }
    }
    hoholCooldown.set(interaction.user.id, now);
    setTimeout(() => {
      hoholCooldown.delete(interaction.user.id);
    }, cooldownAmount);

    if (user.id=="1192164020816466041"){
      try{
        await hohol.timeout(5*60_000, "Мать свою покусай, свинота");
        await interaction.reply({
          content:`Мать свою укуси, долбаёб.`
        });
        await wait(deleteDelay);
        return await interaction.deleteReply();
      } catch(error){
        return interaction.reply({content:`${error}`})
      }
    }
    
    const rolNum = getRandom(0, 100);

    if (rolNum < 80) {
      await interaction.reply({
        content: `ХОХОЛ ${hohol} попытался заразить хохловирусом пользователя ${user}, но вместо этого жидко обосрался.`,
      });
      await wait(deleteDelay);
      await interaction.deleteReply();
    } else {
      await interaction.reply({
        content: `ХОХОЛ ${hohol} заразил хохловирусом пользователя ${user}.`,
      });
      const statusRole = interaction.guild.roles.cache.get(
        "1150841738693447811"
      );
      const hoholRole = interaction.guild.roles.cache.get(
        "1150705209165762642"
      );
      if (member.roles.cache.has("1150841738693447811"))
        member.roles.remove(statusRole);
      member.roles.add(hoholRole);
      await wait(deleteDelay);
      await interaction.deleteReply();
    }
    
  },
};
