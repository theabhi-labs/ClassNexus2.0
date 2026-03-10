import Enrollment from "../models/enrollment.model.js";
export const verifyCertificate = async (req, res) => {
  try {

    const { certificateId } = req.params;

    const enrollment = await Enrollment.findOne({
      "certificate.certificateId": certificateId
    })
      .populate({
        path: "student",
        populate: {
          path: "user"
        }
      })
      .populate("course");

    if (!enrollment) {
      return res.send(`
        <h2 style="color:red;text-align:center;margin-top:50px;">
        ❌ Certificate Not Found
        </h2>
      `);
    }

    const studentName = enrollment.student.user.name;
    const photo = enrollment.student.user.profilePhoto;
    const enrollmentNo = enrollment.enrollmentNo;
    const course = enrollment.course.title;
    const issueDate = new Date(enrollment.certificate.issuedAt)
      .toDateString();

    res.send(`

<!DOCTYPE html>
<html>

<head>

<title>Certificate Verification</title>

<style>

body{
font-family: Arial;
background:#f4f6f9;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
}

.card{
width:600px;
background:white;
padding:30px;
border-radius:10px;
box-shadow:0 10px 25px rgba(0,0,0,0.1);
}

.header{
text-align:center;
margin-bottom:20px;
}

.success{
color:green;
font-size:22px;
font-weight:bold;
}

.student{
display:flex;
gap:20px;
margin-top:20px;
}

.student img{
width:120px;
height:120px;
border-radius:50%;
object-fit:cover;
}

.info p{
margin:6px 0;
font-size:16px;
}

</style>

</head>

<body>

<div class="card">

<div class="header">
<h2>✅ Certificate Verified Successfully</h2>
</div>

<div class="student">

<img src="${photo}" />

<div class="info">

<p><b>Student Name:</b> ${studentName}</p>
<p><b>Enrollment No:</b> ${enrollmentNo}</p>
<p><b>Course:</b> ${course}</p>
<p><b>Certificate ID:</b> ${certificateId}</p>
<p><b>Issue Date:</b> ${issueDate}</p>

</div>

</div>

</div>

</body>

</html>

`);

  } catch (error) {

    res.status(500).send("Server Error");

  }
};