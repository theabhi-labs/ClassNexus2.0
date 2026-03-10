import cloudinary from "../config/cloudinary.js"

export const uploadFileToCloudinary = async (
  file,
  folder = "uploads"
) => {
  if (!file) throw new Error("No file provided");

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "auto", 
        },
        (error, result) => {
          if (error) return reject(error);

          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      )
      .end(file.buffer);
  });
};


export const deleteFileFromCloudinary = async (public_id) => {
  if (!public_id) throw new Error("No public_id provided");

  return await cloudinary.uploader.destroy(public_id, {
    resource_type: "auto",
  });
};
