const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
    all: () => db.load(`select sp.*,count(ctrg.san_pham_id) as total from san_pham as sp LEFT JOIN chi_tiet_ra_gia as ctrg ON sp.id=ctrg.san_pham_id group by sp.id `),
    single: id => db.load(`select * from san_pham where id = ${id}`),
    allByCat: id_loai => db.load(`select sp.*,count(ctrg.san_pham_id) as total
    from san_pham as sp left join chi_tiet_ra_gia as ctrg on sp.id=ctrg.san_pham_id
    where sp.chung_loai=2
    group by sp.id`),
    countByCat: async id_loai => {
        const rows = await db.load(`select count(*) as total from san_pham where chung_loai = ${id_loai}`)
        return rows[0].total;
    },
    pageByCat: (id_loai,offset) => db.load(`select sp.*,count(ctrg.san_pham_id) as total
    from san_pham as sp left join chi_tiet_ra_gia as ctrg on sp.id=ctrg.san_pham_id
    where sp.chung_loai=${id_loai}
    group by sp.id
    limit ${config.paginate.limit} offset ${offset}`),
    add: entity =>db.add('san_pham', entity),
    del: id => db.del('san_pham',{ID: id}),
    patch: entity => {
        const condition = { id: entity.id};
        delete entity.id;
        return db.patch('san_pham',entity,condition);
    },

    maxID: () => db.load('select max(id) as max from san_pham'),
    topbid:()=> db.load(`SELECT sp.*,COUNT(ctrg.san_pham_id) AS TOTAL FROM san_pham AS sp JOIN chi_tiet_ra_gia AS ctrg ON sp.id=ctrg.san_pham_id GROUP BY ctrg.san_pham_id ORDER BY TOTAL DESC LIMIT 5 `),
    //topbid:() => db.load(`select * from san_pham`),

    search:async(inputSearch,searchType)=>{ 
        let rows;
        if (searchType=='0'){
            console.log(inputSearch);
            rows= await db.load(`select sp.*,count(ctrg.san_pham_id) as total
            from san_pham as sp left join chi_tiet_ra_gia as ctrg on sp.id=ctrg.san_pham_id
            where sp.ten_sp like '%${inputSearch}%'
            group by sp.id`)
        }
        else {
            rows= await db.load(`select sp.*,count(ctrg.san_pham_id) as total
            from san_pham as sp left join chi_tiet_ra_gia as ctrg on sp.id=ctrg.san_pham_id
            where sp.ten_sp like '%${inputSearch}%' and sp.chung_loai='${searchType}'
            group by sp.id`)
        }
        return rows;
    },

    favourite: (user) => db.load(`select * from san_pham join yeu_thich on id = id_sp and id_user = '${user}'`),

    bidder:(id)=>db.load(`select ten_dang_nhap, gia,thoi_diem_ra_gia from chi_tiet_ra_gia AS ctrg JOIN nguoi_dung nd ON ctrg.nguoi_dung_id=nd.id where ctrg.san_pham_id='${id}'`),

    updatePrice: entity =>{
        const condition = { ID: entity[0].id};
        delete entity[0].id;
        return db.patch('san_pham',entity[0],condition);
    },

    allBySeller: (id_seller) => db.load(`select * from san_pham where nguoi_ban_id = '${id_seller}'`),

    relate:(id)=>db.load(`SELECT sp2.*
    from san_pham as sp1 join san_pham as sp2
    where sp1.id='${id}' and sp1.chung_loai=sp2.chung_loai and sp2.id<>sp1.id limit 5`)
}