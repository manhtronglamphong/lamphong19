const db = require('../utils/db');

module.exports = {
    //all: () => db.load('select * from yeu_thich'),
    allByAUser: user => db.load(`select * from yeu_thich where id_user = '${user}'`),
    del: (user, product) => db.del(`yeu_thich`, {id_user : user, id_sp: product}),
    add: entity => db.add('yeu_thich', entity),
    single: (user, product) => db.load(`select * from yeu_thich where id_user = '${user}' and id_sp = '${product}'`)
}