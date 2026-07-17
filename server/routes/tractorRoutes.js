import express from "express"
import { deleteTractor, getMyTractor, getTractorById, getTractors,  toggleAvailability,  tractorAdd, updateTractor } from "../controllers/tractorController.js"
import { requireAuth, requireDriver } from "../middleware/authMiddleware.js"


const tractorRoute = express.Router()

// tractorRoute.get("/", async (req, res) => {
//       res.send("hello user")
// })
// farmer can see all available tractors
tractorRoute.get("/all", requireAuth, getTractors)
tractorRoute.post("/addTractor", requireAuth, requireDriver, tractorAdd)
tractorRoute.get("/getMyTractor", requireAuth, requireDriver, getMyTractor)
tractorRoute.put("/updateTractor/:id", requireAuth, requireDriver, updateTractor)
tractorRoute.delete("/deleteTractor/:id", requireAuth, requireDriver, deleteTractor)
tractorRoute.put("/toggle/:id", requireAuth, requireDriver, toggleAvailability)
// single tractor by id (farmer booking page)
tractorRoute.get("/:id", requireAuth, getTractorById)


export default tractorRoute