import Joi from "joi";

export const getUserBadgesSchema = Joi.object({
  userId: Joi.string()
    .uuid({ version: "uuidv4" })
    .required(),
});
