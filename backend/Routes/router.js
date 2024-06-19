const express = require("express");
const router = new express.Router();
const upload = require("../multerconfig/storageConfig");
const {
  UserPost,
  UserGet,
  SingleUserGet,
  UserEdit,
  UserDelete,
  UserStatus,
  UserExport,
} = require("../Controllers/usersControllers");

// routes
router.post("/user/register", upload.single("user_profile"), UserPost);
router.get("/user/details", UserGet);
router.get("/user/:id", SingleUserGet);
router.put("/user/edit/:id", upload.single("user_profile"), UserEdit);
router.delete("/user/delete/:id", UserDelete);
router.put("/user/status/:id", UserStatus);
router.get("/userexport", UserExport);

module.exports = router;
