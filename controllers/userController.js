const FriendService = require("../services/friendService");
exports.getMe = async (req, res) => {
  // req.user ไม่ใช่ plain object ธรรมดา ต้องทำการ JSON.parse()
  //   const {
  //     id,
  //     firstName,
  //     lastName,
  //     email,
  //     phoneNumber,
  //     profilePic,
  //     coverPhoto,
  //     createdAt,
  //     updatedAt,
  //   } = req.user;
  const user = JSON.parse(JSON.stringify(req.user, null, 2));
  const friends = await FriendService.findAcceptedFriend(req.user.id);

  user.friends = friends;
  //   res.json({
  //     user: {
  //       id,
  //       firstName,
  //       lastName,
  //       email,
  //       phoneNumber,
  //       profilePic,
  //       coverPhoto,
  //       createdAt,
  //       updatedAt,
  //     },
  //   });
  res.json({ user });
};
