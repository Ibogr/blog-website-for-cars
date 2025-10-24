// Import the multer library, used for handling file uploads in Node.js
const multer = require("multer");

// Configure storage settings for multer
const storage = multer.diskStorage({
    // Specify the destination folder where uploaded files will be saved
    destination: (req, file, callback) => {
        // "images" folder in your project directory
        callback(null, "images");
    },
    // Specify the filename for each uploaded file
    filename: (req, file, callback) => {
        // Combines the field name, current timestamp, and field name again with ".jpg" extension
        // This ensures unique filenames for each uploaded file
        callback(null, file.fieldname + "-" + Date.now() + file.fieldname + ".jpg");
    }
});

// Initialize multer with the storage configuration
const upload = multer({
    storage: storage
});

// Export the upload instance so it can be used in routes
module.exports.upload = upload;
