export interface ICategoryFieldDefinition {
  name: string;
  label: string;
  required: boolean;
  type: "text" | "url" | "number" | "date";
}

export interface ICategory {
  id?: string;
  name: string; 
  fields: ICategoryFieldDefinition[];
}
