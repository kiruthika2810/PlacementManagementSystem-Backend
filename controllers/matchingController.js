
const Student = require("../models/Student");
const Job = require("../models/Job");

async function getJobMatches(req, res) {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can access job matching."
      });
    }

    const student = await Student.findOne({
      user: req.user.userId
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Create your student profile first."
      });
    }

    const jobs = await Job.find({
      status: "Open",
      applicationDeadline: { $gt: new Date() }
    }).populate("company", "name industry location");

    const normalizedSkills = student.skills.map(skill =>
      skill.trim().toLowerCase()
    );

    const normalizedDegree = student.degree.trim().toLowerCase();

    const recommendations = jobs.map(job => {
      const requiredSkills = job.requiredSkills || [];

      const matchedSkills = requiredSkills.filter(skill =>
        normalizedSkills.includes(skill.trim().toLowerCase())
      );

      const missingSkills = requiredSkills.filter(skill =>
        !normalizedSkills.includes(skill.trim().toLowerCase())
      );

      const matchPercentage = requiredSkills.length > 0
        ? Math.round(
            (matchedSkills.length / requiredSkills.length) * 100
          )
        : null;

      const eligibilityIssues = [];

      if (student.cgpa < job.minimumCgpa) {
        eligibilityIssues.push(
          `Required CGPA: ${job.minimumCgpa}; your CGPA: ${student.cgpa}`
        );
      }

      if (
        job.eligibleDegrees.length > 0 &&
        !job.eligibleDegrees.some(
          degree => degree.trim().toLowerCase() === normalizedDegree
        )
      ) {
        eligibilityIssues.push("Your degree is not eligible.");
      }

      if (
        job.eligibleGraduationYears.length > 0 &&
        !job.eligibleGraduationYears.includes(student.graduationYear)
      ) {
        eligibilityIssues.push("Your graduation year is not eligible.");
      }

      return {
        job,
        matching: {
          matchPercentage,
          matchedSkills,
          missingSkills,
          eligible: eligibilityIssues.length === 0,
          eligibilityIssues
        }
      };
    });

    recommendations.sort((a, b) => {
      if (a.matching.eligible !== b.matching.eligible) {
        return a.matching.eligible ? -1 : 1;
      }

      return (b.matching.matchPercentage ?? -1) -
        (a.matching.matchPercentage ?? -1);
    });

    return res.status(200).json({
      success: true,
      message: "Job matching completed successfully.",
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error("Job matching error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate job matches."
    });
  }
}

module.exports = { getJobMatches };
