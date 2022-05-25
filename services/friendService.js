const { Friend, User } = require("../models");
const { FRIEND_ACCEPTED, FRIEND_PENDING } = require("../config/constants");
const { Op } = require("sequelize");

exports.findFriendId = async (id) => {
  const friends = await Friend.findAll({
    where: {
      [Op.or]: [{ requestToId: id }, { requestToId: id }],
      status: FRIEND_ACCEPTED,
    },
  });

  const friendIds = friends.map((el) =>
    el.requestToId === id ? el.requestFromId : el.requestToId
  );
  return friendIds;
};

exports.findAcceptedFriend = async (id) => {
  // WHERE (requestToId = 1 Or requestFromId = 1) AND status = 'ACCEPTED
  const friends = await Friend.findAll({
    where: {
      [Op.or]: [{ requestToId: id }, { requestFromId: id }],
      status: FRIEND_ACCEPTED,
    },
  });

  const friendIds = friends.map((el) =>
    el.requestToId === id ? el.requestFromId : el.requestToId
  );
  // sequelize จะรู้โดยอัตนโนมัติหากเป็น array และจเใช้คำสั่ง WHERE id in (2, 4, 5)
  const users = await User.findAll({
    where: { id: friendIds },
    attributes: { exclude: ["password"] },
  });

  return users;
};

exports.findPendingFriend = async (id) => {
  const friends = await Friend.findAll({
    where: {
      requestToId: id,
      status: FRIEND_PENDING,
    },
    include: {
      model: User,
      as: "RequestFrom",
      attributes: {
        exclude: ["password"],
      },
    },
  });
  //   ต้องการเฉพาะข้อมูลใน User (RequestFrom)
  return friends.map((el) => el.RequestFrom);
};

exports.findRequestFriend = async (id) => {
  const friends = await Friend.findAll({
    where: {
      requestFromId: id,
      status: FRIEND_PENDING,
    },
    include: {
      model: User,
      as: "RequestTo",
      attributes: {
        exclude: ["password"],
      },
    },
  });
  //   ต้องการเฉพาะข้อมูลใน User (RequestFrom)
  return friends.map((el) => el.RequestTo);
};

exports.findUnknown = async (id) => {
  const friends = await Friend.findAll({
    where: {
      [Op.or]: [{ requestToId: id }, { requestFromId: id }],
    },
  });

  const friendIds = friends.map((el) =>
    el.requestToId === id ? el.requestFromId : el.requestToId
  );

  //   ต้องไม่เอาตัวเอง
  friendIds.push(id);

  const users = await User.findAll({
    where: {
      id: { [Op.notIn]: friendIds },
    },
    attributes: { exclude: ["password"] },
  });

  return users;
};
