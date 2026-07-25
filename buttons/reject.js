const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    customId: "reject",

    async execute(interaction) {
        console.log("❌ Отказ");

        try {
            const userId = interaction.customId.split("_")[1];
            console.log(`📝 ID пользователя: ${userId}`);
            
            const modal = new ModalBuilder()
                .setCustomId(`reject_modal_${userId}`) // ← ПРОСТО! БЕЗ _${Date.now()}!
                .setTitle("❌ Причина отказа");

            const reason = new TextInputBuilder()
                .setCustomId("reason")
                .setLabel("Причина отказа")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder("Напишите причину отказа...")
                .setRequired(true)
                .setMaxLength(500);

            modal.addComponents(
                new ActionRowBuilder().addComponents(reason)
            );

            await interaction.showModal(modal);

        } catch (error) {
            console.error("❌ Ошибка:", error);
            await interaction.reply({
                content: `❌ Ошибка: ${error.message}`,
                ephemeral: true
            });
        }
    }
};