import { userModel } from "../models/userModel.js";
import bookingModel from "../models/bookingModel.js";
import tractorModel from "../models/tractorModel.js";
import { productModel } from "../models/productModel.js";
import { cartModel } from "../models/cartModel.js";

export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalFarmers,
            totalDrivers,

            totalBookings,
            pendingBookings,
            acceptedBookings,
            completedBookings,
            cancelledBookings,

            totalTractors,
            availableTractors,
            unavailableTractors,

            totalProducts,
            outOfStockProducts
        ] = await Promise.all([
            userModel.countDocuments(),
            userModel.countDocuments({ role: "farmer" }),
            userModel.countDocuments({ role: "driver" }),

            bookingModel.countDocuments(),
            bookingModel.countDocuments({ status: "pending" }),
            bookingModel.countDocuments({ status: "accepted" }),
            bookingModel.countDocuments({ status: "completed" }),
            bookingModel.countDocuments({ status: "cancelled" }),

            tractorModel.countDocuments(),
            tractorModel.countDocuments({ availability: true }),
            tractorModel.countDocuments({ availability: false }),

            productModel.countDocuments(),
            productModel.countDocuments({ stock: 0 })
        ]);

        return res.status(200).json({
            success: true,
            message: "Dashboard statistics fetched successfully",
            data: {
                users: {
                    total: totalUsers,
                    farmers: totalFarmers,
                    drivers: totalDrivers
                },
                bookings: {
                    total: totalBookings,
                    pending: pendingBookings,
                    accepted: acceptedBookings,
                    completed: completedBookings,
                    cancelled: cancelledBookings
                },
                tractors: {
                    total: totalTractors,
                    available: availableTractors,
                    unavailable: unavailableTractors
                },
                products: {
                    total: totalProducts,
                    outOfStock: outOfStockProducts
                }
            }
        });

    } catch (error) {
        console.log("Admin Dashboard Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const {
            search = "",
            role = "",
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        // Search by name, email, or phone
        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    phone: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        // Filter by role
        if (role) {
            if (!["farmer", "driver", "admin"].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid role filter"
                });
            }

            query.role = role;
        }

        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.min(
            Math.max(Number(limit) || 10, 1),
            100
        );

        const skip = (pageNumber - 1) * limitNumber;

        const [users, totalUsers] = await Promise.all([
            userModel
                .find(query)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),

            userModel.countDocuments(query)
        ]);

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: {
                users
            },
            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalUsers,
                totalPages: Math.ceil(
                    totalUsers / limitNumber
                )
            }
        });

    } catch (error) {
        console.log("Get All Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};


export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel
            .findById(id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: {
                user
            }
        });

    } catch (error) {
        console.log("Get User By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user"
        });
    }
};



export const getAllBookings = async (req, res) => {
    try {
        const {
            status = "",
            serviceType = "",
            search = "",
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        // Filter by booking status
        if (status) {
            const allowedStatuses = [
                "pending",
                "accepted",
                "completed",
                "cancelled"
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid booking status"
                });
            }

            query.status = status;
        }

        // Filter by service type
        if (serviceType) {
            const allowedServiceTypes = [
                "Ploughing",
                "Harvesting",
                "Seeding",
                "Spraying"
            ];

            if (!allowedServiceTypes.includes(serviceType)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid service type"
                });
            }

            query.serviceType = serviceType;
        }

        // Search booking fields
        if (search) {
            query.$or = [
                {
                    farmLocation: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    serviceType: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        const pageNumber = Math.max(
            Number(page) || 1,
            1
        );

        const limitNumber = Math.min(
            Math.max(Number(limit) || 10, 1),
            100
        );

        const skip =
            (pageNumber - 1) * limitNumber;

        const [bookings, totalBookings] =
            await Promise.all([
                bookingModel
                    .find(query)

                    // Farmer details
                    .populate(
                        "farmerId",
                        "name email phone role"
                    )

                    // Driver details
                    .populate(
                        "driverId",
                        "name email phone role"
                    )

                    // Tractor details
                    .populate(
                        "tractorId",
                        "tractorName tractorType pricePerHour location availability"
                    )

                    .sort({
                        createdAt: -1
                    })

                    .skip(skip)

                    .limit(limitNumber),

                bookingModel.countDocuments(query)
            ]);

        return res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            data: {
                bookings
            },
            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalBookings,
                totalPages: Math.ceil(
                    totalBookings / limitNumber
                )
            }
        });

    } catch (error) {
        console.log(
            "Get All Bookings Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch bookings"
        });
    }
};



