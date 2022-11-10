import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequest, Unauthenticated } from "../errors/index.js";

export const register = async (req, res) => {
  //quando si registra un utente, req.body ha { name: '---', password: 'secret', email: '---@mail.com' }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequest("You've just forgotten some value :/");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequest("We wanna register always new emails!");
  }
  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      location: user.location,
    },
    token,
    location: user.location,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("some value is missing!");
  }
  const user = await User.findOne({ email }).select("+password"); //perché nel UserModel, password é select: false

  if (!user) {
    throw new Unauthenticated("Dude, did you forget your password??");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new Unauthenticated("Dude, did you forget your password??");
  }
  //Dude, did you forget your password?? -> i due messaggi devono essere UGUALI altrimenti malicious hackers possono capire che quella email non é stata ancora registrata nel DB!!!!

  const token = user.createJWT();
  user.password = undefined; //per nasconderla di nuovo dal response
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

export const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequest("Please give me all values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  //optional
  const newToken = user.createJWT();

  res
    .status(StatusCodes.OK)
    .json({ user, token: newToken, location: user.location });
};
