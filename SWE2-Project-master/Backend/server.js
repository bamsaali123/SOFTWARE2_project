const mongoose = require("mongoose");
const app = require('./app');
require("dotenv").config({ path: "d:/Collage Projects/soft/software2_project-master/SWE2-Project-master/Backend/.env" });

mongoose
  .connect(process.env.CONNECT_DB)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((e) => console.log(e));