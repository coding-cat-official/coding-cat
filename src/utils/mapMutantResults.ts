// This function returns the mapping of the passing or failing mutants
export function mapMutantResults (evalResponse:any): Map<number, Set<boolean>>{
  const mutantResults = new Map<number, Set<boolean>>();

  evalResponse?.report?.forEach((row:any) => {
    if(row?.solution?.equal){
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

// This function counts how many mutants are passed and failed (1 pass + 1 fail = 1 pass in progressBar)
export function countPassedMutants(evalResponse:any){
    
  if(evalResponse == null){
    return 0
  };

  if(evalResponse.status === 'failure'){
    return 0;
  }

  const mutantResults = mapMutantResults(evalResponse);
  let count = 0;

  mutantResults.forEach((resultSet) => {
    if (resultSet.has(true) && resultSet.has(false)) {
      count++;
    }
  });
  return count;
    
}

// status of the mutation table column depending on if it passed or failed
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