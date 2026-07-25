module.exports = {
    customId: "close",

    async execute(interaction) {
        console.log("🔒 Закрытие тикета");

        try {
            // Спрашиваем подтверждение
            await interaction.reply({
                content: "🔒 Тикет будет закрыт через 5 секунд...",
                ephemeral: true
            });

            // Ждём 5 секунд и удаляем
            setTimeout(async () => {
                try {
                    await interaction.channel.delete();
                    console.log(`🗑️ Тикет закрыт`);
                } catch (error) {
                    console.error("❌ Ошибка удаления:", error);
                }
            }, 5000);

        } catch (error) {
            console.error("❌ Ошибка в close.js:", error);
            await interaction.reply({
                content: `❌ Ошибка: ${error.message}`,
                ephemeral: true
            });
        }
    }
};
