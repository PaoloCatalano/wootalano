import express from "express";
import {
  showStats,
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  showStatsAlt,
} from "../controllers/jobController.js";
const router = express.Router();

router.route("/").post(createJob).get(getAllJobs);
router.route("/stats").get(showStats);
router.route("/statsAlt").get(showStatsAlt);
//:id MUST BE THE LAST!!!!!!!!
router.route("/:id").delete(deleteJob).patch(updateJob);

export default router;
