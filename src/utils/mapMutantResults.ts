function mapMutantResults({evalResponse}:any): Map<number, Set<boolean>>{
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

export function countPassedMutants({ evalResponse }: any){
  if(evalResponse == null || evalResponse.report[0].mutations == null) return 0;

  const mutantResults = mapMutantResults(evalResponse);
  let count = 0;

  mutantResults.forEach(({resultSet}:any) => {
    if (resultSet.has(true) && resultSet.has(false)) {
      count++;
    }
  });
  return count;
}

export function getColumnStatuses({ evalResponse }: { evalResponse: any } = { evalResponse: null }){
  if(evalResponse == null || evalResponse.report[0].mutations == null) return 0;
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