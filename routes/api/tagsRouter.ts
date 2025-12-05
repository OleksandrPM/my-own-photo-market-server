import { Router } from "express";
import controller from "../../controllers/tagsControllers/index";

const tagsRouter = Router();

tagsRouter.get("/", controller.getAllTags);
tagsRouter.get("/:id", controller.getTagById);
tagsRouter.get("/name/:name", controller.getTagByName);
tagsRouter.post("/", controller.addTag);

export default tagsRouter;
