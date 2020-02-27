const express = require('express');
const productsModel = require('../models/sanpham.model');
const config = require('../config/default.json');

const router = express.Router();
let results;

// trang chu

function increasePrice( a, b ) {
  if (a.gia_hien_tai < b.gia_hien_tai){
    return -1;
  }
  if (a.gia_hien_tai > b.gia_hien_tai ){
      return 1;
  }
  return 0;
}

function decreasePrice( a, b ) {
  if (a.gia_hien_tai > b.gia_hien_tai){
    return -1;
  }
  if (a.gia_hien_tai < b.gia_hien_tai ){
    return 1;
  }
  return 0;
}

function increaseDate(a,b){
  var tempa,tempb;
  if (a.ngay_dang < b.ngay_dang){
    return -1;
  }
  if (a.ngay_dang > b.ngay_dang){
      return 1;
  }
  return 0;
}

function decreaseDate(a,b){
  var tempa,tempb;
  if (a.ngay_dang > b.ngay_dang){
    return -1;
  }
  if (a.ngay_dang < b.ngay_dang){
      return 1;
  }
  return 0;
}

router.get('/', async(req, res) => {
    const rows = await productsModel.all();
    res.render('viewSearch/searchbody', {
        products: rows,
        empty: rows.length === 0
    });
}) 

router.post('/sort',function(req,res){
  if (req.body.sortProducts=='1'){
    results=results.sort(increaseDate);
  }
  else if (req.body.sortProducts=='2'){
    results=results.sort(decreaseDate);
  }
  else if (req.body.sortProducts=='3'){
    results= results.sort(increasePrice);
  } 
  else if (req.body.sortProducts=='4'){
    results= results.sort(decreasePrice);
  }
  res.render('viewSearch/searchbody',{
    products: results,
    empty: results.length===0
  });
})

router.post('/',async(req,res)=>{
  results=await productsModel.search(req.body.inputSearch,req.body.searchType);
  // let temp = document.getElementById("inputSearch");
  // temp.innerHTML=req.body.inputSearch;
  res.render('viewSearch/searchbody',{
    products: results,
    empty: results.length===0
  });
  //res.render('viewHome/index')
})

// xem ds sản phẩm thuộc danh mục :id

// router.get('/:id_loai/products', async (req, res) => {

//   for (const c of res.locals.lcCategories) {
//     //console.log(c);
//     if (c.id_loai === +req.params.id_loai) {
//       c.isActive = true;
//     }
//   }

//   const catId = req.params.id_loai;
//   const limit = config.paginate.limit;

//   const page = req.query.page || 1;
//   if (page < 1) page = 1;
//   const offset = (page - 1) * config.paginate.limit;

//   const [total, rows] = await Promise.all([
//     productsModel.countByCat(catId),
//     productsModel.pageByCat(catId, offset)
//   ]);

//   let nPages = Math.floor(total / limit);
//   if (total % limit > 0) nPages++;
//   const page_numbers = [];
//   for (i = 1; i <= nPages; i++) {
//     page_numbers.push({
//       value: i,
//       isCurrentPage: i === +page
//     })
//   }

//   res.render('viewProducts/products', {
//     products: rows,
//     empty: rows.length === 0,
//     page_numbers,
//     prev_value: +page - 1,
//     next_value: +page + 1,
//   });
//   /*
//   const rows = await productsModel.allByCat(req.params.id_loai);
//   res.render('viewProducts/products', {
//     products: rows,
//     empty: rows.length === 0
//   });
//   */
// })

// // xem chi tiet tung san pham theo id san pham

// router.get('/:id/detailproduct', async(req,res) => {
//   //console.log(req.params.id);

//   const rows = await productsModel.single(req.params.id);
//   res.render('viewProducts/products_detail', {
//     products: rows,
//     empty: rows.length === 0
//   })
// })

//bat loi

router.get('/err', (req, res) => {

    throw new Error('error occured');
  
})


module.exports = router;
  