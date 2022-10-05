const query = require("../lib/query");
const db = require("../db");

module.exports = function (app) {
  app.post("/phieunhap", async (req, res) => {
    let _sanpham = req.body.sanpham;
    let _phieunhap = req.body;
    delete _phieunhap.sanpham;
    console.log(_sanpham);
    const qr_phieunhap = "INSERT INTO phieu_nhap SET ?";
    await db.query(qr_phieunhap, _phieunhap, async (err, _rs_pn) => {
      if (err) {
        console.log(err);
      }
      let id_pn = _rs_pn.insertId;
      let _spArr = [];
      _sanpham.map((e) =>
        _spArr.push([e.ctpn_idsp, e.ctpn_soluong, e.ctpn_gia, id_pn])
      );
      const qr_ctpn =
        "INSERT INTO chi_tiet_phieu_nhap(ctpn_idsp, ctpn_soluong, ctpn_gia, ctpn_idpn) VALUES ?";
      await db.query(qr_ctpn, [_spArr], (err, __) => {
        if (err) {
          console.log(err);
        }
      });
      return res.status(200).send("Thêm thành công");
    });
  });

  app.get("/phieunhap", async (req, res) => {
    const qr_pn = `
        SELECT phieu_nhap.*, users.fullname, nha_cung_cap.ncc_ten
        FROM phieu_nhap
        LEFT JOIN users ON users.id = phieu_nhap.pn_idnv
        LEFT JOIN nha_cung_cap ON nha_cung_cap.ncc_id = phieu_nhap.pn_idncc
    `;
    return res.status(200).send(await query(db, qr_pn));
  });
};
