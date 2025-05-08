import { Problem } from "../types"

export function categorizeCategories(problem:Problem){
  
  const category = problem.meta.category;
  if(category.startsWith("List")){
    return "List"
  }
  if(category.startsWith("String")){
    return "String"
  }
  return category
}