const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})


function buildInterviewReportPrompt({ resume, selfDescription, jobDescription }) {
    return `You are an expert interview coach, hiring manager, and resume-positioning strategist.

Your job is to generate a candidate-specific interview strategy that would genuinely help someone prepare for this exact role. The report must be practical enough that the candidate can study from it immediately, not a generic student-project output.

Return ONLY valid JSON that matches the provided schema.
Do not wrap the response in markdown, code fences, or commentary.

Hard requirements:
- title must be a concise job title derived from the role description, for example "Frontend Engineer" or "Senior Full Stack Engineer".
- matchScore must be an integer from 0 to 100.
- technicalQuestions must contain exactly 5 high-signal items.
- behavioralQuestions must contain exactly 5 high-signal items.
- skillGaps must contain exactly 4 items.
- preparationPlan must contain exactly 7 items, one for each day.
- Every answer must be specific to the job description and the candidate profile.
- Do not invent employers, projects, metrics, degrees, certifications, or tools that are not present in the candidate profile. If evidence is missing, say how the candidate should frame the gap honestly.

Quality bar:
- Think like the interviewer. Prioritize the questions most likely to decide whether this candidate gets hired.
- Identify the seniority, domain, required tools, responsibilities, and success criteria from the job description before writing the report.
- Use resume/self-description evidence when it exists. Mention relevant candidate strengths in the answer guidance.
- When the candidate lacks clear evidence for a requirement, give a credible preparation or framing strategy instead of pretending they have it.
- Avoid vague advice like "communicate clearly", "study fundamentals", or "give examples" unless paired with role-specific details.
- Prefer concrete phrasing a candidate could actually say in an interview.
- Keep the tone direct, helpful, and professional.

How to write technicalQuestions:

- Return EXACTLY 5 objects.
- Each object must contain ONLY these three properties:
  - question
  - intention
  - answer

Rules:

- question must be a plain string.
- intention must be a plain string.
- answer must be ONE plain text string.

The answer must naturally include:
- the core concept,
- how the candidate should connect it to their background,
- a suggested answer structure,
- common mistakes to avoid.

IMPORTANT:
- Do NOT create nested objects.
- Do NOT create properties like coreConcept, structure, connectToBackground, commonMistakes, etc.
- Do NOT return JSON inside the answer.
- Do NOT stringify objects.
- The answer field must contain only one continuous text paragraph.

How to write behavioralQuestions:

- Return EXACTLY 5 objects.
- Each object must contain ONLY:
  - question
  - intention
  - answer

Rules:

- answer must be ONE plain text string.
- The answer should naturally explain:
  - a STAR-based response,
  - what the interviewer is evaluating,
  - how the candidate should answer credibly.

Do NOT create nested fields like:
- starFramework
- whatTheInterviewerListensFor
- howToSoundCredible

Everything must be merged into one answer string.

How to write skillGaps:
- Pick gaps by comparing job requirements to candidate evidence, not by listing random technologies.
- severity must reflect hiring impact:
  - high: likely hiring concern for this role
  - medium: important but addressable with preparation or adjacent experience
  - low: nice-to-have or minor evidence gap
- Use short skill names, not long explanations.

How to write preparationPlan:
- Build a 7-day plan for a real candidate with limited time.
- Each day must have a focused theme and 3 to 5 concrete tasks.
- Tasks should include practice outputs, not only reading. Examples: draft a 90-second project story, solve 3 role-specific problems, build a comparison table, rehearse an architecture walkthrough, write answers for the top 5 gaps.
- Sequence the plan logically: role diagnosis, technical depth, project stories, gaps, mock interview, final polish.
- Include deliverables the candidate can verify.

CRITICAL OUTPUT FORMAT

Return ONLY valid JSON matching the schema.

Never stringify any object.

Never return JSON as a string.

Every array element must be a JSON object.

Correct:

technicalQuestions: [
  {
    "question": "...",
    "intention": "...",
    "answer": "..."
  }
]

Incorrect:

technicalQuestions: [
  "{\"question\":\"...\"}"
]

Every field defined as a string in the schema must contain only plain text.

Do not invent additional properties.

Do not rename properties.

Do not return nested objects where the schema expects strings.

Candidate Resume:
${resume || "N/A"}

Candidate Self Description:
${selfDescription || "N/A"}

Job Description:
${jobDescription}
`
}


function normalizeInterviewReport(report) {
    return {
        title: String(report?.title || "Untitled Position").trim() || "Untitled Position",
        matchScore: Number.isFinite(report?.matchScore) ? report.matchScore : 0,
        technicalQuestions: Array.isArray(report?.technicalQuestions) ? report.technicalQuestions : [],
        behavioralQuestions: Array.isArray(report?.behavioralQuestions) ? report.behavioralQuestions : [],
        skillGaps: Array.isArray(report?.skillGaps) ? report.skillGaps : [],
        preparationPlan: Array.isArray(report?.preparationPlan) ? report.preparationPlan : [],
    }
}


function coerceText(value, fallback) {
    const text = String(value || "").trim()
    return text || fallback
}


