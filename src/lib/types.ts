export type PurineLevel = 'Low' | 'Medium' | 'High' | 'Very High';

export type FoodItem = {
  name: string;
  purines: number | null;
  category: string;
  purineLevel: PurineLevel;
};
