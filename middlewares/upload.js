const multer = require("multer");
const {v4: uuidv4} = require('uuid')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ถ้าไม่มี error ให้ใส่ค่า null เป็น config ของทาง Nodejs
    cb(null, "public/images");
  },     
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "." + file.mimetype.split("/")[1]);
  },
});

// module.exports = multer({ dest: "public/images" });
module.exports = multer({ storage });
