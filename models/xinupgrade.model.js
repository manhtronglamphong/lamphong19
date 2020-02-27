const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from xin_phep_upgrade'),
    single: id => db.load(`select * from xin_phep_upgrade where id_user = '${id}'`),
    del: id => db.del('xin_phep_upgrade',{id_user: id}),
    add: entity => db.add('xin_phep_upgrade', entity)
}