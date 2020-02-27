const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const nguoidungModel = require('../models/nguoidung.model');
const sanphamModel = require('../models/sanpham.model');
const xinphepUpgradeModel = require('../models/xinupgrade.model');
const restrict = require('../middlewares/auth.mdw');
const config = require('../config/default.json');
const request = require('request');

const router = express.Router();

router.get('/register', async (req, res) => {
    res.render('viewAccount/register');
});

router.post('/register', async (req, res) => {

    // g-recaptcha-response is the key that browser will generate upon form submit.
    // if its blank or null means user has not selected the captcha, so return the error.
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.render('viewAccount/register', {
            err_message: 'Vui lòng hoàn thành captcha'
        });
    }
    // Put your secret key here.
    var secretKey = "6Le_wswUAAAAALkRXypz0Ih3IfB_BO6VjRCApG4G";
    // req.connection.remoteAddress will provide IP address of connected user.
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    // Hitting GET request to the URL, Google will respond with success or error scenario.
    request(verificationUrl, function (error, response, body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if (body.success !== undefined && !body.success) {
            return res.render('viewAccount/register', {
                err_message: 'Xác thực captcha thất bại'
            });
        }
    });

    delete req.body['g-recaptcha-response'];

    console.log(req.body);

    const N = 10;
    const hash = bcrypt.hashSync(req.body.raw_password, N);
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const entity = req.body;
    //xử lý tài khoản có tồn tại hay chưa
    const user = await nguoidungModel.singleByUsername(req.body.ten_dang_nhap);
    if (user !== null) {
        return res.render('viewAccount/register', {
            err_message: 'Username đã tồn tại'
        })
    };
    //xử lý email đã tồn tại
    const email = await nguoidungModel.singleByEmail(req.body.email);
    if (email !== null) {
        return res.render('viewAccount/register', {
            err_message: 'Email đã tồn tại'
        })
    };

    console.log(entity);
    entity.mat_khau = hash;
    entity.quyen_han = 0; //nguoi dung binh thuong (bidder)
    entity.ngay_sinh = dob;

    //console.log(entity);

    delete entity.raw_password;
    delete entity.dob;
    delete entity.raw_cf_password;

    const result = await nguoidungModel.add(entity);

    res.render('viewAccount/register', {
        success: 'Đăng ký thành công'
    });
});

router.get('/login', (req, res) => {
    res.render('viewAccount/login');
})

router.post('/login', async (req, res) => {
    const user = await nguoidungModel.singleByUsername(req.body.user);

    if(user === null)
    {
        return res.render('viewAccount/login', {
            err_message: 'Tài khoản hoặc mật khẩu không đúng'
        });
    }
    // console.log(user);
    // console.log(req.body.raw_password);

    const rs = bcrypt.compareSync(req.body.raw_password, user.mat_khau);
    if (rs === false){
        return res.render('viewAccount/login', {
            err_message: 'Tài khoản hoặc mật khẩu không đúng'
        });
    }
    delete user.mat_khau;
    req.session.isAuthenticated = true;
    req.session.authUser = user;

    var url = req.query.retUrl || '/';

    if (user.ten_dang_nhap === 'admin' || user.ten_dang_nhap === 'admin1' || user.ten_dang_nhap === 'admin2') {
        const PORT = config.host.port;
        url = `http://localhost:${PORT}/admin`;
    }

    res.redirect(url);
});

router.post('/logout', (req, res) => {
    req.session.isAuthenticated = false;
    req.session.authUser = null;
    res.redirect(req.headers.referer);
});

router.get('/profile/:id_user', restrict, async (req, res) => {
    //lấy thông tin người dùng
    var rows = await nguoidungModel.single(req.params.id_user);

    //lấy sản phẩm yêu thích
    var farows = await sanphamModel.favourite(req.params.id_user);

    //lấy sản phẩm đã đăng bán (của seller)
    var selledrows = await sanphamModel.allBySeller(req.params.id_user);
    console.log(selledrows);

    /*if (user.quyen_han === 1){
        var sellrows = await sanphamModel.allBySeller(user.id);
        res.render('viewAccount/profile', {
            user: rows,
            empty: rows.length === 0,
            favourite: farows,
            empty_fa : farows.length === 0,
            selled: sellrows,
            empty_sell: sellrows.length === 0
        });
    }*/


    res.render('viewAccount/profile', {
        user: rows,
        empty: rows.length === 0,
        favourite: farows,
        empty_fa: farows.length === 0,
        selled: selledrows,
        empty_sell: selledrows.length === 0,
        empty_fa: farows.length === 0
    });
});

router.post('/profile/upgrade/:id', async (req, res) => {
    //thêm vào bảng xin_phep_upgrade
    const rows = await xinphepUpgradeModel.single(req.params.id);

    for (var i of rows) {
        if (i.id_user == req.params.id) {
            res.redirect(req.headers.referer);
        }
    }


    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    var entity = {};
    entity.id_user = req.params.id;
    entity.ngay_dk = date;

    xinphepUpgradeModel.add(entity);

    res.redirect(req.headers.referer);
})

router.get('/profile/change/:id_user', async (req, res) => {
    const row = await nguoidungModel.single(req.params.id_user);

    res.render('viewAccount/changeProfile',
        {
            info: row,
            empty: row.length
        });
})

router.post('/profile/change/:id_user', async (req, res) => {
    var row = await nguoidungModel.single(req.params.id_user);
    row = row[0];

    const entity = req.body;

    //xử lý email đã tồn tại
    const email = await nguoidungModel.singleByEmail(req.body.Email);
    console.log(email);
    if (email === null) { //ko có tài khoản nào email trùng
        row.ten = entity.Name;
        row.email = entity.Email;
        row.ngay_sinh = entity.DOB;
        const result = await nguoidungModel.patch(row);
    }
    else {//có tài khoản có email trùng
        //có phải tài khoản đang được đăng nhập hay ko
        const r = email.id === row.id;
        if (r) { // true
            row.ten = entity.Name;
            row.email = entity.Email;
            row.ngay_sinh = entity.DOB;
            const result = await nguoidungModel.patch(row);
        } else {
            return res.render('viewAccount/register', {
                err_message: 'Email already exists'
            });
        }
    }

    res.redirect(req.headers.referer);
})

router.get('/profile/changepass/:id_user', (req, res) => {
    res.render('viewAccount/changePass');
})

router.post('/profile/changepass/:id_user', async (req, res) => {
    var row = await nguoidungModel.single(req.params.id_user);
    row = row[0];

    const rs = bcrypt.compareSync(req.body.oldPass, row.mat_khau);
    if (rs === false)
        return res.render('viewAccount/changePass', {
            err_message: 'Invalid password'
        });

    //re === true
    console.log(req.body.newPass);

    const N = 10;
    const hash = bcrypt.hashSync(req.body.newPass, N);
    console.log(hash);

    row.mat_khau = hash;

    console.log(row);

    const result = await nguoidungModel.patch(row);

    res.render('viewAccount/changePass', {
        err_message: 'Password is changed'
    });
})

router.get('/:id/rate', async (req, res) => {
    const rows = await nguoidungModel.single(req.params.id);
    res.render('viewAccount/userRate', {
        users: rows
    });
})

module.exports = router;
