import prisma from "../DB/db.config.js";
import { generateRandomNum, imageValidator } from "../utils/helper.js";
import { newsSchema } from "../validations/newsValidation.js";
import vine, { errors } from "@vinejs/vine";

class NewsController {
  static async index(req, res) {
    const news = await prisma.news.findMany({});
    return res.json({ status: 200, news });
  }

  static async store(req, res) {
    try {
      const user = req.user;
      const body = req.body;
      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          errors: {
            image: "Image field is required",
          },
        });
      }
      const image = req.files?.image;
      // Image custom validator
      const message = imageValidator(image?.size, image?.mimetype);
      if (message !== null) {
        return res.status(400).json({
          errors: {
            image: message,
          },
        });
      }

      //Image upload
      const imgExt = image?.name.split(".");
      const imageName = generateRandomNum() + "." + imgExt[1];
      const uploadPath = process.cwd() + "/public/images/news/" + imageName;

      image.mv(uploadPath, (err) => {
        if (err) throw err;
      });

      payload.image = imageName;
      payload.user_id = user.id;

      const news = await prisma.news.create({
        data: payload,
      });

      return res.json({
        status: 200,
        message: "News created successfully!",
        news,
      });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        // array created by SimpleErrorReporter
        // console.log(error.messages)
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: " Something went wrong. Please try again later.",
        });
      }
    }
  }

  static async show(req, res) {}

  static async update(req, res) {}

  static async destroy(req, res) {}
}

export default NewsController;
