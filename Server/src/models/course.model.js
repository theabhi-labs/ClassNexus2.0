import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      sparse: true, // IMPORTANT: Allows null but maintains uniqueness for non-null
    },

    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      maxlength: [200, "Short description cannot exceed 200 characters"],
      trim: true,
    },

    thumbnail: {
      type: String,
      required: [true, "Thumbnail image is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },

    level: {
      type: String,
      enum: {
        values: ["Beginner", "Intermediate", "Advanced"],
        message: "Level must be Beginner, Intermediate, or Advanced",
      },
      default: "Beginner",
    },

    language: {
      type: String,
      default: "Hindi",
      trim: true,
    },

    mode: {
      type: String,
      enum: {
        values: ["Online", "Offline", "Hybrid"],
        message: "Mode must be Online, Offline, or Hybrid",
      },
      default: "Offline",
    },

    certificateProvided: {
      type: Boolean,
      default: true,
    },

    projectsIncluded: {
      type: Number,
      default: 0,
      min: [0, "Projects included cannot be negative"],
    },

    skillsYouLearn: [
      {
        type: String,
        trim: true,
      },
    ],

    careerOpportunities: [
      {
        type: String,
        trim: true,
      },
    ],

    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: [0, "Price cannot be negative"],
    },

    duration: {
      value: {
        type: Number,
        required: [true, "Duration value is required"],
        min: [1, "Duration must be at least 1"],
      },
      unit: {
        type: String,
        enum: {
          values: ["days", "weeks", "months"],
          message: "Duration unit must be days, weeks, or months",
        },
        default: "months",
      },
    },

    maxStudents: {
      type: Number,
      default: 50,
      min: [1, "Maximum students must be at least 1"],
    },

    enrolledStudents: {
      type: Number,
      default: 0,
      min: 0,
    },

    syllabus: [
      {
        title: {
          type: String,
          required: [true, "Syllabus module title is required"],
          trim: true,
        },
        topics: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator information is required"],
      index: true,
    },

    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Enhanced slug generation with uniqueness check
courseSchema.pre("save", async function(next) {
  // Only generate slug if title is modified or slug is missing
  if (this.isModified("title") || !this.slug) {
    if (!this.title || !this.title.trim()) {
      // Fallback if title is empty
      this.slug = `course-${Date.now()}`;
    } else {
      // Generate base slug from title
      let baseSlug = this.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
      
      // If baseSlug is empty after cleaning (e.g., only special characters)
      if (!baseSlug) {
        baseSlug = "course";
      }
      
      let slug = baseSlug;
      let counter = 1;
      
      // Check if slug already exists
      const Course = mongoose.model("Course");
      let existingCourse = await Course.findOne({ 
        slug: slug, 
        _id: { $ne: this._id } // Exclude current document when updating
      });
      
      // Add counter until we find a unique slug
      while (existingCourse) {
        slug = `${baseSlug}-${counter}`;
        existingCourse = await Course.findOne({ 
          slug: slug, 
          _id: { $ne: this._id }
        });
        counter++;
      }
      
      this.slug = slug;
    }
  }
  next();
});

// Virtual for total duration in days
courseSchema.virtual("totalDurationInDays").get(function () {
  const { value, unit } = this.duration;
  const unitToDays = {
    days: 1,
    weeks: 7,
    months: 30,
  };
  return value * unitToDays[unit];
});

// Virtual for formatted duration
courseSchema.virtual("formattedDuration").get(function () {
  const { value, unit } = this.duration;
  return `${value} ${unit}${value !== 1 ? "s" : ""}`;
});

// Virtual for remaining seats
courseSchema.virtual("remainingSeats").get(function () {
  return Math.max(0, this.maxStudents - this.enrolledStudents);
});

// Method to check if course is full
courseSchema.methods.isFull = function () {
  return this.enrolledStudents >= this.maxStudents;
};

// Static method to find active courses
courseSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

// Static method to find by slug
courseSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, isActive: true });
};

// Index for better query performance
courseSchema.index({ title: "text", shortDescription: "text", description: "text" });
courseSchema.index({ price: 1, level: 1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ slug: 1 }); // Ensure slug index exists

const Course = mongoose.model("Course", courseSchema);

export default Course;