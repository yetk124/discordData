const { REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');
const commands = require('./commands.js');

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('🔄 슬래시 명령어 등록 중...');
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log('✅ 모든 슬래시 명령어가 성공적으로 등록되었습니다!');
    } catch (error) {
        console.error('❌ 명령어 등록 중 오류 발생:', error);
    }
})();
