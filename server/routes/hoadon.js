const db = require('../db');
const query = require('../lib/query');

module.exports = function (app){
    app.post('/hoadon', async (req, res)=>{
        let data = req.body;
        let product = data.product;
        delete data.product;
        let _qr = `INSERT INTO hoa_don SET ?`;
        let _hoadon = await query(db, _qr, data);
        console.log((_hoadon.insertId));
        let _ctht = [];
        product.map(e=> _ctht.push([_hoadon.insertId, e.ctpn_gia, e.sp_giakhuyenmai, e.sp_soluong, e.sp_id]));
        await query(db, `INSERT INTO chi_tiet_hoa_don (cthd_idhd, cthd_giaban, cthd_giakm, cthd_soluong, cthd_idsp) VALUES ?`, [_ctht])
        return res.status(200).send("Thêm thành công hóa đơn!")
    })
}