export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await bookingModel
            .findById(id)

            .populate(
                "farmerId",
                "name email phone role createdAt"
            )

            .populate(
                "driverId",
                "name email phone role createdAt"
            )

            .populate(
                "tractorId",
                "tractorName tractorType pricePerHour maxHoursPerBooking location availability createdAt"
            );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking fetched successfully",
            data: {
                booking
            }
        });

    } catch (error) {
        console.log(
            "Get Booking By ID Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch booking"
        });
    }
};




export const getAllTractors = async (req, res) => {
    try {
        const {
            search = "",
            tractorType = "",
            availability = "",
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        // Search by tractor name or location
        if (search) {
            query.$or = [
                {
                    tractorName: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    location: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        // Filter by tractor type
        if (tractorType) {
            const allowedTractorTypes = [
                "Ploughing",
                "Harvesting",
                "Seeding",
                "Spraying"
            ];

            if (!allowedTractorTypes.includes(tractorType)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid tractor type"
                });
            }

            query.tractorType = tractorType;
        }

        // Filter by availability
        if (availability !== "") {
            if (
                availability !== "true" &&
                availability !== "false"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Availability must be true or false"
                });
            }

            query.availability =
                availability === "true";
        }

        const pageNumber = Math.max(
            Number(page) || 1,
            1
        );

        const limitNumber = Math.min(
            Math.max(Number(limit) || 10, 1),
            100
        );

        const skip =
            (pageNumber - 1) * limitNumber;

        const [tractors, totalTractors] =
            await Promise.all([
                tractorModel
                    .find(query)
                    .populate(
                        "driverId",
                        "name email phone role"
                    )
                    .sort({
                        createdAt: -1
                    })
                    .skip(skip)
                    .limit(limitNumber),

                tractorModel.countDocuments(query)
            ]);

        return res.status(200).json({
            success: true,
            message: "Tractors fetched successfully",
            data: {
                tractors
            },
            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalTractors,
                totalPages: Math.ceil(
                    totalTractors / limitNumber
                )
            }
        });

    } catch (error) {
        console.log(
            "Get All Tractors Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch tractors"
        });
    }
};




// GET /admin/tractors
// GET /admin/tractors?search=Mahindra
// GET /admin/tractors?search=Ahmedabad
// GET /admin/tractors?tractorType=Ploughing
// GET /admin/tractors?availability=true
// GET /admin/tractors?availability=false
// GET /admin/tractors?page=1&limit=10   support all of this



export const getTractorById = async (req, res) => {
    try {
        const { id } = req.params;

        const tractor = await tractorModel
            .findById(id)
            .populate(
                "driverId",
                "name email phone role createdAt"
            );

        if (!tractor) {
            return res.status(404).json({
                success: false,
                message: "Tractor not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Tractor fetched successfully",
            data: {
                tractor
            }
        });

    } catch (error) {
        console.log(
            "Get Tractor By ID Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch tractor"
        });
    }
};





export const getAllProducts = async (req, res) => {
    try {
        const {
            search = "",
            category = "",
            stockStatus = "",
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        // Search by product name or description
        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        // Filter by category
        if (category) {
            const allowedCategories = [
                "seeds",
                "fertilizer",
                "tools",
                "equipment"
            ];

            if (!allowedCategories.includes(category)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product category"
                });
            }

            query.category = category;
        }

        // Filter by stock status
        if (stockStatus) {
            if (stockStatus === "inStock") {
                query.stock = {
                    $gt: 0
                };
            } else if (stockStatus === "outOfStock") {
                query.stock = 0;
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid stock status"
                });
            }
        }

        const pageNumber = Math.max(
            Number(page) || 1,
            1
        );

        const limitNumber = Math.min(
            Math.max(Number(limit) || 10, 1),
            100
        );

        const skip =
            (pageNumber - 1) * limitNumber;

        const [products, totalProducts] =
            await Promise.all([
                productModel
                    .find(query)
                    .sort({
                        createdAt: -1
                    })
                    .skip(skip)
                    .limit(limitNumber),

                productModel.countDocuments(query)
            ]);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: {
                products
            },
            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalProducts,
                totalPages: Math.ceil(
                    totalProducts / limitNumber
                )
            }
        });

    } catch (error) {
        console.log(
            "Get All Products Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
};



export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: {
                product
            }
        });

    } catch (error) {
        console.log(
            "Get Product By ID Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch product"
        });
    }
};


