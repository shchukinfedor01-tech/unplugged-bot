const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    customId: "accept",

    async execute(interaction) {
        console.log("✅ Принято");

        try {
            const parts = interaction.customId.split("_");
            const userId = parts[1];
            const member = await interaction.guild.members.fetch(userId);
            
            const config = {
                roleAcademy: "1527795907733491844"
            };

            await member.roles.add(config.roleAcademy);
            
            const oldEmbed = interaction.message.embeds[0];
            const newEmbed = EmbedBuilder.from(oldEmbed)
                .setColor(0x00FF00)
                .setDescription(`**Статус:** ✅ Принят в семью!`)
                .addFields(
                    { name: "Принял", value: interaction.user.tag, inline: true },
                    { name: "Время", value: new Date().toLocaleString(), inline: true }
                );

            // КНОПКИ ОСТАЮТСЯ (КРОМЕ ACCEPT - ЕЁ ОТКЛЮЧАЕМ)
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`disabled_1_${Date.now()}`)
                    .setLabel("✅ Принят")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`obzvon_${userId}_${Date.now()}`)
                    .setLabel("📞 Обзвон")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`reject_${userId}_${Date.now()}`)
                    .setLabel("❌ Отказать")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`close_${userId}_${Date.now()}`)
                    .setLabel("🔒 Закрыть тикет")
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.message.edit({
                embeds: [newEmbed],
                components: [row]
            });

            await interaction.channel.setName(`✅-${member.user.username}`);

            await member.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x00FF00)
                        .setTitle("🎵 ДОБРО ПОЖАЛОВАТЬ В UNPLUGGED!")
                        .setDescription(`Ваша заявка была **ОДОБРЕНА**!`)
                        .addFields(
                            { name: "Принял", value: interaction.user.tag, inline: true }
                        )
                        .setFooter({ text: "Unplugged" })
                        .setTimestamp()
                ]
            }).catch(() => console.log("Не удалось отправить ЛС"));

            await interaction.reply({
                content: `✅ ${member.user.tag} принят в семью!`,
                ephemeral: true
            });

        } catch (error) {
            console.error("❌ Ошибка:", error);
            await interaction.reply({
                content: `❌ Ошибка: ${error.message}`,
                ephemeral: true
            });
        }
    }
};