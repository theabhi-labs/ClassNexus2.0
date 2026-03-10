import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  dob: {
    type: Date,
    required: true,
  },

  mobileNum: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },

  documents: {

    aadhar: {
      url: String,
      publicId: String,
      fileName: String
    },

    marksheet10: {
      url: String,
      publicId: String,
      fileName: String
    },

    marksheet12: {
      url: String,
      publicId: String,
      fileName: String
    }

  }

},
{ timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;