const sql = require("../db");

module.exports = function (app) {
  app.get("/theloai", async (req, res) => {
    let qr = "SELECT * FROM `the_loai` LEFT JOIN danh_muc ON danh_muc.dm_id = the_loai.tl_iddm ";
    if (req.query.search) {
      qr += `WHERE tl_ten like '%${req.query.search}%' or dm_ten like '%${req.query.search}%'`;
    }
    sql.query(qr, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.status(200).send(data);
    });
  });

  app.post("/theloai/active", async (req, res) => {
    const { id, active } = req.body;
    console.log(req.body);
    if (!id) return res.status(404).send("No content");
    const qr = "UPDATE the_loai SET active = ? where tl_id = ?";
    sql.query(qr, [active, id], (err, _) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.status(200).send("Cập nhật thành công");
    });
  });

  app.get("/theloai/:id", async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    if (!id) return res.status(404).send(null);
    const qr = " SELECT * FROM the_loai where tl_id = ?";
    await sql.query(qr, id, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(data);
    });
  });

  app.put("/theloai/:id/edit", async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const qr = "UPDATE the_loai SET ? WHERE tl_id = ?";
    sql.query(qr, [data, id], (err, _) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send("Cập nhật thành công!");
    });
  });

  app.post("/theloai/create", async (req, res) => {
    const data = req.body;
    const qr_exist = "SELECT * FROM the_loai where tl_ten = ?";

    await sql.query(qr_exist, data.tl_ten, async (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length !== 0) return res.status(500).send("Tên đã tồn tại");
      const qr = "INSERT INTO the_loai SET ?";
      await sql.query(qr, data);
      return res.status(200).send("Thêm thành công!");
    });
  });

  app.delete("/theloai/delete", async (req, res) => {
    if (!!req.body.arrID) {
      const arrID = JSON.parse(req.body.arrID);
      await Promise.all(
        arrID.map(async (e) => {
          let qr = "DELETE FROM the_loai where tl_id = ?";
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
};