export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "accepted",
            "completed",
            "cancelled"
        ];

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Booking status is required"
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking status"
            });
        }

        const booking = await bookingModel.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        const currentStatus = booking.status;

        // Allowed booking status transitions
        const allowedTransitions = {
            pending: [
                "accepted",
                "cancelled"
            ],

            accepted: [
                "completed",
                "cancelled"
            ],

            completed: [],

            cancelled: []
        };

        if (
            !allowedTransitions[currentStatus].includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: `Cannot change booking status from ${currentStatus} to ${status}`
            });
        }

        booking.status = status;

        await booking.save();

        const tractor = await tractorModel.findById(
            booking.tractorId
        );

        if (tractor) {
            // Tractor remains unavailable while booking
            // is pending or accepted
            if (
                status === "pending" ||
                status === "accepted"
            ) {
                tractor.availability = false;
            }

            // Tractor becomes available when booking
            // is completed or cancelled
            if (
                status === "completed" ||
                status === "cancelled"
            ) {
                tractor.availability = true;
            }

            await tractor.save();
        }

        const updatedBooking = await bookingModel
            .findById(booking._id)
            .populate(
                "farmerId",
                "name email phone role"
            )
            .populate(
                "driverId",
                "name email phone role"
            )
            .populate(
                "tractorId",
                "tractorName tractorType pricePerHour location availability"
            );

        return res.status(200).json({
            success: true,
            message: `Booking status updated to ${status}`,
            data: {
                booking: updatedBooking
            }
        });

    } catch (error) {
        console.log(
            "Update Booking Status Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update booking status"
        });
    }
};


export const updateTractorAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { availability } = req.body;

        if (typeof availability !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Availability must be true or false"
            });
        }

        const tractor = await tractorModel.findById(id);

        if (!tractor) {
            return res.status(404).json({
                success: false,
                message: "Tractor not found"
            });
        }

        // Before making a tractor available,
        // check whether it has an active booking.
        if (availability === true) {
            const activeBooking = await bookingModel.findOne({
                tractorId: tractor._id,
                status: {
                    $in: ["pending", "accepted"]
                }
            });

            if (activeBooking) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Cannot mark tractor as available because it has an active booking"
                });
            }
        }

        tractor.availability = availability;

        await tractor.save();

        const updatedTractor = await tractorModel
            .findById(tractor._id)
            .populate(
                "driverId",
                "name email phone role"
            );

        return res.status(200).json({
            success: true,
            message: availability
                ? "Tractor marked as available"
                : "Tractor marked as unavailable",
            data: {
                tractor: updatedTractor
            }
        });

    } catch (error) {
        console.log(
            "Update Tractor Availability Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update tractor availability"
        });
    }
};


export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description = "",
            price,
            category,
            image = "",
            stock
        } = req.body;

        // Required fields
        if (
            !name ||
            price === undefined ||
            !category ||
            stock === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, price, category and stock are required"
            });
        }

        // Validate category
        const allowedCategories = [
            "seeds",
            "fertilizer",
            "tools",
            "equipment"
        ];

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product category"
            });
        }

        // Validate price
        if (
            typeof price !== "number" ||
            price < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Price must be a number greater than or equal to 0"
            });
        }

        // Validate stock
        if (
            typeof stock !== "number" ||
            stock < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Stock must be a number greater than or equal to 0"
            });
        }

        const product = await productModel.create({
            name,
            description,
            price,
            category,
            image,
            stock
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: {
                product
            }
        });

    } catch (error) {
        console.log(
            "Create Product Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create product"
        });
    }
};


