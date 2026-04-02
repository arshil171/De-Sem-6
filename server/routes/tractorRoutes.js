import express from "express"
import { deleteTractor, getMyTractor,  tractorAdd, updateTractor } from "../controllers/tractorController.js"
import { requireAuth, requireDriver } from "../middleware/authMiddleware.js"


const tractorRoute = express.Router()

// tractorRoute.get("/", async (req, res) => {
//       res.send("hello user")
// })

tractorRoute.post("/addTractor", requireAuth, requireDriver, tractorAdd)
tractorRoute.get("/getMyTractor", requireAuth, requireDriver, getMyTractor)
tractorRoute.put("/updateTractor/:id", requireAuth, requireDriver, updateTractor)
tractorRoute.delete("/deleteTractor/:id", requireAuth, requireDriver, deleteTractor)
tractorRoute.put("/toggle/:id", requireAuth, requireDriver, toggleAvailability)


export default tractorRoute