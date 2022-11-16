const db = require("../db");
const query = require("../lib/query");

module.exports = function (app) {
  // lay danh sach the loai
  app.get("/theloai", async (req, res) => {
    let qr =
      "SELECT danh_muc.*, the_loai.* FROM `the_loai` LEFT JOIN danh_muc ON danh_muc.dm_id = the_loai.tl_iddm ";
    if (req.query.search)
      qr += `WHERE tl_ten like '%${req.query.search}%' or dm_ten like '%${req.query.search}%'`;
    return res.status(200).send(await query(db, qr));
  });

  // dat lai trang thai the loai
  app.put("/api/theloai-active", async (req, res) => {
    const { id, active, tl_iddm, arrID } = req.body;
    const qr = `UPDATE the_loai SET active = ? where tl_id = ?`;
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

  // lay the loai theo id
  app.get("/theloai/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(404).send(null);
    return res
      .status(200)
      .send(await query(db, `SELECT * FROM the_loai where tl_id = ?`, id));
  });

  // chinh sua the loai theo id
  app.put("/theloai/:id/edit", async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    await query(db, `UPDATE the_loai SET ? WHERE tl_id = ?`, [data, id]);
    return res.status(200).send("Cập nhật thành công!");
  });

  // tao the loai
  app.post("/theloai/create", async (req, res) => {
    const data = req.body;
    const isExits = await query(
      db,
      "SELECT * FROM the_loai where tl_ten = ?",
      data.tl_ten
    );
    if (isExits.length > 0) return res.status(500).send("Tên đã tồn tại");
    await query(db, `INSERT INTO the_loai SET ?`, data);
    return res.status(200).send("Thêm thành công!");
  });

  // xoa the loai
  app.delete("/theloai/delete", async (req, res) => {
    if (!!req.body.arrID) {
      const arrID = JSON.parse(req.body.arrID);
      await Promise.all(
        arrID.map(
          async (e) =>
            await query(db, "DELETE FROM the_loai where tl_id = ?", [e])
        )
      );
      return res.status(201).send("Xóa thành công!");
    }
  });
};
