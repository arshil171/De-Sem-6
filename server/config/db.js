import mongoose from "mongoose";


const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            tls: true,
            tlsAllowInvalidCertificates: true,
        });
        console.log("DataBase Connected");
    } catch (error) {
        console.log(" DB Error:", error.message);
    }
};
export default dbConnect;