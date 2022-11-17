const db = require("../db");
const query = require("../lib/query");
const sql = require("../db");

module.exports = function (app) {
  app.post("/khuyenmai", async (req, res) => {
    const data = req.body;
    if (data.km_idsp) {
      let _qr = "SELECT * FROM khuyen_mai WHERE km_idsp = ?";
      const _khuyenmai = await query(db, _qr, data.km_idsp);
      if (_khuyenmai.length !== 0)
        return res.status(500).send("Sản phẩm đã tồn tại");
      delete data.km_idtl;
      _qr = "INSERT INTO khuyen_mai SET ?";
      await query(db, _qr, data);
    } else {
      let _qr = "SELECT sp_id FROM san_pham WHERE sp_idtl = ?";
      const _idsps = await query(db, _qr, data.km_idtl);
      let _values = [];
      await Promise.all(
        await _idsps.map(
          async (e) =>
            await query(db, "DELETE FROM khuyen_mai WHERE km_idsp = ?", e.sp_id)
        )
      );
      if (_idsps.length === 0)
        return res.status(500).send("Thể loại chưa có sản phẩm");
      _idsps.map((e) =>
        _values.push([
          e.sp_id,
          data.km_phantramgiam,
          data.km_ngaybatdau,
          data.km_ngayketthuc,
        ])
      );
      await query(
        db,
        "INSERT INTO khuyen_mai(km_idsp, km_phantramgiam, km_ngaybatdau, km_ngayketthuc) values ?",
        [_values]
      );
    }
    res.status(200).send("Thêm thành công");
  });

  app.get("/khuyenmai", async (req, res) => {
    let _qr = `
                        SELECT khuyen_mai.*, san_pham.sp_ten, san_pham.sp_masp,the_loai.tl_id, the_loai.tl_ten
                        FROM khuyen_mai
                        LEFT JOIN san_pham ON san_pham.sp_id = khuyen_mai.km_idsp
                        LEFT JOIN the_loai ON the_loai.tl_id = san_pham.sp_idtl `;
    if (req.query.search) {
      let search = req.query.search;
      _qr += `WHERE the_loai.tl_ten like '%${search}%' or
                         san_pham.sp_masp like '%${search}%' or
                         san_pham.sp_ten like '%${search}%' or
                         khuyen_mai.km_phantramgiam = '${search}' or
                         khuyen_mai.km_ngaybatdau like '%${search}%' or
                         khuyen_mai.km_ngayketthuc like '%${search}'
           `;
    }
    qr += 'km_id ORDER BY DESC';
    return res.status(200).send(await query(db, _qr));
  });

  app.put("/api/khuyenmai-active", async (req, res) => {
    const { id, active, arrID } = req.body;
    const qr = "UPDATE khuyen_mai SET active = ? where km_id = ?";
    if (!!arrID) {
      let _arrID = JSON.parse(arrID);
      await Promise.all(
        _arrID.map(async (el) => await query(db, qr, [active, el]))
      );
    } else {
      await query(db, qr, [active, id]);
    }
    return res.status(200).send("Cập nhật thành công!");
  });

  app.delete("/khuyenmai/delete", async (req, res) => {
    if (!!req.body.arrID) {
      const arrID = JSON.parse(req.body.arrID);
      await Promise.all(
        arrID.map(async (e) => {
          let qr = "DELETE FROM khuyen_mai where km_id = ?";
          await sql.query(qr, [e], (err, _) => {
            if (err) {
              console.log(err);
            }
          });
        })
      );
      return res.status(201).send("Xóa thành công!");
    }
  });

  app.put("/khuyenmai/:id", async (req, res) => {
    const data = req.body;
    const { id } = req.params;
    if (data.km_idsp) {
      let _qr = "SELECT * FROM khuyen_mai WHERE km_id = ?";
      const _khuyenmai = await query(db, _qr, id);
      if (_khuyenmai.length === 0)
        return res.status(500).send("Khuyến mãi tồn tại");
      delete data.km_idtl;
      _qr = "UPDATE khuyen_mai SET ? WHERE km_id = ?";
      await query(db, _qr, [data, id]);
    } else {
      let _qr = "SELECT sp_id FROM san_pham WHERE sp_idtl = ?";
      const _idsps = await query(db, _qr, data.km_idtl);
      let _values = [];
      await Promise.all(
        await _idsps.map(
          async (e) =>
            await query(db, "DELETE FROM khuyen_mai WHERE km_idsp = ?", e.sp_id)
        )
      );
      if (_idsps.length === 0)
        return res.status(500).send("Thể loại chưa có sản phẩm");
      _idsps.map((e) =>
        _values.push([
          e.sp_id,
          data.km_phantramgiam,
          data.km_ngaybatdau,
          data.km_ngayketthuc,
        ])
      );
      await query(
        db,
        "INSERT INTO khuyen_mai(km_idsp, km_phantramgiam, km_ngaybatdau, km_ngayketthuc) values ?",
        [_values]
      );
    }
    res.status(200).send("Cập nhật thành công");
  });
};
