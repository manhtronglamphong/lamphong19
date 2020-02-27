const express = require('express');
const dataMask = require('data-mask');
const productsModel = require('../models/sanpham.model');
const nguoidungModel = require('../models/nguoidung.model');
const config = require('../config/default.json');
const moment = require('moment');

const router = express.Router();

// trang chu

function increaseDate(a, b) {
  var tempa, tempb;
  if (a.ngay_het_han < b.ngay_het_han) {
    return -1;
  }
  if (a.ngay_het_han > b.ngay_het_han) {
    return 1;
  }
  return 0;
}

function decreaseDate(a, b) {
  var tempa, tempb;
  if (a.thoi_diem_ra_gia > b.thoi_diem_ra_gia) {
    return -1;
  }
  if (a.thoi_diem_ra_gia < b.thoi_diem_ra_gia) {
    return 1;
  }
  return 0;
}

function decreasePrice(a, b) {
  if (a.gia_hien_tai > b.gia_hien_tai) {
    return -1;
  }
  if (a.gia_hien_tai < b.gia_hien_tai) {
    return 1;
  }
  return 0;
}

function top5Date(rows) {
  var temp = rows.sort(increaseDate);
  temp = temp.slice(0, 5);
  return temp;
}

function top5Price(rows) {
  var today = new Date();
  // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  // var dateTime = date+' '+time;
  //console.log(dateTime);
  var temp = [];
  for (var i = 0; i < rows.length; i++) {
    if ((rows[i].ngay_het_han > today) && (!(rows[i].ngay_het_han === 'null'))) {
      temp.push(rows[i]);
    }
    // console.log(moment(rows[i].ngay_het_han, "").format('dd/MM/YYYY'));
    // if (rows[i].ngay_het_han<today){
    //   console.log("aha");
    // }
    //  console.log(rows[i].ngay_het_han);
  }
  temp = temp.sort(decreasePrice);
  temp = temp.slice(0, 5);
  return temp;
}

// function top5Bid(){
//   var temp=productsModel.allByCat(1);
//   console.log(temp);
//   var temp2= temp.san_pham_id;

//   var temp3=[];
//   for (var i=0;i<temp2.length;i++)
//   {
//     temp3.push(productsModel.single(temp2[i]));
//   }
//   console.log(temp3);
//   return temp3;
// }

router.get('/', async (req, res) => {
  const rows = await productsModel.all();
  const t2 = await productsModel.topbid();
  // const temp1=temp.san_pham_id;
  // console.log('abc');
  // console.log(temp1);

  const t1 = top5Date(rows);
  const t3 = top5Price(rows);

  // for (var i=0;i<temp.length;i++)
  // {
  //   console.log(temp[i][0]);
  //   t2.push(productsModel.single(temp[i].san_pham_id));
  // }

  rows[0].ngay_dang = moment(rows[0].ngay_dang).format('MM/DD/YYYY h:mm a');
  rows[0].ngay_het_han = moment(rows[0].ngay_het_han).format('MM/DD/YYYY h:mm a');

  res.render('viewHome/index', {
    products: rows,
    products1: t1,
    products2: t2,
    products3: t3,
    empty: rows.length === 0
  });
})

// xem ds sản phẩm thuộc danh mục :id

router.get('/:id_loai/products', async (req, res) => {

  for (const c of res.locals.lcCategories) {
    //console.log(c);
    if (c.id_loai === +req.params.id_loai) {
      c.isActive = true;
    }
  }

  const catId = req.params.id_loai;
  const limit = config.paginate.limit;

  const page = req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * config.paginate.limit;

  const [total, rows] = await Promise.all([
    productsModel.countByCat(catId),
    productsModel.pageByCat(catId, offset)
  ]);

  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;
  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page
    })
  }

  rows[0].ngay_dang = moment(rows[0].ngay_dang).format('MM/DD/YYYY h:mm a');
  rows[0].ngay_het_han = moment(rows[0].ngay_het_han).format('MM/DD/YYYY h:mm a');

  res.render('viewProducts/products', {
    products: rows,
    empty: rows.length === 0,
    page_numbers,
    prev_value: +page - 1,
    next_value: +page + 1,
  });
  /*
  const rows = await productsModel.allByCat(req.params.id_loai);
  res.render('viewProducts/products', {
    products: rows,
    empty: rows.length === 0
  });
  */
})

// xem chi tiet tung san pham theo id san pham

router.get('/:id/detailproduct', async (req, res) => {
  //console.log(req.params.id);
  // let bid=[];
  const bid = await productsModel.bidder(req.params.id);
  bid.sort(decreaseDate);
  // const bid=[];
  // var c={};
  // for (var i=0;i<bid.length;i++){
  //   c.add(i+1);
  //   console.log(c);
  // }
  // bid.push(bidhis);
  // bid.push(c);
  // // bid.count=c;
  for (var i = 0; i < bid.length; i++) {
    var dataMasker = new dataMask(bid[i].ten_dang_nhap);
    // bid[i].ten_dang_nhap=bid[i].ten_dang_nhap.maskRight(5);
    var num = (bid[i].ten_dang_nhap.length / 2) + 1;
    bid[i].ten_dang_nhap = dataMasker.maskLeft(num);
    // console.log(bid[i]);
  }
  const rows = await productsModel.single(req.params.id);
  rows[0].ngay_dang = moment(rows[0].ngay_dang).format('MM/DD/YYYY h:mm a');
  rows[0].ngay_het_han = moment(rows[0].ngay_het_han).format('MM/DD/YYYY h:mm a');
  const relate = await productsModel.relate(req.params.id);
  console.log("haha");
  console.log(relate);

  //Lấy tên người bán
  var sellerid = rows[0].nguoi_ban_id;
  const sellerinfo = await nguoidungModel.single(sellerid);

  res.render('viewProducts/products_detail', {
    products: rows,
    sellers: sellerinfo,
    bidders: bid,
    relate: relate,
    empty: rows.length === 0
  })
})

//bat loi

router.get('/err', (req, res) => {

  throw new Error('error occured');

})


module.exports = router;