export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            description,
            price,
            category,
            image,
            stock
        } = req.body;

        // Find product first
        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Validate category only if admin sends it
        if (category !== undefined) {
            const allowedCategories = [
                "seeds",
                "fertilizer",
                "tools",
                "equipment"
            ];

            if (!allowedCategories.includes(category)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product category"
                });
            }
        }

        // Validate price only if admin sends it
        if (price !== undefined) {
            if (
                typeof price !== "number" ||
                price < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Price must be a number greater than or equal to 0"
                });
            }
        }

        // Validate stock only if admin sends it
        if (stock !== undefined) {
            if (
                typeof stock !== "number" ||
                stock < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Stock must be a number greater than or equal to 0"
                });
            }
        }

        // Update only fields that were provided
        if (name !== undefined) {
            product.name = name;
        }

        if (description !== undefined) {
            product.description = description;
        }

        if (price !== undefined) {
            product.price = price;
        }

        if (category !== undefined) {
            product.category = category;
        }

        if (image !== undefined) {
            product.image = image;
        }

        if (stock !== undefined) {
            product.stock = stock;
        }

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: {
                product
            }
        });

    } catch (error) {
        console.log(
            "Update Product Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update product"
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Find carts containing this product
        const affectedCarts = await cartModel.find({
            "items.productId": product._id
        });

        // Remove product from each affected cart
        // and recalculate total price
        for (const cart of affectedCarts) {
            cart.items = cart.items.filter(
                (item) =>
                    item.productId.toString() !==
                    product._id.toString()
            );

            cart.totalPrice = cart.items.reduce(
                (total, item) => {
                    return total + (
                        item.price * item.quantity
                    );
                },
                0
            );

            await cart.save();
        }

        // Delete product after cleaning carts
        await productModel.findByIdAndDelete(
            product._id
        );

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: {
                deletedProductId: product._id,
                affectedCarts: affectedCarts.length
            }
        });

    } catch (error) {
        console.log(
            "Delete Product Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete product"
        });
    }
};


export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Check role exists
        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role is required"
            });
        }

        // Validate role
        const allowedRoles = [
            "farmer",
            "driver",
            "admin"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user role"
            });
        }

        // Prevent logged-in admin from changing own role
        if (req.user._id.toString() === id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot change your own role"
            });
        }

        // Find user
        const user = await userModel
            .findById(id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // User already has requested role
        if (user.role === role) {
            return res.status(400).json({
                success: false,
                message: `User already has the ${role} role`
            });
        }

        // -----------------------------------
        // DRIVER ROLE CHANGE PROTECTION
        // -----------------------------------

        if (user.role === "driver" && role !== "driver") {

            // Check active bookings assigned to driver
            const activeDriverBooking =
                await bookingModel.findOne({
                    driverId: user._id,
                    status: {
                        $in: ["pending", "accepted"]
                    }
                });

            if (activeDriverBooking) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Cannot change driver role because the driver has an active booking"
                });
            }

            // Check whether driver owns tractors
            const driverTractor =
                await tractorModel.findOne({
                    driverId: user._id
                });

            if (driverTractor) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Cannot change driver role because the driver owns tractors"
                });
            }
        }

        // -----------------------------------
        // FARMER ROLE CHANGE PROTECTION
        // -----------------------------------

        if (user.role === "farmer" && role !== "farmer") {

            // Check active farmer bookings
            const activeFarmerBooking =
                await bookingModel.findOne({
                    farmerId: user._id,
                    status: {
                        $in: ["pending", "accepted"]
                    }
                });

            if (activeFarmerBooking) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Cannot change farmer role because the farmer has an active booking"
                });
            }
        }

        const oldRole = user.role;

        // Update role
        user.role = role;

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                `User role changed from ${oldRole} to ${role}`,
            data: {
                user
            }
        });

    } catch (error) {
        console.log(
            "Update User Role Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update user role"
        });
    }
};



