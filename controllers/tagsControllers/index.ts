import getAllTags from "./getAllTags";
import getTagById from "./getTagById";
import getTagByName from "./getTagByName";
import addTag from "./addTag";

import controllerWrapper from "../../decorators/controllerWrapper";

export default {
  getAllTags: controllerWrapper(getAllTags),
  getTagById: controllerWrapper(getTagById),
  getTagByName: controllerWrapper(getTagByName),
  addTag: controllerWrapper(addTag),
};
