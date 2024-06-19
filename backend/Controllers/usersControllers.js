const users = require("../models/usersSchema");
const moment = require("moment");
const csv = require("fast-csv");
const path = require("path");
const fs = require("fs");
const BASE_URL = process.env.BASE_URL;

// Register user
const UserPost = async (req, res) => {
  const file = req.file.filename;
  const { fname, lname, email, mobile, gender, location, status } = req.body;

  if (!fname || !lname || !email || !mobile || !gender || !location || !status || !file) {
    return res.status(401).json("All Inputs are required");
  }

  try {
    const preuser = await users.findOne({ email });
    if (preuser) {
      return res.status(401).json("This user already exists in our database");
    }

    const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
    const userData = new users({
      fname,
      lname,
      email,
      mobile,
      gender,
      location,
      status,
      profile: file,
      datecreated,
    });

    await userData.save();
    res.status(200).json(userData);
  } catch (error) {
    res.status(401).json(error);
  }
};

// Get users
const UserGet = async (req, res) => {
  const search = req.query.search || "";
  const gender = req.query.gender || "";
  const status = req.query.status || "";
  const sort = req.query.sort || "";
  const page = req.query.page || 1;
  const ITEM_PER_PAGE = 1;

  const query = {
    fname: { $regex: search, $options: "i" },
  };

  if (gender !== "All") {
    query.gender = gender;
  }

  if (status !== "All") {
    query.status = status;
  }

  try {
    const skip = (page - 1) * ITEM_PER_PAGE;
    const count = await users.countDocuments(query);
    const usersdata = await users
      .find(query)
      .sort({ datecreated: sort === "new" ? -1 : 1 })
      .limit(ITEM_PER_PAGE)
      .skip(skip);

    const pageCount = Math.ceil(count / ITEM_PER_PAGE);

    res.status(200).json({
      Pagination: {
        count,
        pageCount,
      },
      usersdata,
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

// Get single user
const SingleUserGet = async (req, res) => {
  const { id } = req.params;

  try {
    const userdata = await users.findOne({ _id: id });
    res.status(200).json(userdata);
  } catch (error) {
    res.status(401).json(error);
  }
};

// Edit user
const UserEdit = async (req, res) => {
  const { id } = req.params;
  const { fname, lname, email, mobile, gender, location, status, user_profile } = req.body;
  const file = req.file ? req.file.filename : user_profile;

  const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

  try {
    const existingUser = await users.findById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.file && existingUser.profile) {
      const oldImagePath = path.join(__dirname, "../public/images/uploads", existingUser.profile);
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error(`Failed to delete old image file: ${existingUser.profile}`, err);
        }
      });
    }

    existingUser.fname = fname;
    existingUser.lname = lname;
    existingUser.email = email;
    existingUser.mobile = mobile;
    existingUser.gender = gender;
    existingUser.location = location;
    existingUser.status = status;
    existingUser.profile = file;
    existingUser.dateUpdated = dateUpdated;

    const updatedUser = await existingUser.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating user data", details: error });
  }
};

// Delete user
const UserDelete = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await users.findByIdAndDelete({ _id: id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.profile) {
      const imagePath = path.join(__dirname, "../public/images/uploads", user.profile);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Failed to delete image file: ${user.profile}`, err);
        }
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(401).json(error);
  }
};

// Change user status
const UserStatus = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  try {
    const userstatusupdate = await users.findByIdAndUpdate(
      { _id: id },
      { status: data },
      { new: true }
    );
    res.status(200).json(userstatusupdate);
  } catch (error) {
    res.status(401).json(error);
  }
};

// Export users to CSV
const UserExport = async (req, res) => {
  try {
    const usersdata = await users.find();

    const csvStream = csv.format({ headers: true });

    if (!fs.existsSync("public/files/export/")) {
      if (!fs.existsSync("public/files")) {
        fs.mkdirSync("public/files/");
      }
      if (!fs.existsSync("public/files/export")) {
        fs.mkdirSync("./public/files/export/");
      }
    }

    const writablestream = fs.createWriteStream("public/files/export/users.csv");

    csvStream.pipe(writablestream);

    writablestream.on("finish", function () {
      res.json({
        downloadUrl: `${BASE_URL}/files/export/users.csv`,
      });
    });

    if (usersdata.length > 0) {
      usersdata.map((user) => {
        csvStream.write({
          FirstName: user.fname || "-",
          LastName: user.lname || "-",
          Email: user.email || "-",
          Phone: user.mobile || "-",
          Gender: user.gender || "-",
          Status: user.status || "-",
          Profile: user.profile || "-",
          Location: user.location || "-",
          DateCreated: user.datecreated || "-",
          DateUpdated: user.dateUpdated || "-",
        });
      });
    }

    csvStream.end();
    writablestream.end();
  } catch (error) {
    res.status(401).json(error);
  }
};

module.exports = {
  UserPost,
  UserGet,
  SingleUserGet,
  UserEdit,
  UserDelete,
  UserStatus,
  UserExport,
};