export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent logged-in admin from deleting themselves
        if (req.user._id.toString() === id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        // Find the user
        const user = await userModel
            .findById(id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check whether user is connected to any booking
        const relatedBooking = await bookingModel.findOne({
            $or: [
                { farmerId: user._id },
                { driverId: user._id }
            ]
        });

        if (relatedBooking) {
            return res.status(400).json({
                success: false,
                message:
                    "Cannot delete user because the user has booking history"
            });
        }

        // Check whether user owns any tractors
        const ownedTractor = await tractorModel.findOne({
            driverId: user._id
        });

        if (ownedTractor) {
            return res.status(400).json({
                success: false,
                message:
                    "Cannot delete user because the user owns tractors"
            });
        }

        // A cart is user-specific and can safely be removed
        await cartModel.deleteOne({
            userId: user._id
        });

        // Delete the user
        await userModel.findByIdAndDelete(user._id);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: {
                deletedUserId: user._id
            }
        });

    } catch (error) {
        console.log(
            "Delete User Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
};


export const getAdminProfile = async (req, res) => {
    try {
        const admin = await userModel
            .findById(req.user._id)
            .select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Admin profile fetched successfully",
            data: {
                admin
            }
        });

    } catch (error) {
        console.log(
            "Get Admin Profile Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin profile"
        });
    }
};


export const getAdminAnalytics = async (req, res) => {
    try {
        // Last 6 months, including current month
        const startDate = new Date();

        startDate.setMonth(startDate.getMonth() - 5);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        const [
            recentUsers,
            recentBookings,
            bookingStatusDistribution,
            monthlyBookings,
            monthlyRevenue
        ] = await Promise.all([

            // --------------------------------
            // 1. RECENT USERS
            // --------------------------------

            userModel
                .find()
                .select("-password")
                .sort({ createdAt: -1 })
                .limit(5),

            // --------------------------------
            // 2. RECENT BOOKINGS
            // --------------------------------

            bookingModel
                .find()
                .populate(
                    "farmerId",
                    "name email phone"
                )
                .populate(
                    "driverId",
                    "name email phone"
                )
                .populate(
                    "tractorId",
                    "tractorName tractorType location"
                )
                .sort({ createdAt: -1 })
                .limit(5),

            // --------------------------------
            // 3. BOOKING STATUS DISTRIBUTION
            // --------------------------------

            bookingModel.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]),

            // --------------------------------
            // 4. MONTHLY BOOKING COUNTS
            // --------------------------------

            bookingModel.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startDate
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: {
                                $year: "$createdAt"
                            },
                            month: {
                                $month: "$createdAt"
                            }
                        },
                        bookings: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1
                    }
                }
            ]),

            // --------------------------------
            // 5. MONTHLY COMPLETED REVENUE
            // --------------------------------

            bookingModel.aggregate([
                {
                    $match: {
                        status: "completed",
                        createdAt: {
                            $gte: startDate
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: {
                                $year: "$createdAt"
                            },
                            month: {
                                $month: "$createdAt"
                            }
                        },
                        revenue: {
                            $sum: "$totalPrice"
                        }
                    }
                },
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1
                    }
                }
            ])
        ]);

        // --------------------------------
        // FORMAT BOOKING STATUS DATA
        // --------------------------------

        const statusData = {
            pending: 0,
            accepted: 0,
            completed: 0,
            cancelled: 0
        };

        bookingStatusDistribution.forEach(
            (item) => {
                if (
                    Object.prototype.hasOwnProperty.call(
                        statusData,
                        item._id
                    )
                ) {
                    statusData[item._id] =
                        item.count;
                }
            }
        );

        // --------------------------------
        // CREATE ALL 6 MONTHS
        // --------------------------------

        const monthlyData = [];

        for (let i = 0; i < 6; i++) {
            const date = new Date(
                startDate.getFullYear(),
                startDate.getMonth() + i,
                1
            );

            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            const bookingRecord =
                monthlyBookings.find(
                    (item) =>
                        item._id.year === year &&
                        item._id.month === month
                );

            const revenueRecord =
                monthlyRevenue.find(
                    (item) =>
                        item._id.year === year &&
                        item._id.month === month
                );

            monthlyData.push({
                year,
                month,
                monthName:
                    date.toLocaleString(
                        "en-US",
                        {
                            month: "short"
                        }
                    ),
                bookings:
                    bookingRecord?.bookings || 0,
                revenue:
                    revenueRecord?.revenue || 0
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Admin analytics fetched successfully",
            data: {
                bookingStatusDistribution:
                    statusData,

                monthlyData,

                recentUsers,

                recentBookings
            }
        });

    } catch (error) {
        console.log(
            "Get Admin Analytics Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch admin analytics"
        });
    }
};