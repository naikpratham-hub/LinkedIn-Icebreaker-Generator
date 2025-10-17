
export interface FormData {
  prospectName: string;
  prospectTitle: string;
  prospectCompany: string;
  whatYouSell: string;
  whoYouAre: string;
  activity?: string;
  connections?: string;
  industry?: string;
  location?: string;
  skills?: string;
}

export interface IcebreakerResponse {
  primaryIcebreaker: string;
  variations: {
    variationA: string;
    variationB: string;
    variationC: string;
  };
  personalizationInsights: string;
}
