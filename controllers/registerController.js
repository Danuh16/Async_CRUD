const userSchema = require("../model/userSchema");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and Password are required" });

  //check for duplicate
  const duplicate = await userSchema.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409); //conflict
  try {
    //encrypt pwd
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //Create and store the new user
    const result = await userSchema.create({
      username: user,
      password: hashedPwd,
    });
    
    console.log(result);
    
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
