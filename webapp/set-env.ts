const fs = require('fs');
const colors = require('colors');
require('dotenv').load();

const targetPath = './src/environments/environment.ts';

const envConfigFile =
    `export const environment = {
    DB_USER: '${process.env.DB_USER}',
    DB_PASSWORD: '${process.env.DB_PASSWORD}',
    production: ${process.env.PRODUCTION}
};
`;
fs.writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        throw console.error(err);
    } else {
        console.log(colors.magenta(`Angular environment.ts file generated correctly at ${targetPath} \n`));
    }
});