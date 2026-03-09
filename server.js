const { app, connectDB } = require("./app");

const port = process.env.PORT || 3000;
const retryDelayMs = 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

async function startMongoConnection() {
  try {
    await connectDB();
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed");
    console.error(error.message);
    setTimeout(startMongoConnection, retryDelayMs);
  }
}

startMongoConnection();
