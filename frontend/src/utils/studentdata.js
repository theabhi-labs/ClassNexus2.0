export const students = [
  {
    rollNumber: "AKTU2024-001",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    mobile: "+91 9876543210",
    photo: "/students/rahul.jpg", // public folder me photo
    course: {
      name: "Full Stack Web Development",
      progress: 85,
      status: "in-progress", // or "completed"
      duration: "6 Months",
      joinDate: "01 Feb 2025",
    },
    payment: {
      type: "per-month", // "all" or "per-month"
      totalFee: 60000,
      monthlyFee: 10000,
      paidMonths: ["Feb", "Mar"], // months that are paid
      joinDate: "01 Feb 2025"
    },
    certificates: [
      {
        name: "Full Stack Web Development",
        issueDate: "10 Aug 2025",
        certificateUrl: "/certificates/sample-certificate.png",
      },
      {
        name: "Python Programming",
        issueDate: "15 Aug 2025",
        certificateUrl: "/certificates/python-cert.png",
      },
    ],
  },
];
