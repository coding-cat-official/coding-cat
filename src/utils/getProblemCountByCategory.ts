import { Problem } from "../types";
import { getCategoryList } from "./getCategoryList";

/**
 * Returns a record containing all the categories and the number of problem within
 */
export function getProblemCountByCategory(problems: Problem[]): Record<string,number> {    
    const categories = getCategoryList();

    var record: Record<string,number> = {};
    var count: number = 0;

    for (const category of categories){
        count = 0;
        for(const problem of problems){
            if(problem.meta.category === category && problem.meta.question_type[0] === "coding"){
                count += 1;
                continue;
            }
            // if(includeMutation && problem.meta.question_type[0] === "mutation"){
            //     record["mutation"] += 1;
            //     continue;
            // }
            // if(includeHaystack && problem.meta.question_type[0] === "haystack"){
            //     record["haystack"] += 1;
            // }
        }
        record[category] = count;
    }

    return record;
}