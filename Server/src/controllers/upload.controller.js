import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js"
import Student from "../models/student.model.js";

export const uploadProfilePhoto = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Upload image to cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "profilePhotos",
            transformation: [
              { width: 500, height: 500, crop: "fill" },
              { quality: "auto" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    // Delete old image
    if (user.profilePhoto?.publicId) {
      await cloudinary.uploader.destroy(user.profilePhoto.publicId);
    }

    // Save new image
    user.profilePhoto = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      profilePhoto: user.profilePhoto.url,
    });

  } catch (error) {
    console.error("Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const uploadStudentDocument = async (req, res) => {
  try {
    const { studentId, type } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No PDF uploaded" });
    }

    const allowedTypes = ["aadhar", "marksheet10", "marksheet12"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid document type" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // --- FIX 1: Filename ensure karein ki .pdf par hi khatam ho ---
    let originalName = req.file.originalname;
    if (!originalName.toLowerCase().endsWith(".pdf")) {
      originalName += ".pdf";
    }

    const oldPublicId = student.documents[type]?.publicId;

    // --- FIX 2: Cloudinary Upload mein 'public_id' manually set karein for replacement ---
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `studentDocuments/${studentId}`,
          resource_type: "raw", // PDFs ke liye 'raw' ya 'auto' use hota hai
          public_id: `${type}_${Date.now()}`, // Unique name for the new file
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // DB Update
    student.documents[type] = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileName: originalName // Corrected name with .pdf
    };

    // Mongoose ko batayein ki nested object change hua hai
    student.markModified(`documents.${type}`);
    await student.save();

    // --- FIX 3: Purani file ko delete karna ---
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId, {
        resource_type: "raw"
      }).catch(err => console.log("Old file delete failed, moving on..."));
    }

    res.status(200).json({
      success: true,
      message: "Document replaced successfully",
      document: student.documents[type]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const downloadStudentDocument = async (req, res) => {
  try {

    const { studentId, type } = req.params;

    const student = await Student.findById(studentId);

    if (!student || !student.documents[type]) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    const fileUrl = student.documents[type].url;

    res.setHeader("Content-Type", "application/pdf");

    // browser will open pdf
    res.redirect(fileUrl);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

export const previewStudentDocument = async (req, res) => {
  try {
    const { studentId, type } = req.params;
    const student = await Student.findById(studentId);

    if (!student || !student.documents[type]) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    const fileUrl = student.documents[type].url;

    // --- YE DO LINES MAGIC KARENGI ---
    // 1. Browser ko batayenge ki ye PDF hai
    res.setHeader("Content-Type", "application/pdf");
    // 2. 'inline' ka matlab hai browser ke andar kholo, download mat karo
    res.setHeader("Content-Disposition", "inline");

    // File ko redirect karein
    res.redirect(fileUrl);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};