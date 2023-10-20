const User = require("../Model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const JWT_SECRET = "ajehbaikeoe{'.'/.'326659564DFEAJHJBC1C48C";

//Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "v.varunvenkat06081998@gmail.com",
    pass: "yonpdfpheczokktp",
  },
});

exports.home = (req, res) => {
  res.send("Server is ready");
};

//User Creation :-
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  try {
    if (!name) {
      return res.json({ message: "Please enter Name" });
    }
    if (!email) {
      return res.json({ message: "Please enter Mail-Id" });
    }

    if (!password) {
      return res.json({ message: "Please enter Password" });
    }
    if (existingUser) {
      res
        .status(200)
        .json({ status: false, message: "User Already Exists Please Login" });
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const token = jwt.sign({ email }, JWT_SECRET);
      User.create({
        name: name,
        email: email,
        password: encryptedPassword,
      });
      res.status(200).json({
        status: true,
        message: "User Created Successfully",
        data: token,
      });
    }
  } catch (error) {
    res.json({ message: "Something Went Wrong" });
  }
};

//Login User:-
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  try {
    if (existingUser) {
      if (bcrypt.compare(password, existingUser.password)) {
        const token = jwt.sign({ email }, JWT_SECRET);
        res.status(200).json({
          status: true,
          message: "Logged In Successfully",
          data: token,
        });
      } else {
        res
          .status(200)
          .json({ status: false, message: "Please check Password" });
      }
    } else {
      res.status(200).json({ status: false, message: "Please Register" });
    }
  } catch (error) {
    res.json({ message: "Something Went Wrong" });
  }
};

//forget-Password :-
exports.forgetpassword = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  try {
    if (existingUser) {
      const link = `http://localhost:3000/resetpassword`;
      const mailOption = {
        from: "v.varunvenkat06081998@gmail.com",
        to: existingUser.email,
        subject: `Welcome From Varun Bookings Team - ${existingUser.name} `,
        html: `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Document</title>
              </head>
              <body>
                  <div>
                  <h3>Hi ${existingUser.name},</h3> 
                    <h3>You can Reset Your Password using Below Button</h3>
                  <h1>Please Click the Button to verify your Account </h1>
                  <a href=${link}><button>Verify Your Account</button></a>
                  <h3>Happy Bookings - Varun Bookings Team</h3>    
                  </div>
              </body>
              </html>`,
      };

      const token = jwt.sign(email, JWT_SECRET);
      transporter.sendMail(mailOption, (err) => {
        if (err) {
          res.status(200).json({ status: false, message: "Something Error" });
        } else {
          res
            .status(200)
            .json({ status: true, message: "Please Check Mail", data: token });
        }
      });
    } else {
      res.status(200).json({ status: false, message: "Please Register" });
    }
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { password, token } = req.body;
  const email = jwt.verify(token, JWT_SECRET);
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      { email: email },
      { $set: { password: encryptedPassword } }
    );
    res
      .status(200)
      .json({ status: true, message: "Password Updated Successfully" });
  } catch (error) {
    res.status(200).json({ status: false, message: "Something Went wrong" });
  }
};

