const { Events, Client, Guild, Collection } = require("discord.js");

function getRandom(x, y) {
  const range = y - x + 1;
  const rng = Math.floor(Math.random() * range);
  return rng + x;
}

const rollCooldown = new Collection();

const rollCooldownTime = 30*60;

const cooldownAmount = rollCooldownTime * 1000;

module.exports = {
  rollCooldown: rollCooldown,
  cooldownAmount:cooldownAmount,
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isButton()) {
      if (interaction.customId == "RollButton") {
        const now = Date.now();
        if (rollCooldown.has(interaction.user.id)) {
          const expTime =
            rollCooldown.get(interaction.user.id) + cooldownAmount;
          if (now < expTime) {
            const expTimestamp = Math.round(expTime / 1000);
            return interaction.reply({
              content: `Ты на кд Вася, следующая попытка будет <t:${expTimestamp}:R>`,
              ephemeral: true,
            });
          }
        }
        rollCooldown.set(interaction.user.id, now);
        setTimeout(
          () => {
            rollCooldown.delete(interaction.user.id);
            if (interaction.member.roles.cache.has("1150841738693447811"))
            interaction.member.roles.remove(statusRole);
          },
          cooldownAmount
        );

        const rolNum = getRandom(0, 100);
        const hoholRole = interaction.guild.roles.cache.get(
          "1150705209165762642"
        );
        const statusRole = interaction.guild.roles.cache.get(
          "1150841738693447811"
        );
        if (!hoholRole || !statusRole) {
          return console.log("Роли не были загружены");
        }

        if (rolNum <= 25) {
          if (interaction.member.roles.cache.has("1150841738693447811"))
            interaction.member.roles.remove(statusRole);
          interaction.member.roles
            .add(hoholRole)
            .then(() =>
              interaction.reply({
                content: "Твоя роль на сегодня - Опущенный хохол",
                ephemeral: true,
              })
            )
            .catch((err) => {
              console.log(err);
              return interaction.reply({
                content: `Something went wrong. The HOHOL role was not added to you`,
                ephemeral: true,
              });
            });
        } else if (rolNum >= 75) {
          if (interaction.member.roles.cache.has("1150705209165762642"))
            interaction.member.roles.remove(hoholRole);
          interaction.member.roles
            .add(statusRole)
            .then(() =>
              interaction.reply({
                content: "Твоя роль на сегодня - CТАТУС.",
                ephemeral: true,
              })
            )
            .catch((err) => {
              console.log(err);
              return interaction.reply({
                content: `Something went wrong. The status role was not added to you`,
                ephemeral: true,
              });
            });
        } else {
          if (interaction.member.roles.cache.has("1150705209165762642"))
            interaction.member.roles.remove(hoholRole);
          else if (interaction.member.roles.cache.has("1150841738693447811"))
            interaction.member.roles.remove(statusRole);
          interaction.reply({
            content: "На сегодня ты обычный карлик",
            ephemeral: true,
          });
        }
      }
    }
  },
};
