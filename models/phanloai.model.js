const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from phan_loai'),
    single: id_loai => db.load(`select * from phan_loai where id_loai = ${id_loai}`),
    getID_loai: ten => db.load(`select id_loai from phan_loai where ten_loai = '${ten}'`)
}