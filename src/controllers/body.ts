/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import {createResponse, createError} from '../utils/helpers';

import User, {UserImpl} from '../models/user';
import Body, {BodyImpl} from '../models/body';
// import {nextTick} from 'process';

const toBodyJSON = (body: BodyImpl, user: UserImpl) => {
  const isSub = user.subscribedBodies.some(bodyId => {
    return bodyId.toString() === body.id.toString();
  });
  return {
    body,
    isSub: isSub,
  };
};

export const addBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newBody = new Body(req.body);
    await newBody.save();
    res.send(createResponse('Body Created Successfully', newBody));
  } catch (error) {
    next(error);
  }
};

// const newBody = new Body(req.body);
// newBody
//   .save()
//   .then(body => {
//     const respData = {
//       body: {
//         name: body.name,
//       },
//     };
//     return res.send(createResponse('Body Created Successfully', respData));
//   })
//   .catch(err => {
//     next(err);
//   });

export const getAllBodies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const filterVal = (req.query.q):
    const user = await User.findById(req.payload.id);
    if (!user) {
      throw createError(404, 'Authentication failed', 'Invalid Credentials');
    }
    let bodies;
    if (req.query.q) {
      bodies = await Body.find({typeOfBody: req.query.q});
    } else {
      bodies = await Body.find({});
    }
    const respData = await bodies.map(body => toBodyJSON(body, user));
    res.send(createResponse('Success', respData));
  } catch (error) {
    next(error);
  }
};
// return Promise.all([User.findById(req.payload.id), Body.find()])
//   .then(([user, bodies]) => {
//     if (user === null || bodies === null) {
//       return null;
//     }
//     return res.status(200).json({
//       bodies: bodies.map(body => toBodyJSON(body, user)),
//     });
//   })
//   .catch(err => next(err));

export const getBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [user, body] = await Promise.all([
      User.findById(req.payload.id),
      Body.findById(req.params.id),
    ]);

    if (user === null || body === null) {
      throw createError(
        404,
        'Invalid User id or club id',
        'Invalid credentials'
      );
    }
    res.send(createResponse('Success', body));
  } catch (err) {
    next(err);
  }
};

export const toggleSubscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload.id);
    if (user === null) {
      //! JWT WAS INVALID
      return res.send('Invalid Request');
    }
    const index = user.subscribedBodies.indexOf(Types.ObjectId(req.params.id));
    if (index === -1) {
      user.subscribedBodies.push(Types.ObjectId(req.params.id));
    } else {
      user.subscribedBodies.splice(index, 1);
    }
    await user.save();
    return res.status(200).json({
      message: 'Successfully Toggled Subscribe',
    });
  } catch (error) {
    return next(error);
  }
};
