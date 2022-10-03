const sql = require("../db");

module.exports = function (app) {
  app.get("/danhmuc", async (req, res) => {
    let qr = "SELECT * FROM danh_muc ";
    if (req.query.search) {
      qr += `WHERE dm_ten like '%${req.query.search}%'`;
    }
    sql.query(qr, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.status(200).send(data);
    });
  });

  app.post("/danhmuc/active", async (req, res) => {
    const { id, active } = req.body;
    console.log(req.body);
    if (!id) return res.status(404).send("No content");
    const qr = "UPDATE danh_muc SET active = ? where dm_id = ?";
    sql.query(qr, [active, id], (err, _) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.status(200).send("Cập nhật thành công");
    });
  });

  app.get("/danhmuc/:id", async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    if (!id) return res.status(404).send(null);
    const qr = " SELECT * FROM danh_muc where dm_id = ?";
    await sql.query(qr, id, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(data);
    });
  });

  app.put("/danhmuc/:id/edit", async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const qr = "UPDATE danh_muc SET ? WHERE dm_id = ?";
    sql.query(qr, [data, id], (err, _) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send("Cập nhật thành công!");
    });
  });

  app.post("/danhmuc/create", async (req, res) => {
    const data = req.body;
    const qr_exist = "SELECT * FROM danh_muc where dm_ten = ?";

    await sql.query(qr_exist, data.dm_ten, async (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length !== 0) return res.status(500).send("Tên đã tồn tại");
      const qr = "INSERT INTO danh_muc SET ?";
      await sql.query(qr, data);
      return res.status(200).send("Thêm thành công!");
    });
  });

  app.delete("/danhmuc/delete", async (req, res) => {
    if (!!req.body.arrID) {
      const arrID = JSON.parse(req.body.arrID);
      await Promise.all(
        arrID.map(async (e) => {
          let qr = "DELETE FROM danh_muc where dm_id = ?";
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
