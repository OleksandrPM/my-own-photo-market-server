import getAllTags from "./getAllTags";
import getTagById from "./getTagById";
import getTagsByName from "./getTagsByName";
import addTag from "./addTag";
import deleteTagById from "./deleteTagById";
import updateTag from "./updateTag";

import controllerWrapper from "../../decorators/controllerWrapper";

export default {
  getAllTags: controllerWrapper(getAllTags),
  getTagById: controllerWrapper(getTagById),
  getTagsByName: controllerWrapper(getTagsByName),
  addTag: controllerWrapper(addTag),
  deleteTagById: controllerWrapper(deleteTagById),
  updateTag: controllerWrapper(updateTag),
};
