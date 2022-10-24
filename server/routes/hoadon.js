const db = require('../db');
const query = require('../lib/query');

module.exports = function (app) {
    app.post('/hoadon', async (req, res) => {
        let data = req.body;
        let product = data.product;
        delete data.product;
        let _qr = `INSERT INTO hoa_don SET ?`;
        let _hoadon = await query(db, _qr, data);

        let _trangthaihoadon = {
            tt_trangthai: 0,
            tt_idhd: _hoadon.insertId
        };

        let _qr_status = "INSERT INTO trang_thai SET ?";
        await query(db, _qr_status, _trangthaihoadon);
        let _ctht = [];
        product.map(e => _ctht.push([_hoadon.insertId, e.ctpn_gia, e.sp_giakhuyenmai, e.sp_soluong, e.sp_id]));
        await query(db, `INSERT INTO chi_tiet_hoa_don (cthd_idhd, cthd_giaban, cthd_giakm, cthd_soluong, cthd_idsp) VALUES ?`, [_ctht])
        return res.status(200).send("Thêm thành công hóa đơn!")
    });

    app.get('/hoadon', async (req, res) => {
        let _hoadon = await query(db, "SELECT * FROM hoa_don");

        if (_hoadon.length) {
            let _cthd = "SELECT chi_tiet_hoa_don.*, san_pham.sp_ten, san_pham.sp_masp, ha_max.ha_hinh\n" +
                "FROM `chi_tiet_hoa_don`\n" +
                "LEFT JOIN san_pham ON chi_tiet_hoa_don.cthd_idsp = san_pham.sp_id\n" +
                "LEFT JOIN (SELECT ha_idsp, ha_hinh, MAX(ha_id)  FROM `hinh_anh` GROUP BY ha_idsp) ha_max ON ha_max.ha_idsp = chi_tiet_hoa_don.cthd_idsp\n" +
                "WHERE chi_tiet_hoa_don.cthd_idhd = ?";

            await Promise.all(await _hoadon.map(async (e, idx) => {
                _hoadon[idx].cthd = await query(db, _cthd, e.hd_id);
                _hoadon[idx].trangthai = await query(db, "SELECT * FROM trang_thai WHERE tt_idhd = ?", e.hd_id);
            }));
        }

        return res.status(200).send(_hoadon);
    });

    app.get('/hoadon/:id', async (req, res) => {
        const {id} = req.params;
        let _hoadon = await query(db, "SELECT * FROM hoa_don WHERE hoa_don.hd_idkh = ?", id);

        if (_hoadon.length) {
            let _cthd = "SELECT chi_tiet_hoa_don.*, san_pham.sp_ten, san_pham.sp_masp, ha_max.ha_hinh\n" +
                "FROM `chi_tiet_hoa_don`\n" +
                "LEFT JOIN san_pham ON chi_tiet_hoa_don.cthd_idsp = san_pham.sp_id\n" +
                "LEFT JOIN (SELECT ha_idsp, ha_hinh, MAX(ha_id)  FROM `hinh_anh` GROUP BY ha_idsp) ha_max ON ha_max.ha_idsp = chi_tiet_hoa_don.cthd_idsp\n" +
                "WHERE chi_tiet_hoa_don.cthd_idhd = ?";

            await Promise.all(await _hoadon.map(async (e, idx) => {
                _hoadon[idx].cthd = await query(db, _cthd, e.hd_id);
                _hoadon[idx].trangthai = await query(db, "SELECT * FROM trang_thai WHERE tt_idhd = ?", e.hd_id);
            }));
        }

        return res.status(200).send(_hoadon);
    });

    app.put('/hoadon/:id', async (req, res) => {
        const {id} = req.params;
        const data = req.body;
        const _qr = "UPDATE trang_thai SET ? WHERE tt_idhd = ?";
        await query(db, _qr, [data, id]);
        return res.status(200).send("Cap nhat thanh cong");
    })
}