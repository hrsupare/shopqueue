const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const secretkey = "Products Management";



//*..................................................userCreation.............................................................//



//*...................................................loginApi.............................................................//

const logInUser = async function (req, res) {
  try {
    const { email, password } = req.body;
    

    //* Email and Password Validation
    if (!email)
      return res
        .status(400)
        .send({ status: false, msg: "user Name is required" });
    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });

    //* finding Email in userModel DB
    const check = await userModel.findOne({ email: email });
    if (!check)
      return res.status(400).send({ status: false, msg: "incorrect email" });

      //* converting simple password into bycrypt passwprd
    const passwordcheck = bcrypt.compareSync(password, check.password); // true
    if (!passwordcheck)
      return res
        .status(401)
        .send({ status: false, msg: "password is incorrect" });
    //* creating JWT token
    let token = JWT.sign(
      {
        userId: check._id.toString(),
      },
      secretkey,
      { expiresIn: "365d" },
      { iat: Date.now }
    );
    return res.status(200).send({
      status: true,
      message: "User login successfull",
      data: { userId: check._id, token: token },
    });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

//*...................................................getapi.............................................................//

const getapi = async function (req, res) {
  try {
    const userId = req.params.userId;
  
    //* finding user in DB by using userId
    const userData = await userModel.findById({ _id: userId });
    if (userData) {
      return res
        .status(200)
        .send({ status: true, message: "User profile details", data: userData });
    }
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};


//*...................................................updatenApi.............................................................//



module.exports = { userCreate, getapi, logInUser, updateUser };
