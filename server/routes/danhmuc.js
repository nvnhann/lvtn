const query = require("../lib/query");
const db = require("../db");

module.exports = function (app) {
  // lay danh muc
  app.get("/danhmuc", async (req, res) => {
    let qr = "SELECT * FROM danh_muc ";
    if (req.query.search) qr += `WHERE dm_ten like '%${req.query.search}%'`;
    return res.status(200).send(await query(db, qr));
  });

  // set trang thai danh muc
  app.put("/api/danhmuc-active", async (req, res) => {
    const { id, active, arrID } = req.body;
    const qr = `UPDATE danh_muc SET active = ? where dm_id = ?`;
    if (!!arrID) {
      let _arrID = JSON.parse(arrID);
      await Promise.all(
        _arrID.map(async (el) => await query(db, qr, [active, el]))
      );
    } else {
      await query(db, qr, [active, id]);
    }
    return res.status(200).send("Cập nhật thành công");
  });

  // lay danh muc id = ?
  app.get("/danhmuc/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(404).send(null);
    return res
      .status(200)
      .send(await query(db, `SELECT * FROM danh_muc where dm_id = ?`, id));
  });

  // chinh sua danh muc id = ?
  app.put("/danhmuc/:id/edit", async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    await query(db, `UPDATE danh_muc SET ? WHERE dm_id = ?`, [data, id]);
    return res.status(200).send("Cập nhật thành công!");
  });

  // them danh muc
  app.post("/danhmuc/create", async (req, res) => {
    const data = req.body;
    const qr_exist = "SELECT * FROM danh_muc where dm_ten = ?";
    const isExits = await query(
      db,
      `SELECT * FROM danh_muc where dm_ten = ?`,
      data.dm_ten
    );
    if (isExits.length > 0) return res.status(500).send("Tên đã tồn tại");
    await query(db, `INSERT INTO danh_muc SET ?`, data);
    return res.status(200).send("Thêm thành công!");
  });

  // xoa danh muc
  app.delete("/danhmuc/delete", async (req, res) => {
    if (!!req.body.arrID) {
      const arrID = JSON.parse(req.body.arrID);
      await Promise.all(
        arrID.map(
          async (e) =>
            await query(db, `DELETE FROM danh_muc where dm_id = ?`, [e])
        )
      );
    }
    return res.status(201).send("Xóa thành công!");
  });

  // get danh muc the loai
  app.get("/api/danhmuc", async (req, res) => {
    let _danh_muc = await query(db, `SELECT * FROM danh_muc WHERE active = 1`);
    await Promise.all(
      _danh_muc.map(async (_dm, idx) => {
        _danh_muc[idx].the_loai = await query(
          db,
          "SELECT * FROM the_loai WHERE active = 1 AND tl_iddm = ?",
          _dm.dm_id
        );
      })
    );
    return res.status(200).send(_danh_muc);
  });
};
