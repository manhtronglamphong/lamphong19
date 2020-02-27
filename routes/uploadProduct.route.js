const express = require('express');
const moment = require('moment');
const sanphamModel = require('../models/sanpham.model');
const phanloaiModel = require('../models/phanloai.model');
const restrict = require('../middlewares/auth.mdw');
const multer = require('multer');
const mkdirp = require('mkdirp');
const config = require('../config/default.json');

const router = express.Router();

var filename = 'main' ;
var flodername = '';

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
      var newDestination = './public/images/' + flodername;
      var stat = null;
      /*try {
        stat = fs.statSync(newDestination);
      } catch (err) {
        fs.mkdirSync(newDestination);
      }
      if (stat && !stat.isDirectory()) {
        throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
      }*/
      callback(null, newDestination);
    },
    filename(request, file, callback) {
      // const extension = path.extname(file.originalname);
      callback(null, filename + '.jpg');
    }
});

 const upload = multer({ storage: storage });

router.get('/',restrict, (req, res) => {
    res.render('viewProducts/upProduct');
})

router.post('/', async (req, res) => {
    //id tensp tinh_trang gia_khoi_diem gia_ban_toi_thieu gia_hien_tai nguoi_ban_id nguoi_thang_id ngay_dang ngay_het_han chung_loai mo_ta
    var row = {};
    const entity = req.body;
    console.log(entity);

    row.ten_sp = entity.Name;
    row.gia_khoi_diem = entity.BeginPrice;
    row.gia_hien_tai = entity.BeginPrice;
    row.gia_ban_toi_thieu = entity.MinimumPrice;
    row.nguoi_ban_id =  req.session.authUser.id;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    row.ngay_dang = date;
    row.ngay_het_han = moment(entity.EndTime,'DD/MM/YYYY').format('YYYY-MM-DD');
    //lấy id chủng loại
    var type = await phanloaiModel.getID_loai(entity.Type);
    type = type[0];
    row.chung_loai = type.id_loai;
    row.mo_ta = entity.FullDes;
    row.tinh_trang = 0;
    //gia hạn hay ko
    if (entity.GiaHan === 'Không'){
        row.gia_han = 0;
    }else{
        row.gia_han = 1;
    }

    //console.log(row);

    const result = await sanphamModel.add(row);

    var maxID = await sanphamModel.maxID();
    maxID = maxID[0];
    flodername = maxID.max;
    var temp = './public/images/' + flodername;
    console.log(temp);
    
    mkdirp(`./public/images/${flodername}`, function(err) { 
        // path exists unless there was an error
    });

    
    const PORT = config.host.port;
    const referer = `http://localhost:${PORT}/upload/multiple`;
    res.redirect(referer);
})

router.get('/multiple', (req, res) => {
    res.render('viewProducts/uploadImages');
})


router.post('/multiple', /*upload.single('fuMain'),*/ async (req, res, next) => {
    /*const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }*/

    upload.single('fuMain')(req, res, err => {
      if (err) { }
  
      //res.send('ok'); 
      console.log('ok');
    });
    /*flodername = 60;
    console.log(flodername);

    filename = flodername+'-2';

    console.log(filename);
    upload.single('fuMain1')(req, res, err => {
      if (err) { }
  
      //res.send('ok');
      console.log('ok1');
    });

    filename = flodername+'-3';
    console.log(filename);
    upload.single('fuMain2')(req, res, err => {
      if (err) { }
  
      //res.send('ok');
      console.log('ok2');
    });

    filename = flodername+'-4';
    console.log(filename);
    upload.single('fuMain3')(req, res, err => {
      if (err) { }
  
      //res.send('ok');
      console.log('ok3');
    });*/

    const PORT = config.host.port;
    const referer = `http://localhost:${PORT}/`;
    res.redirect(referer);
})

router.get('/updatedes/:id_sp', restrict, (req, res) => {
    res.render('viewProducts/updateDes');
})

router.post('/updatedes/:id_sp', async (req, res) => {
    const row = await sanphamModel.single(req.params.id_sp);
    var sp = row[0];
    sp.mo_ta = sp.mo_ta + req.body.FullDes;

    const result = await sanphamModel.patch(sp);

    const PORT = config.host.port;
    const user = req.session.authUser.id;
    const referer = `http://localhost:${PORT}/account/profile/${user}`;
    res.redirect(referer);
  
  res.redirect('viewProducts/updateDes');
})

router.get('/err', (req, res) => {
    throw new Error('error occured');
})

module.exports = router;