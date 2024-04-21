import { errors } from "@vinejs/vine";
import { generateRandomNum, imageValidator } from "../utils/helper.js";
import prisma from "../DB/db.config.js";

class ProfileController {
  static async index(req, res) {
    try {
      const user = req.user;
      return res.json({ status: 200, user });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong!",
      });
    }
  }
  static async store() {}
  static async show() {}
  static async update(req, res) {
    try {
      const { id } = req.params;

      if (!req.files || Object.keys(req.files).length === 0) {
        return res
          .status(400)
          .json({ status: 400, message: "Profile image is required" });
      }

      const profile = req.files.profile;
      const message = imageValidator(profile?.size, profile.mimetype);
      if (message !== null) {
        return res.status(400).json({
          errors: {
            profile: message,
          },
        });
      }

      const imgExt = profile?.name.split(".");
      const imageName = generateRandomNum() + "." + imgExt[1];
      const uploadPath = process.cwd() + "/public/images/" + imageName;

      // Move the file asynchronously
      profile.mv(uploadPath, async (err) => {
        if (err) {
          console.error("Error uploading profile image:", err);
          return res
            .status(500)
            .json({ message: "Error uploading profile image" });
        }

        // Update the user profile
        try {
          await prisma.users.update({
            data: {
              profile: imageName,
            },
            where: {
              id: Number(id),
            },
          });

          // Send response after all operations are completed
          return res.json({
            status: 200,
            message: "Profile updated successfully!",
          });
        } catch (error) {
          console.error("Error updating user profile:", error);
          return res
            .status(500)
            .json({ message: "Error updating user profile" });
        }
      });
    } catch (err) {
      console.error("The error is:", err);
      return res
        .status(500)
        .json({ message: "Something went wrong, please try again later!" });
    }
  }
  static async destroy() {}
}

export default ProfileController;
