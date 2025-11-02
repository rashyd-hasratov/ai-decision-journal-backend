import EstimationModel from "../models/estimation";
import {
  DecisionEstimationStatus,
  DecisionPublicData,
} from "../types/decision";
import {
  EstimatePromptPayload,
  EstimationPromptResult,
} from "../types/estimation";
import decisionService from "./decision";

class EstimationService {
  async estimate(decisionData: DecisionPublicData) {
    const { id, description, decision, decisionExplanation } = decisionData;

    try {
      const promptPayload: EstimatePromptPayload = {
        description,
        decision,
        decisionExplanation,
      };

      const promptText =
        "In this message you can see a JSON string that describes a situation in my life and my decision. Provide an in-depth analysis. The JSON string describes an object with the following data: description (my description of the situation), decision (my decision at the situation), decisionExplanation (my explanation of the decision; this data may not be included). Your answer should be a JSON string that decribes an object with the following data: decisionCategory (it is a string that defines the category of the decision; for example, emotional, strategic, impulsive, and so on;), potentialCognitiveBiases (it is a string array of potential cognitive biases that could have influenced this decision), alternatives (it is a string array of missed alternatives or paths that were not considered). Don't use any formatting or styles. Make sure your answer is a valid stringified JSON object. String values should be in a human readable format.";

      const promptContent = `${promptText} Here is the JSON string: ${JSON.stringify(
        promptPayload
      )}`;

      const response = await fetch(process.env.AI_URL as string, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL,
          messages: [
            {
              role: "user",
              content: promptContent,
            },
          ],
        }),
      });

      const json = await response.json();
      const { decisionCategory, potentialCognitiveBiases, alternatives } =
        JSON.parse(json.choices[0].message.content) as EstimationPromptResult;

      await EstimationModel.create({
        decisionId: id,
        decisionCategory,
        potentialCognitiveBiases: JSON.stringify(potentialCognitiveBiases),
        alternatives: JSON.stringify(alternatives),
      });

      await decisionService.updateStatus(id, DecisionEstimationStatus.Done);
    } catch (error) {
      console.error("Failed to estimate decision.", error);
      await decisionService.updateStatus(id, DecisionEstimationStatus.Error);
    }
  }
}

const estimationService = new EstimationService();

export default estimationService;
