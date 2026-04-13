import { Router } from "express";
import { Topic } from "../models/Topic.js";
import { fail, ok } from "../utils/response.js";
import mongoose from "mongoose";
const router = Router();
router.get("/", async (req, res) => {
  const topics = await Topic.find(
    {},
    "_id category topicText petMessage suggestedDurationSec",
  ).lean();
  return ok(res, topics || []);
});

router.get("/next", async (req, res) => {
  const { moodTag } = req.query;

  const query = { isActive: true };
  if (moodTag) {
    query.moodTag = moodTag;
  }

  let topics = await Topic.find(query)
    .select("_id category topicText petMessage suggestedDurationSec")
    .lean();

  if (!topics.length && moodTag) {
    topics = await Topic.find({ isActive: true })
      .select("_id category topicText petMessage suggestedDurationSec")
      .lean();
  }

  if (!topics.length) {
    return fail(res, "No available topic found", 404);
  }

  const topic = topics[Math.floor(Math.random() * topics.length)];

  return ok(res, {
    topicId: topic._id,
    category: topic.category,
    topicText: topic.topicText,
    petMessage: topic.petMessage,
    suggestedDurationSec: 30,
  });
});
router.get("/:_id", async (req, res) => {
  const { _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return fail(res, "Invalid ID format", 400);
  }
  const topic = await Topic.findById(_id).lean();
  if (!topic) {
    return fail(res, "Topic not found", 404);
  }
  return ok(res, topic);
});
export default router;
