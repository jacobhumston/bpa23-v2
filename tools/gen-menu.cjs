const fs = require('fs');
const { v4: uuid } = require('uuid');

console.log('Generating menu items IDs...');

let preMenu = fs.readFileSync('src/client/data/pre-menu-items.jsonc').toString('utf-8');

function replacer() {
    const id = uuid();
    console.log('Generated uuid: ' + id);
    return id;
}

preMenu = preMenu.replaceAll('{ID}', replacer);

fs.writeFileSync('src/client/data/menu-items.jsonc', preMenu);

console.log('Done!');
