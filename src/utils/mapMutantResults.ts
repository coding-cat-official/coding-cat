export const mapMutantResults = (evalResponse:any): Map<number, Set<boolean>> =>{
  const mutantResults = new Map<number, Set<boolean>>();

  evalResponse?.report?.forEach((row:any) => {
    if(row.solution.equal){
      row.mutations.forEach((mutation:any, index:number) => {
        if (!mutantResults.has(index)) {
          mutantResults.set(index, new Set());
        }
        mutantResults.get(index)!.add(mutation.equal);  
      });
    }
  });

  return mutantResults;
}

 export function countPassedMutants(evalResponse:any){
    
      if(evalResponse == null || evalResponse.report[0].mutations == null){
        return 0
      };
    
      const mutantResults = mapMutantResults(evalResponse);
      let count = 0;
    
      mutantResults.forEach((resultSet) => {
        if (resultSet.has(true) && resultSet.has(false)) {
          count++;
        }
      });
      return count;
    
  }


export function getColumnStatuses( evalResponse : any){

  if(typeof(evalResponse) == "number") {
    return new Map<number, string>(
      Array.from({ length: 5 }, (_, i) => [i, "none"])
    )
  };

  const mutantResults = mapMutantResults(evalResponse);
  const statusMap = new Map<number, string>();
  mutantResults.forEach((results, index) => {

     if (results.has(true) && results.has(false)) {
      statusMap.set(index, "pass");
    } else {
      statusMap.set(index, "fail");
    }
  });

  return statusMap;
}