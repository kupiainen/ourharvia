import Joi from "joi";

export const activateChallengeParamsSchema = Joi.object({
  challengeId: Joi.string().uuid().required(),
});

export const activateChallengeBodySchema = Joi.object({}); 
// empty for now but extendable later
