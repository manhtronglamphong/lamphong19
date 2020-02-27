const express = require('express');
const yeuthichModel = require('../models/yeuthich.model');
//const nguoidungModel  = require('../models/nguoidung.model');

const router = express.Router();

router.post('/:id_sp', async (req, res) =>{
    //nếu chưa login, chuyển qua màn hình login
    if (req.session.isAuthenticated === false){
        res.render('viewAccount/login');
    } 
    else{
        res.locals.isAuthenticated = req.session.isAuthenticated;
        //đã login (user chưa thêm sp đó thành yêu thích)
        //lấy id user hiện tại
        const user_id = req.session.authUser.id;
        console.log(user_id);
        //lấy id sản phẩm
        const sp_id = req.params.id_sp;
        console.log(sp_id);
        
        //kiểm tra (user_id, sp_id) có tồn tại hay chưa
        var row = await yeuthichModel.single(user_id,sp_id);
        console.log(row);
        row = row[0];
        if (row === undefined){
            var entity = {};
            entity.id_user = user_id;
            entity.id_sp = sp_id;
            const result = await yeuthichModel.add(entity);
        }

        res.redirect(req.headers.referer);
    }
})

router.post('/del/:id_sp', async (req, res) => {
    //lấy id user
    const user_id = req.session.authUser.id;
    console.log(user_id);
    //lấy id sản phẩm
    const sp_id = req.params.id_sp;
    console.log(sp_id);
    
    //const result = await yeuthichModel.del(user_id,sp_id);
    //console.log(result);
   
    res.redirect(req.headers.referer);
})

router.get('/err', (req, res) => {

    throw new Error('error occured');

})

module.exports = router;
