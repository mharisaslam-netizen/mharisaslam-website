
import type { CampaignInput } from "./types";
import {
  analyticsStep,
  specialistStep,
  searchStrategyStep,
  ceoDecisionStep,
  flagshipStep,
  channelsStep,
  visualStep,
  verificationStep
} from "./steps/ai-steps";
import { stageCampaignStep } from "./steps/stage-steps";
import { finalPackStep } from "./steps/final-pack";

export async function runAuthorityCampaign(input: CampaignInput) {
  "use workflow";

  const analytics = await analyticsStep(input);

  const [research, searchAnalytics, challenge, strategy] = await Promise.all([
    specialistStep("research", input, analytics),
    searchStrategyStep(input, analytics),
    specialistStep("challenge", input, analytics),
    specialistStep("strategy", input, analytics)
  ]);

  const specialists = [research, searchAnalytics, challenge, strategy];
  const decision = await ceoDecisionStep(input, specialists);

  const article = await flagshipStep(input, decision);

  const [channels, visual] = await Promise.all([
    channelsStep(input, decision, article),
    visualStep(input, decision, article)
  ]);

  const verification = await verificationStep(decision, article);
  const staged = await stageCampaignStep(input, article, channels, visual, verification);

  return finalPackStep(
    input,
    decision,
    analytics,
    specialists,
    article,
    channels,
    visual,
    verification,
    staged
  );
}
