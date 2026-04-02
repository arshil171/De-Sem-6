import { tractorModel } from "../models/tractorModel.js"


// for driver
export const tractorAdd = async (req, res) => {
    try {
        const { tractorName, pricePerHour, location, tractorType } = req.body

        if (!tractorName || !pricePerHour || !location || !tractorType) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const tractor = await tractorModel.create({
            driverId: req.user._id,
            tractorName,
            tractorType,
            pricePerHour,
            location

        })

        res.status(200).json({
            message: "Tractor Added successfully",
            data: tractor
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }


}

// for driver
export const getMyTractor = async (req, res) => {
    try {
        const tractor = await tractorModel.find({ driverId: req.user._id }).populate("driverId", "name email")

        res.status(200).json({
            success: true,
            count: tractor.length,
            data: tractor
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }

}

// for driver
export const updateTractor = async (req, res) => {
    try {
        const { id } = req.params;

        const tractor = await tractorModel.findById(id)

        if (!tractor) {
            return res.status(404).json({
                success: false,
                message: "Tractor Not Found"
            })
        }

        if (tractor.driverId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "unauthorized"
            })
        }

        const updateTractor = await tractorModel.findByIdAndUpdate(id, req.body, { new: true })

        res.status(200).json({
            success: true,
            message: "Tractor Updated SuccessFully",
            data: updateTractor
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

// for driver
export const deleteTractor = async (req, res) => {
    try {
        const { id } = req.params;

        const tractor = await tractorModel.findById(id)

        if (!tractor) {
            return res.status(404).json({
                success: false,
                message: "Tractor Not Found"
            })
        }

        if (tractor.driverId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "unauthorized"
            })
        }

        const deleteTractor = await tractorModel.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: "Tractor Updated SuccessFully",
            data: deleteTractor
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


//for user
export const getTractors = async (req, res) => {
    try {
        const tractor = await tractorModel.find({ availability: true }).populate("driverId", "name email")

        res.status(200).json({
            success: true,
            count: tractor.length,
            data: tractor
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message

        })
    }
}

export const toggleAvailability = async (req, res) => {
    try {
        const { id } = req.params

        const tractor = await tractorModel.findById(id)

        if (!tractor) {
            return res.status(404).json({
                success: false,
                message: "Tractor not found"
            });
        }

        tractor.availability = !tractor.availability;

        await tractor.save()

        res.status(200).json({
            success: true,
            message: "Availability updated",
            data: tractor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
}

// 👉 Minimum: 6 functions

// Function	Purpose
// tractorAdd	Add tractor done

// getMyTractors	Driver dashboard  done
// toggleAvailability	Online/offline
// updateTractor	Edit    done
// deleteTractor	Remove    done