// function coerceTechnicalQuestion(item, index, jobDescription) {
//     if (item && typeof item === "object" && !Array.isArray(item)) {
//         return {
//             question: coerceText(item.question, `Technical question ${index + 1} for this role`),
//             intention: coerceText(item.intention, "Assess practical role-related knowledge"),
//             answer: coerceText(item.answer, `Answer by explaining the approach and giving a relevant example from ${jobDescription ? "the job context" : "your experience"}.`),
//         }
//     }

//     const question = coerceText(item, `Technical question ${index + 1} for this role`)
//     return {
//         question,
//         intention: "Assess practical role-related knowledge",
//         answer: `Answer directly, then support it with a concrete example relevant to ${jobDescription ? "the job description" : "your experience"}.`,
//     }
// }
function coerceTechnicalQuestion(item, index, jobDescription) {

    // Parse JSON string if Gemini returns one
    if (typeof item === "string") {
        try {
            item = JSON.parse(item);
        } catch {
            // leave as normal string
        }
    }

    if (item && typeof item === "object" && !Array.isArray(item)) {

        let answer = item.answer;

        // Convert answer object into readable text
        if (answer && typeof answer === "object") {
            answer = `
Core Concept:
${answer.coreConcept || ""}

Connect To Your Background:
${answer.connectionToBackground || ""}

Suggested Structure:
${answer.structure || ""}

Common Mistakes:
${answer.commonMistakes || ""}
            `.trim();
        }

        return {
            question: coerceText(
                item.question,
                `Technical question ${index + 1}`
            ),
            intention: coerceText(
                item.intention,
                "Assess practical role-related knowledge"
            ),
            answer: coerceText(
                answer,
                "Answer directly with a practical example."
            )
        };
    }

    return {
        question: coerceText(
            item,
            `Technical question ${index + 1}`
        ),
        intention: "Assess practical role-related knowledge",
        answer: "Answer directly with a practical example."
    };
}

function coerceBehavioralQuestion(item, index) {
    if (item && typeof item === "object" && !Array.isArray(item)) {
        return {
            question: coerceText(item.question, `Behavioral question ${index + 1}`),
            intention: coerceText(item.intention, "Assess collaboration, ownership, and communication"),
            answer: coerceText(item.answer, "Use STAR: context, task, action, result."),
        }
    }

    return {
        question: coerceText(item, `Behavioral question ${index + 1}`),
        intention: "Assess collaboration, ownership, and communication",
        answer: "Use STAR: context, task, action, result.",
    }
}


function coerceSkillGap(item, index) {
    if (item && typeof item === "object" && !Array.isArray(item)) {
        return {
            skill: coerceText(item.skill, `Skill gap ${index + 1}`),
            severity: [ "low", "medium", "high" ].includes(item.severity) ? item.severity : "medium",
        }
    }

    return {
        skill: coerceText(item, `Skill gap ${index + 1}`),
        severity: "medium",
    }
}


function coercePreparationPlan(item, index) {
    if (item && typeof item === "object" && !Array.isArray(item)) {
        return {
            day: Number.isFinite(item.day) ? item.day : index + 1,
            focus: coerceText(item.focus, `Preparation focus for day ${index + 1}`),
            tasks: Array.isArray(item.tasks) && item.tasks.length > 0
                ? item.tasks.map((task) => coerceText(task, "Review the relevant topic"))
                : [ "Review the relevant topic", "Solve one interview question set", "Write a short self-review" ],
        }
    }

    return {
        day: index + 1,
        focus: coerceText(item, `Preparation focus for day ${index + 1}`),
        tasks: [ "Review the relevant topic", "Solve one interview question set", "Write a short self-review" ],
    }
}


function padList(items, targetLength, factory) {
    const output = Array.isArray(items) ? [ ...items ] : []
    while (output.length < targetLength) {
        output.push(factory(output.length))
    }
    return output
}


function coerceInterviewReport(report, jobDescription) {
    const technicalQuestions = padList(
        Array.isArray(report?.technicalQuestions)
            ? report.technicalQuestions.map((item, index) => coerceTechnicalQuestion(item, index, jobDescription))
            : [],
        5,
        (index) => coerceTechnicalQuestion(null, index, jobDescription)
    )

    const behavioralQuestions = padList(
        Array.isArray(report?.behavioralQuestions)
            ? report.behavioralQuestions.map((item, index) => coerceBehavioralQuestion(item, index))
            : [],
        5,
        (index) => coerceBehavioralQuestion(null, index)
    )

    const skillGaps = padList(
        Array.isArray(report?.skillGaps)
            ? report.skillGaps.map((item, index) => coerceSkillGap(item, index))
            : [],
        4,
        (index) => coerceSkillGap(null, index)
    )

    const preparationPlan = padList(
        Array.isArray(report?.preparationPlan)
            ? report.preparationPlan.map((item, index) => coercePreparationPlan(item, index))
            : [],
        7,
        (index) => coercePreparationPlan(null, index)
    )

    return {
        title: coerceText(report?.title, "Untitled Position"),
        matchScore: Number.isFinite(report?.matchScore) ? report.matchScore : 0,
        technicalQuestions,
        behavioralQuestions,
        skillGaps,
        preparationPlan,
    }
}


