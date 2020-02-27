const express = require('express');
const yeuthichModel = require('../models/yeuthich.model');
const productsModel = require('../models/sanpham.model');
const nguoidungModel = require('../models/nguoidung.model');
const bidModel = require('../models/chitietragia.model');
const nodemailer = require("nodemailer");
const moment = require('moment');

const router_Products = express.Router();

router_Products.get('/:id/detailproduct', async(req,res) => {
  //console.log(req.params.id);
  const rows = await productsModel.single(req.params.id);
  var sellerid = rows[0].nguoi_ban_id;
  const users = await nguoidungModel.single(sellerid);
  res.render('viewProducts/products_detail', {
    products: rows,
    userinfo: users,
    empty: rows.length === 0
  })
})

//Xy ly bid (chua xong)
router_Products.post('/:id/:crprice/bid', async (req,res) =>{

  const status =  req.session.isAuthenticated;

  if (status === false) {
    return res.render('viewAccount/login');
  }

  var productid = req.params.id;
  var currentprice = req.params.crprice;
  var bidprice = req.body.gia_dau;

  //Gia bid thap
  //Can sua currentprice thanh currentprice+ buoc gia
  if(parseInt(bidprice) <= parseInt(currentprice))
  {
    return res.render('viewProducts/products_detail',{
      err_message: `Your bid price must be higher than ${currentprice}`,
    });
  }

  //Bid thanh cong
  const entity = req.body;

  entity.san_pham_id = req.params.id;
  entity.nguoi_dung_id = req.session.authUser.id;
  entity.gia =req.body.gia_dau;
  entity.thoi_diem_ra_gia = moment().format('YYYY-MM-DD HH:mm:ss');

  delete entity.gia_dau;

  //Them vao danh sach bid (chi_tiet_ra_gia)
  bidModel.add(entity);
// Send email =================================================
var transporter =  nodemailer.createTransport({ // config mail server
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: 'meolamphong19@gmail.com', //Tài khoản gmail vừa tạo
      pass: 'Manhtronglamphong19' //Mật khẩu tài khoản gmail vừa tạo
  },
  tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
  }
});
var content = '';
content += `
  <div style="padding: 10px; background-color: #003375">
      <div style="padding: 10px; background-color: white;">
          <h4 style="color: #0085ff">THIS IS VERIFY EMAIL</h4>
          <span style="color: black">Your bidding has been recorded successfully!!!</span>
      </div>
  </div>
`;
const mainOptions = { // thiết lập đối tượng, nội dung gửi mail
  from: 'ngmanh2104@gmail.com',
  to: req.session.authUser.email,
  subject: 'ONLINE AUNCTION',
  text: 'Your bidding has been recorded!!!',//Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
  html: content //Nội dung html mình đã tạo trên kia :))
}
transporter.sendMail(mainOptions, function(err, info){
  if (err) {
      console.log(err);
      //req.flash('mess', 'Lỗi gửi mail: '+err); //Gửi thông báo đến người dùng
      //res.redirect('/');
  } else {
      console.log('Message sent: ' +  info.response);
      //req.flash('mess', 'Một email đã được gửi đến tài khoản của bạn'); //Gửi thông báo đến người dùng
      //res.redirect('/');
  }
});

// /Send email ================================================
  //Cap nhat lai gia hien tai
  const en_sanpham = await productsModel.single(productid);
  en_sanpham[0].gia_hien_tai = bidprice;
  productsModel.updatePrice(en_sanpham);

  //Chuyen den trang bao thanh cong
  res.redirect(req.headers.referer);

})

//xu ly nhan button 'Yeu Thich' van chua duoc

router_Products.post('/:id/detailproduct', async (req, res) => {

   const status =  req.session.isAuthenticated;

    console.log(status);

   if (status === false) {
     return res.render('viewAccount/login');
   }
   // true 
   const user =  req.session.authUser.id;

   console.log(user);

   const product = req.params.id; 

   console.log(product);

   const entity = {user, product};

   console.log(entity);

   const result = await yeuthichModel.add(entity);
   res.redirect(req.headers.referer);
})

router_Products.get('/err', (req, res) => {

    throw new Error('error occured');
})

module.exports = router_Products;