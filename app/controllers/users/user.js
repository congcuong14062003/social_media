export const userSignup = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password_hash) {
      res
        .status(401)
        .json({ success: false, message: "Please fill all infomation" });
    } else {
      await Users.signUpAction({
        name: req.body.name,
        phone_number: req.body.phone_number,
        address: req.body.address,
        password: req.body.password,
        avatar_thumbnail:
          "https://cdn-icons-png.flaticon.com/512/186/186313.png",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};
