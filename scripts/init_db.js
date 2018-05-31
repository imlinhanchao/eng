const model = require('../model');

(async () => {
    if (process.argv.length > 2) {
        let table = process.argv[2];
        if (model[table]) {
            await model[table].sync({ force: true });
            console.info(`init model ${table} finish.`);
        }
        else {
            console.info(`model ${table} not found.`);
        }
    } else {
        await model.sync();
        console.info('init all model finish.');
    }
    process.exit();
})();