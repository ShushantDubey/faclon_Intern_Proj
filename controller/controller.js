const mongoose = require("mongoose");
const Users = require("../model/createUser.model");
const friendReq = require("../model/friendReq.model");

const createUser = async (req, res) => {
  try {
    const emailExist = await Users.findOne({ email: req.body.email });
    if (emailExist) {
      return res
        .status(404)
        .send("This email already exist. Please try with different email");
    }

    const userInfo = new Users({
      name: req.body.name,
      email: req.body.email,
    });

    await userInfo.save();
    return res.status(200).send(userInfo);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userRef = await Users.findOne({ _id: id });
    if (!userRef) {
      return res.status(404).send(`No user found with this id ${id}`);
    }
    if (req.body.name) {
      userRef.name = req.body.name;
    }
    if (req.body.email) {
      userRef.email = req.body.email;
    }
    await userRef.save();
    return res.status(200).send(userRef);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userRef = await Users.findOne({ _id: id });
    if (!userRef) {
      return res.status(404).send(`No user found with this id ${id}`);
    }
    return res.status(200).send(userRef);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userRef = await Users.findOne({ _id: id });
    if (!userRef) {
      return res.status(404).send(`No user found with this id ${id}`);
    }
    await userRef.deleteOne();
    return res.status(200).send("collection is dropped");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

//here sender id goes in params && reciver id goes in body

const sendReq = async (req, res) => {
  try {
    const recieverId = req.body.rId;
    const senderId = req.params.sId;
    const recieverDB = await Users.findOne({ _id: recieverId });
    const senderDB = await Users.findOne({ _id: senderId });
    if (!recieverDB) {
      return res.status(404).send(`User doesnt exist with ${recieverId}`);
    }
    if (!senderDB) {
      return res.status(404).send(`User doesnt exist with ${senderId}`);
    }
    const friendRequest = new friendReq({
      sender: senderId,
      reciever: recieverId,
    });
    await friendRequest.save();
    return res.status(201).send(friendRequest);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const statusReq = async (req, res) => {
  try {
    const { id } = req.params; //objectID of friendReq.model
    const { docId } = req.body; //sender val in friendReq.model
    const { status } = req.body;

    const currentStatus = await friendReq.findOne({ _id: id, sender: docId });

    if (status === "accepted") {

    const userExit = await Users.findOne({ friendlist: id });

    if(userExit) {
      return res.status(201).send("Sender is already a friend");
    }
      
      const reqBy = await Users.findOne({ _id: currentStatus.sender });
      const reqFor = await Users.findOne({ _id: currentStatus.reciever });

      console.log(reqBy, reqFor);
      const senderId = reqBy._id.toString();
      const recieverId = reqFor._id.toString();

      // check if the user exit
      // transaction
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      await reqBy.updateOne({ $push: { friendlist: recieverId } }).session(session);

      await reqFor.update({ $push: { friendlist: senderId } }).session(session);

      await currentStatus.deleteOne().session(session);

    } catch (error) {
      console.log(error);
    } finally {
      session.endSession();
    }
      return res.status(201).send("Request is Accepted");
    }

    if (status === "rejected") {
      await currentStatus.deleteOne();

      return res.status(201).send("Request is Rejected");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

const getFriendList = async (req, res) => {
  try {
    const { id } = req.params;
    const userRef = await Users.findOne({ _id: id }).populate("friendlist", [
      "name",
      "email",
    ]);

    return res.status(201).send(userRef);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const userDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findOne({ _id: id });

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      await user.deleteOne().session(session);
      await Users.updateMany(
        { friendlist: id },
        {
          $pull: {
            friendlist: id,
          },
        }
      ).session(session);
    } catch (error) {
      console.log(error);
    } finally {
      session.endSession();
    }

    return res.status(201).send("User is Deleted Succesfully");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports = {
  createUser,
  updateUser,
  getUser,
  deleteUser,
  sendReq,
  statusReq,
  getFriendList,
  userDelete,
};
