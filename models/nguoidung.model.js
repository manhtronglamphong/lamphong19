const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from nguoi_dung'),
    single: id_nguoidung => db.load(`select * from nguoi_dung where id = '${id_nguoidung}'`),
    singleByUsername: async username => {
        const rows = await db.load(`select * from nguoi_dung where ten_dang_nhap = '${username}'`);
        if (rows.length === 0)
          return null;
    
        return rows[0];
    },
    allBidder: () => db.load(`select * from nguoi_dung where quyen_han = 0`),
    allSeller: () => db.load(`select * from nguoi_dung where quyen_han = 1`),
    singleByEmail: async email => {
      const rows = await db.load(`select * from nguoi_dung where email = '${email}'`);
      if (rows.length === 0)
        return null;
  
      return rows[0];
    },
    add: entity => db.add('nguoi_dung', entity),
    del: id_nguoidung => db.del('nguoi_dung', {id : id_nguoidung}),
    patch: entity => {
      const condition = { id: entity.id};
      delete entity.id;
      return db.patch('nguoi_dung',entity,condition);
    },

    upgradeAcc: () => db.load(`select * from xin_phep_upgrade left join nguoi_dung on id_user = id`)
}