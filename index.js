const express = require("express");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();
app.use(express.json());
const port = 5000;
const usersData = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "password123",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    password: "password456",
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@example.com",
    password: "password789",
  },
  {
    firstName: "Bob",
    lastName: "Brown",
    email: "bob.brown@example.com",
    password: "password101",
  },
  {
    firstName: "Charlie",
    lastName: "Davis",
    email: "charlie.davis@example.com",
    password: "password202",
  },
];

const usersProfileData = [
  { dob: "1990-01-01", mobileNo: "1234567890" },
  { dob: "1985-05-15", mobileNo: "2345678901" },
  { dob: "1992-07-21", mobileNo: "3456789012" },
  { dob: "1988-11-30", mobileNo: "4567890123" },
  { dob: "1995-03-14", mobileNo: "5678901234" },
];

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
  },
  { timestamps: true }
);

const userModal = mongoose.model("userModal", userSchema);

const userProfileSchema = mongoose.Schema(
  {
    user_id: mongoose.Types.ObjectId,
    dob: String,
    mobileNumber: Number,
  },
  { timestamps: true }
);

const userProfileModal = mongoose.model("userProfileModal", userProfileSchema);

mongoose
  .connect("mongodb://127.0.0.1:27017/Mydb")
  .then(() => console.log("mongodb connect success"))
  .catch((err) => console.log("connection erroe", err));

const insultData = async () => {
  try {
    let userDataresult = usersData.map((user) => ({
      ...user,
      password: md5(user.password),
    }));
    let ResultData = await userModal.insertMany(userDataresult);
    //console.log(ResultData);

    let userProfileResult = usersProfileData.map((user, index) => ({
      user_id: user._id,
      dob: usersProfileData[index].dob,
      mobileNumber: usersProfileData[index].mobileNumber,
    }));
    let userProfileData = await userProfileModal.insertMany(userProfileResult);
    //console.log(userProfileData);
  } catch (err) {
    console.log("connection error", err);
  }
};
insultData().catch(console.error);

app.get("/deleteUsers", async (req, res) => {
  try {
    let allData = await userProfileModal.find({}, "dob user_id");
    // console.log(allData);
    let ageResult = allData.filter((userProfile) => {
      const dob = new Date(userProfile.dob);
      const age = new Date().getFullYear() - dob.getFullYear();
      console.log(age);
      return age > 25;
    });
    console.log(ageResult.dob);
    const deleteUserId = ageResult.map((deletingId) => deletingId.user_id);
    //console.log(deleteUserId,"delete status");
    res.json({ dataToDelete: ageResult });
    await userProfileModal.deleteMany({ user_id: { $in: deleteUserId } });
    res.send("users is delete sucessecfull");
  } catch (error) {
    console.log("connection error", error);
    res.status(500).json({ error: "could not delete user" });
  }
});

app.listen(port, () => {
  console.log(`server is start at port${port}`);
});
