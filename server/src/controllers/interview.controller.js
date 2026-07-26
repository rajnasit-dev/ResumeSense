// const { PDFParse } = require("pdf-parse")
const pdfParse = require("pdf-parse/lib/pdf-parse.js")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")


function deriveReportTitle(jobDescription) {
    const skipPrefixes = [
        /^about the job[:\-\s]*/i,
        /^about us[:\-\s]*/i,
        /^you will own[:\-\s]*/i,
        /^what great looks like[:\-\s]*/i,
        /^preferred skills[:\-\s]*/i,
        /^our hiring process[:\-\s]*/i,
        /^compensation[:\-\s]*/i,
        /^what you get[:\-\s]*/i,
        /^please note[:\-\s]*/i,
        /^\d+[.)]\s*/,
        /^[-*•]\s*/
    ]

    const candidateLine = String(jobDescription || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .find((line) => {
            if (!line) {
                return false
            }

            return !skipPrefixes.some((pattern) => pattern.test(line))
        })

    if (!candidateLine) {
        return "Untitled Position"
    }

    return candidateLine.replace(/^[:\-\s]+/, "").slice(0, 120) || "Untitled Position"
}


async function generateInterViewReportController(req, res) {

    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required."
            })
        }

        if (req.file.mimetype !== "application/pdf") {
            return res.status(400).json({
                message: "Only PDF resumes are supported."
            })
        }

        // const resumeParser = new PDFParse({ data: req.file.buffer })
        // const resumeParser = await pdfParse(req.file.buffer)
        // const resumeContent = await resumeParser.getText()
        // await resumeParser.destroy()
        const resumeData = await pdfParse(req.file.buffer)
        const resumeText = resumeData.text
        
        const { selfDescription, jobDescription } = req.body

        const interViewReportByAi = await generateInterviewReport({
            // resume: resumeContent.text,
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        const resolvedTitle = String(interViewReportByAi.title || "").trim() || deriveReportTitle(jobDescription) || "Untitled Position"

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            // resume: resumeContent.text,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi,
            title: resolvedTitle
        })

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("generateInterViewReportController error:", error)
        return res.status(500).json({
            message: "Failed to generate interview report."
        })
    }

}

async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}

async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }