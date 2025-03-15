import mongoose from "mongoose";


const { DB_CONNECTION_STRING } = process.env


if (!DB_CONNECTION_STRING) {
  throw new Error("DB_CONNECTION_STRING is missing in environment variables");
}


function setupMongoConnectionHandlers() {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB Connection Established");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB Connection Reestablished");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB Connection Disconnected");
  });

  mongoose.connection.on("close", () => {
    console.log("MongoDB Connection Closed");
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  });
}

setupMongoConnectionHandlers();

const mongoConnect = async () => {
  try {
    await mongoose.connect(DB_CONNECTION_STRING);
  } catch (error) {
    console.error("Failed to initialize MongoDB connection:", error.message);
    process.exit(1);
  }
};

export { mongoConnect };