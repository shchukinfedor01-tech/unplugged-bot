const { Client, GatewayIntentBits, REST, Routes, Collection } = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

// ======== ЗАГРУЗКА ========
console.log("📂 Загрузка Unplugged Bot...");

try {
    const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
        console.log(`   ✅ Команда: ${file}`);
    }
} catch (error) {
    console.log("   ❌ Нет команд:", error.message);
}

try {
    const buttonFiles = fs.readdirSync("./buttons").filter(f => f.endsWith(".js"));
    for (const file of buttonFiles) {
        const button = require(`./buttons/${file}`);
        client.buttons.set(button.customId, button);
        console.log(`   ✅ Кнопка: ${file}`);
    }
} catch (error) {
    console.log("   ❌ Нет кнопок:", error.message);
}

try {
    const modalFiles = fs.readdirSync("./modals").filter(f => f.endsWith(".js"));
    for (const file of modalFiles) {
        const modal = require(`./modals/${file}`);
        client.modals.set(modal.customId, modal);
        console.log(`   ✅ Модалка: ${file}`);
    }
} catch (error) {
    console.log("   ❌ Нет модалок:", error.message);
}

console.log(`\n📊 СТАТИСТИКА: ${client.commands.size} команд, ${client.buttons.size} кнопок, ${client.modals.size} модалок\n`);

// ======== РЕГИСТРАЦИЯ ========
client.once("ready", async () => {
    console.log(`🎵 UNPLUGGED BOT ЗАПУЩЕН!`);
    console.log(`   🤖 ${client.user.tag}`);
    console.log(`   📡 На серверах: ${client.guilds.cache.size}`);
    
    try {
        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
        const commands = [];
        for (const cmd of client.commands.values()) {
            commands.push(cmd.data.toJSON());
        }
        if (commands.length > 0) {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands }
            );
            console.log(`   ✅ Зарегистрировано ${commands.length} команд\n`);
        }
    } catch (error) {
        console.error("   ❌ Ошибка регистрации:", error);
    }
});

// ======== ОБРАБОТКА ВЗАИМОДЕЙСТВИЙ ========
client.on("interactionCreate", async (interaction) => {
    try {
        // КОМАНДЫ
        if (interaction.isChatInputCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if (cmd) {
                await cmd.execute(interaction);
            }
            return;
        }

        // КНОПКИ
        if (interaction.isButton()) {
            console.log(`🔘 Нажата кнопка: ${interaction.customId}`);
            
            let found = false;
            for (const [id, button] of client.buttons) {
                if (interaction.customId.startsWith(id)) {
                    await button.execute(interaction);
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                console.log(`❌ Кнопка не найдена: ${interaction.customId}`);
                await interaction.reply({ 
                    content: "❌ Кнопка не найдена!", 
                    ephemeral: true 
                });
            }
            return;
        }

        // МОДАЛКИ
        if (interaction.isModalSubmit()) {
            console.log(`📝 Отправлена модалка: ${interaction.customId}`);
            
            let found = false;
            for (const [id, modal] of client.modals) {
                if (interaction.customId.startsWith(id)) {
                    await modal.execute(interaction);
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                console.log(`❌ Модалка не найдена: ${interaction.customId}`);
                await interaction.reply({ 
                    content: "❌ Модалка не найдена!", 
                    ephemeral: true 
                });
            }
            return;
        }

    } catch (error) {
        console.error("❌ ОШИБКА:", error);
        if (!interaction.replied && !interaction.deferred) {
            try {
                await interaction.reply({ 
                    content: `❌ Ошибка: ${error.message}`,
                    ephemeral: true 
                });
            } catch (e) {
                console.error("❌ Не удалось ответить:", e);
            }
        }
    }
});

// ======== ЗАПУСК ========
client.login(process.env.TOKEN);
console.log("🚀 Запуск Unplugged Bot...");