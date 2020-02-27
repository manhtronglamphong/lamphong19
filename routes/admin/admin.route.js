const express = require('express');
const multer = require('multer');
const router = express.Router();
const restrict = require('../../middlewares/auth.mdw');
const phanloaiModel = require('../../models/phanloai.model');
const sanphamModel = require('../../models/sanpham.model');
const moment = require('moment');
const mkdirp = require('mkdirp');
const config = require('../../config/default.json');

var filename = 'main' ;
var flodername = '';

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
      var newDestination = './public/images/' + flodername;
      var stat = null;
      callback(null, newDestination);
    },
    filename(request, file, callback) {
      // const extension = path.extname(file.originalname);
      callback(null, filename + '.jpg');
    }
});

 const upload = multer({ storage: storage });


router.get('/',restrict, (req, res) => {
    res.render('viewAdmin/admin', { layout: false });
})


router.get('/err', (req, res) => {
    throw new Error('error occured');
})

router.get('/upload',restrict, (req, res) => {
    res.render('viewAdmin/uploadProducts', { layout: false });
})
  
router.post('/upload', async function (req, res) {
  var row = {};
    const entity = req.body;
    console.log(entity);

    row.ten_sp = entity.Name;
    row.gia_khoi_diem = entity.BeginPrice;
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
    const referer = `http://localhost:${PORT}/admin/upload/multiple`;
    res.redirect(referer);
    
})
  
router.get('/upload/multiple', (req, res) => {
  res.render('viewAdmin/uploadImages', {layout: false});
})  


router.post('/upload/multiple', upload.single('fuMain'), async (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  const PORT = config.host.port;
  const referer = `http://localhost:${PORT}/admin`;
  res.redirect(referer);
})

module.exports = router;