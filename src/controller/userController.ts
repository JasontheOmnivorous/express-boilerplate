import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../middleware/catchAsync";
import { User } from "../model/userModel";
import { ExtendedRequest } from "../types/app";
import AppError from "../utils/appError";
import { filterBody, respondToken } from "../utils/helpers";
import { sendEmail } from "../utils/sendEmail";

export const updateMe = catchAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.confirmPassword)
      return next(
        new AppError(
          "This route is not for password related operations. Please use /update-my-password endpoint.",
          400
        )
      );

    const validBody = filterBody(req.body, "name", "email");
    const updatedUser = await User.findByIdAndUpdate(req.user?.id, validBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  }
);

export const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = filterBody(req.body, "email");

    if (!email) return next(new AppError("Email is required.", 400));

    const dbUser = await User.findOne({ email });

    if (!dbUser)
      return next(new AppError("No user found with that email.", 404));

    const resetToken = dbUser.generatePasswordResetToken();

    await dbUser.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.originalUrl}/api/v1/user/reset-password/${resetToken}`;

    const constructedMessage = `Forgot your password? Send a PATCH request with your new password and confirmPassword to ${resetUrl}.\nIf you did not forget your password, simply ignore this message.`;

    try {
      await sendEmail({
        email,
        subject: "Your password reset token (valid for 10 mins)",
        textMessage: constructedMessage,
      });

      res.status(200).json({
        status: "success",
        message: "Reset token sent to email!",
      });
    } catch (err) {
      dbUser.passwordResetToken = undefined;
      dbUser.passwordResetTokenExpiration = undefined;
      await dbUser.save({ validateBeforeSave: false });
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, confirmPassword } = filterBody(
      req.body,
      "password",
      "confirmPassword"
    );

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const dbUser = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpiration: { $gt: Date.now() },
    });

    if (!dbUser)
      return next(new AppError("Token is invalid or has expired.", 400));

    dbUser.password = password;
    dbUser.confirmPassword = confirmPassword;
    dbUser.passwordResetToken = undefined;
    dbUser.passwordResetTokenExpiration = undefined;

    await dbUser.save({ validateBeforeSave: true });

    respondToken(res, 200, dbUser, next);
  }
);