function hasIncompleteInterviewReport(report) {
    return !report
        || !Array.isArray(report.technicalQuestions)
        || report.technicalQuestions.length < 5
        || !Array.isArray(report.behavioralQuestions)
        || report.behavioralQuestions.length < 5
        || !Array.isArray(report.skillGaps)
        || report.skillGaps.length < 4
        || !Array.isArray(report.preparationPlan)
        || report.preparationPlan.length < 7
}


function buildInterviewReportRepairPrompt(report) {
    return `You are repairing an interview report so it becomes complete and useful for a real job candidate.

Return only valid JSON.
Keep the existing useful content, but ensure the final report has:
- technicalQuestions: 5 items
- behavioralQuestions: 5 items
- skillGaps: 4 items
- preparationPlan: 7 items

Do not return empty arrays for any of those fields.
Do not add generic filler. Every added item must be practical, interview-relevant, and specific to the existing report context.
If the existing report is thin, improve it by adding concrete answer guidance, interviewer intent, and executable preparation tasks.

Existing report:
${JSON.stringify(report, null, 2)}
`
}


const interviewReportSchema = z.object({
    matchScore: z.number().describe("An integer score from 0 to 100 indicating how strongly the candidate evidence matches the role requirements"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("A realistic technical interview question tied to a key job requirement"),
        intention: z.string().describe("The hiring signal the interviewer is trying to evaluate"),
        answer: z.string().describe("Candidate-specific guidance for answering, including structure, relevant evidence, tradeoffs, and pitfalls to avoid")
    })).min(5).describe("Five role-specific technical questions with interviewer intent and practical answer coaching"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("A realistic behavioral interview question tied to role expectations"),
        intention: z.string().describe("The hiring signal behind the question"),
        answer: z.string().describe("A STAR-style answer strategy customized to the candidate profile and role")
    })).min(5).describe("Five role-specific behavioral questions with interviewer intent and practical answer coaching"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("A concise missing or weakly evidenced skill compared with the role requirements"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The hiring impact of this gap for the role")
    })).min(4).describe("Four evidence-based skill gaps with severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan"),
        tasks: z.array(z.string()).describe("Three to five concrete tasks with practice deliverables for this day")
    })).min(7).describe("A seven-day role-specific preparation plan with concrete tasks"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = buildInterviewReportPrompt({ resume, selfDescription, jobDescription })

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    const parsedReport = JSON.parse(response.text)
    console.log(response.text)
    // console.log(
    //     JSON.stringify(parsedReport.technicalQuestions, null, 2)
    // );
    let reportResult = interviewReportSchema.safeParse(coerceInterviewReport(parsedReport, jobDescription))

    if (!reportResult.success || hasIncompleteInterviewReport(reportResult.data)) {
        const repairResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: buildInterviewReportRepairPrompt(parsedReport),
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema),
            }
        })

        const repairedReport = JSON.parse(repairResponse.text)
        reportResult = interviewReportSchema.safeParse(coerceInterviewReport(repairedReport, jobDescription))
    }

    const report = reportResult.success ? reportResult.data : coerceInterviewReport(parsedReport, jobDescription)

    return normalizeInterviewReport(report)


}



async function generatePdfFromHtml(htmlContent) {
    // const browser = await puppeteer.launch()
    const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
  defaultViewport: chromium.defaultViewport,
});
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `You are an expert resume writer and recruiter.

Return ONLY valid JSON with a single field named "html".
The "html" value must be complete HTML that Puppeteer can render into a polished PDF resume.

Goal:
Create a truthful, ATS-friendly, role-targeted resume that improves the candidate's chance of getting an interview for the supplied job description.

Candidate Resume:
${resume || "N/A"}

Candidate Self Description:
${selfDescription || "N/A"}

Job Description:
${jobDescription}

Resume writing rules:
- Do not invent employers, dates, degrees, certifications, job titles, metrics, tools, or achievements.
- You may rewrite, reorder, and emphasize existing evidence to better match the job.
- If a metric is not supplied, do not fabricate one. Use impact phrasing without fake numbers.
- Lead with the candidate's strongest role-relevant evidence.
- Include a concise professional summary customized to the job.
- Prioritize skills and experience that match the job description.
- Remove weak filler, generic objective statements, and unrelated content.
- Use plain, recruiter-friendly language. Avoid AI-sounding phrases like "passionate about leveraging cutting-edge technologies".
- Keep the resume ideally to 1 page, maximum 2 pages if the candidate has enough relevant experience.
- Make it ATS-friendly: real text, semantic sections, simple headings, no tables for core content, no images, no icons, no multi-column layouts that could confuse parsing.

HTML design rules:
- Use a clean professional layout with inline CSS.
- Use black or dark neutral text on white background.
- Use one subtle accent color only for section headings or dividers.
- Use readable font sizes and spacing suitable for A4 PDF.
- The HTML should render well without external assets, web fonts, scripts, or network requests.
- Include sections only when supported by candidate information.

Output:
- JSON only.
- The html field should contain the complete document, including html, head, style, and body tags.`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }
