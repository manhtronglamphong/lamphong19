const express = require('express');
const nguoidungModel = require('../../models/nguoidung.model');
const xinphepUpgradeModel = require('../../models/xinupgrade.model');
const restrict = require('../../middlewares/auth.mdw');

const router = express.Router();

router.get('/ds/:role',restrict, async (req, res) => {
    const role = req.params.role;
    const c = res.locals.lcCategories;
    c.isActive2 = false;
    c.isActive1 = false;
    c.isActive0 = false;
    let rows;
    //console.log(role);

    if (role == 0){ //bidder
        rows = await nguoidungModel.allBidder();
        c.isActive0 = true;
    }
    else if (role == 1){ //seller
        rows = await nguoidungModel.allSeller();
        c.isActive1 = true;
    }
    else if (role == 2) {
        rows = await nguoidungModel.all();
        c.isActive2 = true;
    }
    
    res.render('viewAdmin/accounts', {
        accounts: rows,
        empty: rows.length === 0,
        layout: false
    })
})

router.get('/upgrade',restrict, async (req, res) => {
  const c = res.locals.lcCategories;
  c.upgrade = true;

  const rows = await nguoidungModel.upgradeAcc(); 

  res.render('viewAdmin/accounts', {
      accounts: rows,
      empty: rows.length === 0,
      layout: false
  })
})

router.post('/upgrade/OK/:id',restrict, async (req, res) =>{
  //sửa trên bảng nguoi_dung quyen_han = 1
  var row = await nguoidungModel.single(req.params.id);
  row = row[0];
  console.log(row);
  row.quyen_han = 1; //cập nhật quyền hạn thành seller
  
  const result = await nguoidungModel.patch(row);

  //xóa trong bản xin_phep_upgrade
  const result1 = await xinphepUpgradeModel.del(req.params.id);

  res.redirect(req.headers.referer);
})

router.post('/upgrade/NO/:id', async (req, res) =>{
  //xóa trong bản xin_phep_upgrade
  const result1 = await xinphepUpgradeModel.del(req.params.id);

  res.redirect(req.headers.referer);
})

router.get('/err', (req, res) => {
    throw new Error('error occured');
  })
  
  module.exports = router;