const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    customId: "obzvon",

    async execute(interaction) {
        console.log("📞 Обзвон");

        try {
            // Правильно парсим ID из customId
            const parts = interaction.customId.split("_");
            const userId = parts[1];
            const member = await interaction.guild.members.fetch(userId);
            
            const config = {
                roleObzvon: "1528823662009127053"
            };

            // Выдаём роль
            await member.roles.add(config.roleObzvon);

            // ОБНОВЛЯЕМ EMBED - меняем статус, но КНОПКИ ОСТАВЛЯЕМ!
            const oldEmbed = interaction.message.embeds[0];
            const newEmbed = EmbedBuilder.from(oldEmbed)
                .setColor(0x0099FF)
                .setDescription(`**Статус:** 📞 На обзвоне`)
                .addFields(
                    { name: "Вызвал", value: interaction.user.tag, inline: true },
                    { name: "Время", value: new Date().toLocaleString(), inline: true }
                );

            // КНОПКИ ОСТАЮТСЯ АКТИВНЫМИ!
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`accept_${userId}_${Date.now()}`)
                    .setLabel("✅ Принять")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`obzvon_${userId}_${Date.now()}`)
                    .setLabel("📞 Обзвон")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`reject_${userId}_${Date.now()}`)
                    .setLabel("❌ Отказать")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`close_${userId}_${Date.now()}`) // НОВАЯ КНОПКА!
                    .setLabel("🔒 Закрыть тикет")
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.message.edit({
                embeds: [newEmbed],
                components: [row]
            });

            // Меняем название канала
            await interaction.channel.setName(`📞-${member.user.username}`);

            // Уведомляем
            await member.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle("📞 ВЫЗОВ НА ОБЗВОН")
                        .setDescription(`Вас вызвали на обзвон в **Unplugged**!`)
                        .addFields(
                            { name: "Вызвал", value: interaction.user.tag, inline: true }
                        )
                        .setFooter({ text: "Unplugged" })
                        .setTimestamp()
                ]
            }).catch(() => console.log("Не удалось отправить ЛС"));

            await interaction.reply({
                content: `📞 ${member.user.tag} вызван на обзвон!`,
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