import { Problem } from "../types"

export function categorizeCategories(problem:Problem){
  
  const category = problem.meta.category;
  if(category.slice(0,4) === "List"){return "List"}
  if(category.slice(0,6) === "String"){return "String"}
  else{ 
    return category
  } 
}