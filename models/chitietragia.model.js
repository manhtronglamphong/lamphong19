const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
    all: () => db.load('select * from chi_tiet_ra_gia'),
    single: id => db.load(`select * from chi_tiet_ra_gia where id=${id}`),
    add: entity => db.add('chi_tiet_ra_gia',entity),

}