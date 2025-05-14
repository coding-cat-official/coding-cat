import { Progress } from "../types";

type KVPair = {
  [category: string]: number
}

type Lock = {
  category: string;
  required: KVPair,
  prereqSolved: KVPair,

  isUnlocked: () => boolean;
  hint: () => void;
}

export default class CategoryLock {
  solved: Record<string, number> = {};

  constructor(progress: Progress[]) {
    for (const problem of progress) {
      const key = problem.category;
      this.solved[key] = problem.completed
    }
  }

  get fundamentals(): Lock {
    return {
      category: "Fundamentals",
      required: {},
      prereqSolved: {},
    
      isUnlocked: () => {
        return true;
      },
      hint() {
        alert("Fundamentals is always unlocked. This message should never show up.");
      }
    }
  }

  get logic(): Lock {
    const categoryName = "Logic";

    const required = {
      "Fundamentals": 5
    };

    const prereqSolved = {
      "Fundamentals": this.solved["Fundamentals"]
    };

    return createLockObject(required, prereqSolved, categoryName);
  }

  get string_1(): Lock {
    const categoryName = "String-1";

    const required = {
      "Logic": 5
    };

    const prereqSolved = {
      "Logic": this.solved["Logic"]
    };

    return createLockObject(required, prereqSolved, categoryName);
  }

  get list_1(): Lock {
    const categoryName = "List-1: Indexing";

    const required = {
      "Logic": 5
    };

    const prereqSolved = {
      "Logic": this.solved["Logic"]
    }

    return createLockObject(required, prereqSolved, categoryName);
  }

  get string_2(): Lock {
    const categoryName = "String-2";

    const required = {
      "String-1": 5,
      "List-1": 5
    };

    const prereqSolved = {
      "String-1": this.solved["String-1"],
      "List-1": this.solved["List-1"]
    };

    return createLockObject(required, prereqSolved, categoryName);
  }

  get list_2(): Lock {
    const categoryName = "List-2: Iterating";

    const required = {
      "List-1: Indexing": 5,
      "String-1": 5
    };

    const prereqSolved = {
      "List-1: Indexing": this.solved["List-1: Indexing"],
      "String-1": this.solved["String-1"]
    };

    return createLockObject(required, prereqSolved, categoryName);
  }

  get list_3(): Lock {
    const categoryName = "List-3: Complex Loop";

    const required = {
      "List-2: Iterating": 5,
      "String-2": 5
    };

    const prereqSolved = {
      "List-2: Iterating": this.solved["List-2: Iterating"],
      "String-2": this.solved["String-2"]
    };

    return createLockObject(required, prereqSolved, categoryName);
  }

  get string_3(): Lock {
    const categoryName = "String-3";

    const required = {
      "List-2: Iterating": 5,
      "String-2": 5
    };

    const prereqSolved = {
      "List-2: Iterating": this.solved["List-2: Iterating"],
      "String-2": this.solved["String-2"]
    };

    return createLockObject(required, prereqSolved, categoryName);
  }

  get mutation(): Lock {
    const categoryName = "Mutation";

    const required = {
      "List-2: Iterating": 5,
      "String-2": 5
    };

    const prereqSolved = {
      "List-2: Iterating": this.solved["List-2: Iterating"],
      "String-2": this.solved["String-2"]
    };

    return createLockObject(required, prereqSolved, categoryName);
  }

  get haystack(): Lock {
    const categoryName = "Haystack";

    const required = {
      "List-2: Iterating": 5,
      "String-2": 5
    };

    const prereqSolved = {
      "List-2: Iterating": this.solved["List-2: Iterating"],
      "String-2": this.solved["String-2"]
    };

    return createLockObject(required, prereqSolved, categoryName);
  }
}

function createLockObject(required: KVPair, prereqSolved: KVPair, catName: string): Lock {
  return {
    category: catName,
    required: required,
    prereqSolved: prereqSolved,

    isUnlocked() {
      for (const r of Object.keys(required)) {
        const category = r as keyof typeof prereqSolved;
        if (prereqSolved[category] < required[category]) return false;
      }

      return true;
    },
    hint() {
      let message = "Complete ";

      Object.keys(required).forEach((r, index, array) => {
        const category = r as keyof typeof prereqSolved;
        const needLeft = required[category] - prereqSolved[category];

        message += `${needLeft >= 0 ? needLeft : 0} more ${category} problem${needLeft !== 1 ? "s" : ""} `;

        if (index !== array.length - 1) message += "and ";
      });

      message += `to unlock ${catName}.`;
      alert(message);
    }
  }
}
