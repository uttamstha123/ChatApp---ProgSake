const route = require("express").Router();
const fs = require("fs");
const { Auth } = require("two-step-auth");
const Joi = require("joi");
const UserDetails = require("../model/UserDetails");

var isSignUp = false;

// remove data
route.get("/", (req, res) => {
  res.render("signup", {
    page: "SignUp",
  });
});

route.get("/userDetails", (req, res) => {
  if (isSignUp) {
    res.render("userDetails", {
      page: "Create Profile",
    });
  } else {
    res.redirect("/signup");
  }
});
let isNewUser;
let mail;
let otp;
route.post("/", async (req, res) => {
  const { email, inputOTP } = req.body;

  // lets validate it using joi

  const schema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
    }),
  });
  try {
    if (inputOTP) {
      if (otp == inputOTP) {
        isSignUp = true;
        console.log("good");
        fs.writeFile(
          __dirname.substr(0, __dirname.indexOf("route")) +
            "/public/serverResponse.env",
          "true",
          (err) => {
            if (err) console.log(err);
            else {
              console.log("File written successfully\n");
            }
          }
        );
      } else {
        console.log("Not good");
        fs.writeFile(
          __dirname.substr(0, __dirname.indexOf("route")) +
            "/public/serverResponse.env",
          "false",
          (err) => {
            if (err) console.log(err);
            else {
              console.log("File written successfully\n");
            }
          }
        );
      }
    } else if (email) {
      const { error, value } = schema.validate({ email });
      if (!error) {
        const sendOTP = async (value) => {
          const res = await Auth(value, "ProgSake");
          console.log(res);
          otp = res.OTP;
        };

        // Check is email is already registered
        isNewUser = await UserDetails.findOne({ email: email });
        console.log(isNewUser);
        if (isNewUser == null) {
          sendOTP(value.email);
        } else {
          return res.render("signup", {
            alreadySignUp: true,
          });
        }
      } else {
        let errorMsg = "Invalid Email";
        return res.status(504).render("signup", {
          place: errorMsg,
          page: "SignUp",
        });
      }

      mail = email;
    }
  } catch (err) {
    console.log(err);
  }
  res.render("signup", {
    email: mail,
    inputOtp: inputOTP,
    page: "SignUp",
    alreadySignUp: false,
  });
});

                                        // * User Details post handling

const registerMail = (mail) => {
  const nodeMailer = require("nodemailer");

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "progsake@gmail.com",
      pass: "ChatApp@progsake",
    },
  });

  const composeMail = {
    from: "progsake@gmail.com",
    to: mail,
    subject: "Successfully Registered",
    text: "Thanks for registering in ProgSake.\n\nOur purpose is not to provide you best service but to check our following skills :\n\nNodeJs\nExpress\nMongoDB\nHTML template engines (handlebars)\nHTML\nCSS\nJavascript\n-------------------\nDependencies included :\nexpress\nexpress-handlebars\nmongoose\nnodemailer\nnodemon\ndotenv\nbody-parser\ntwo-step-auth\njoi\n\nSeriously, we do not care about your feedback.",
  };

  transporter.sendMail(composeMail, (err, info) => {
    if (err) console.log(err);
    else console.log("Sent");
  });
};

route.post("/userDetails", async (req, res) => {
  const { password, confirm } = req.body;
  const userDetails = new UserDetails({
    email: mail,
    fullName: req.body.name,
    password1: req.body.password,
    password2: req.body.confirm,
    gender: req.body.gender,
    bio: req.body.bio,
  });
  if(!userDetails.gender) {

    return res.render('userDetails', {
      invalidGen: true,
    
    })
  }
  if (password == confirm) {
    await userDetails.save((err, result) => {
      if (err) {
        console.log(err);
        return res.status(504).render("userDetails", {
          page: "Create Profile",
        });
      } else {
        registerMail(mail);
        res.status(200).redirect("../login");
      }
    });
  } else {
    res.render("userDetails", {
      fail: true,
      page: "Create Profile",
    });
  }
});

module.exports = route;
