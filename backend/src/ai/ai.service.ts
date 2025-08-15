import { Injectable } from "@nestjs/common"
import { DatabaseService } from "../database/database.service"
import { DisputesService } from "../disputes/disputes.service"

@Injectable()
export class AiService {
  constructor(
    private databaseService: DatabaseService,
    private disputesService: DisputesService,
  ) {}

  async generateDisputeLetter(data: any) {
    const { dispute_id, dispute_reason, account_name, account_type, user_id } = data

    // Check if OpenAI API key is available
    const useOpenAI = !!process.env.OPENAI_API_KEY

    let letterContent: string

    if (useOpenAI) {
      letterContent = await this.generateWithOpenAI(dispute_reason, account_name, account_type)
    } else {
      letterContent = this.generateMockLetter(dispute_reason, account_name, account_type)
    }

    // Save the generated letter to database if dispute_id is provided
    if (dispute_id) {
      await this.databaseService.query("INSERT INTO dispute_letters (dispute_id, letter_content) VALUES ($1, $2)", [
        dispute_id,
        letterContent,
      ])
    }

    return {
      letter_content: letterContent,
      generated_with_ai: useOpenAI,
      timestamp: new Date().toISOString(),
    }
  }

  private async generateWithOpenAI(disputeReason: string, accountName: string, accountType: string): Promise<string> {
    try {
      // Dynamic import of OpenAI to handle optional dependency
      const { OpenAI } = await import("openai")

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })

      const prompt = `Generate a professional credit dispute letter for the following:

Account Name: ${accountName}
Account Type: ${accountType}
Dispute Reason: ${disputeReason}

The letter should be:
- Professional and formal in tone
- Include proper business letter formatting
- Be specific about the dispute
- Request investigation and removal if inaccurate
- Include a request for written confirmation
- Be between 200-400 words

Format it as a complete business letter with placeholders for [Your Name], [Your Address], [Date], etc.`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a professional credit repair specialist who writes formal dispute letters to credit bureaus. Write clear, professional, and effective dispute letters.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      })

      return completion.choices[0]?.message?.content || this.generateMockLetter(disputeReason, accountName, accountType)
    } catch (error) {
      console.error("OpenAI API error:", error)
      // Fallback to mock letter if OpenAI fails
      return this.generateMockLetter(disputeReason, accountName, accountType)
    }
  }

  private generateMockLetter(disputeReason: string, accountName: string, accountType: string): string {
    const currentDate = new Date().toLocaleDateString()

    return `[Date: ${currentDate}]

[Your Name]
[Your Address]
[City, State, ZIP Code]

[Credit Bureau Name]
[Credit Bureau Address]
[City, State, ZIP Code]

Re: Dispute of Credit Report Information

Dear Credit Bureau,

I am writing to formally dispute the following item on my credit report:

Account Name: ${accountName}
Account Type: ${accountType}

Dispute Details:
${disputeReason}

This information is inaccurate and is negatively affecting my credit score. Under the Fair Credit Reporting Act (FCRA), I have the right to dispute inaccurate information on my credit report.

I am requesting that you:
1. Conduct a thorough investigation of this disputed item
2. Remove this inaccurate information from my credit report if it cannot be verified
3. Provide me with written confirmation of the results of your investigation
4. Send me an updated copy of my credit report once the investigation is complete

I have attached supporting documentation to substantiate my dispute. Please investigate this matter promptly as required by federal law.

I expect to receive your response within 30 days as mandated by the FCRA. If this item cannot be verified as accurate, please remove it from my credit report immediately.

Thank you for your prompt attention to this matter.

Sincerely,

[Your Signature]
[Your Printed Name]

Enclosures: Supporting Documentation`
  }
}
