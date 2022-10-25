const db = require('../db');
const query = require('../lib/query');

const multer = require("multer");
const bodyParser = require("body-parser");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(
            file.originalname.lastIndexOf("."),
            file.originalname.length
        );
        cb(null, file.fieldname + "-" + Date.now() + ext);
    },
});

let upload = multer({storage: storage});

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
        let _hoadon = await query(db, "SELECT * FROM hoa_don ORDER BY hd_id DESC");

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

    app.get('/hoadonnv/:id', async (req, res) => {
        const {id} = req.params;
        let _hoadon = await query(db, "SELECT * FROM hoa_don WHERE hoa_don.hd_idnv = ? ORDER BY hd_id DESC", id);

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
        let _hoadon = await query(db, "SELECT * FROM hoa_don WHERE hoa_don.hd_idkh = ? ORDER BY hd_id DESC", id);

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

    app.put('/hoadon/:id', upload.single('hoadon'), async (req, res) => {
        const {id} = req.params;
        let data = {};
        if (req.file) {
            let {_data} = req.body;
            console.log(_data)
            data = JSON.parse(_data);
            data.tt_note = req.file.filename;
        } else {
            data = req.body;
        }


        if (data.tt_trangthai === 1) {
            await query(db, "UPDATE hoa_don SET hd_idnv = ? WHERE hd_id = ?", [data.hd_idnv, id]);
            delete data.hd_idnv;
        }

        data.tt_idhd = id;

        const _qr = "INSERT INTO trang_thai SET ?";

        await query(db, _qr, [data, id]);
        return res.status(200).send("Cap nhat thanh cong");
    })
}