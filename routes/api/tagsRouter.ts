import { Router } from "express";
import controller from "../../controllers/tagsControllers/index";

const tagsRouter = Router();

tagsRouter.get("/", controller.getAllTags);
tagsRouter.post("/", controller.addTag);
tagsRouter.get("/:id", controller.getTagById);
tagsRouter.put("/:id", controller.updateTag);
tagsRouter.delete("/:id", controller.deleteTagById);

tagsRouter.get("/search/", controller.getTagsByName);

export default tagsRouter;
