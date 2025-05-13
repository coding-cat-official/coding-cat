import { List, ListItemButton, Typography } from '@mui/joy'
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';
import { getCompletedProblems } from '../utils/getCompletedProblems';
import { Problem, Progress } from '../types';
import { LockSimple } from '@phosphor-icons/react';

export interface CategoryListProps {
    searchedProblems: Problem[];
    activeCategory: string | null;
    onSelectCategory: (cat: string) => void;
    session: Session | null;
}

export default function CategoryList({
    searchedProblems,
    activeCategory,
    onSelectCategory,
    session
  }: CategoryListProps) {
    const [error, setError] = useState("");
    const [progress, setProgress] = useState<Progress[]>([]);

    // List of categories that show up in search results.
    const categories = searchedProblems.map((c) => {
        return c.meta.category;
    }).filter((c, index, array) => array.indexOf(c) === index);

    categories.push("mutation", "haystack");


    useEffect(() => {
        async function fetchProgress() {
            if (!session) return;
            const { user } = session;
            
            const {data: submissions, error } = await supabase
            .from('submissions')
            .select('problem_title, passed_tests, total_tests, question_type')
            .eq('profile_id', user.id);

            if(error) {
                setError(error.message);
            }

            const summary = getCompletedProblems(submissions || []);

            setProgress(summary);
        }

        fetchProgress();
    }, [session])

    function getHint(category: string) {
        if(!session && category !== "Fundamentals") {
            return "Log in to continue learning.";
        }
        switch (category) {
          case "Logic": {
            const done = solved["Fundamentals"] || 0;
            const need = Math.max(0, 5 - done);
            return `Complete ${need} more Fundamentals problem${need !== 1 ? "s" : ""} to unlock Logic.`;
          }
          case "String-1": {
            const done = solved["Logic"] || 0;
            const need = Math.max(0, 5 - done);
            return `Complete ${need} more Logic problem${need !== 1 ? "s" : ""} to unlock String-1.`;
          }
          case "List-1: Indexing": {
            const done = solved["Logic"] || 0;
            const need = Math.max(0, 5 - done);
            return `Complete ${need} more Logic problem${need !== 1 ? "s" : ""} to unlock List-1.`;
          }
          case "String-2":
          case "List-2: Iterating": {
            const done1 = solved["String-1"] || 0;
            const done2 = solved["List-1: Indexing"] || 0;
            const need1 = Math.max(0, 5 - done1);
            const need2 = Math.max(0, 5 - done2);
            return `Complete ${need1} more String-1 and ${need2} more List-1 problems to unlock ${category}.`;
          }
          default:
            return "Keep going!";
        }
    }

    const solved: Record<string, number> = {}
    for (let problem of progress) {
        const key = problem.category;
        solved[key] = problem.completed
    }

    function getUnlocked(category: string) {
        if (!session) {
            return category === "Fundamentals"
        }
        switch(category) {
            case "Fundamentals": return true 
            case "Logic": return (solved["Fundamentals"] || 0) >= 0
            case "String-1": return (solved["Logic"] || 0) >= 0
            case "List-1: Indexing": return  (solved["Logic"] || 0) >= 0
            case "String-2": return (solved["List-1: Indexing"] || 0) >= 0 && (solved["String-1"] || 0) >= 0
            case "List-2: Iterating": return (solved["List-1: Indexing"] || 0) >= 0 && (solved["String-1"] || 0) >= 0
            case "List-3: Complex Loop": return (solved["List-2: Iterating"] || 0) >= 0 && (solved["String-2"] || 0) >= 0
            case "String-3": return (solved["List-2: Iterating"] || 0) >= 0 && (solved["String-2"] || 0) >= 0
            case "mutation": return (solved["List-2: Iterating"] || 0) >= 0 && (solved["String-2"] || 0) >= 0
            case "haystack": return (solved["List-2: Iterating"] || 0) >= 0 && (solved["String-2"] || 0) >= 0
            default: return false
        }
    }

    if (error) {
        return (
            <Typography>Error fetching categories: {error}</Typography>
        )
    }

    return (
        <List component="nav" sx={{ py: 2}}>
            {categories.sort((a,b) => a.localeCompare(b)).map(category => {
                const summary = progress.find(p => p.category === category) ?? progress.find(p => p.question_type === category)
                const unlocked = getUnlocked(category)
                const hint = getHint(category)
                return (
                    <ListItemButton 
                        key = {category}
                        selected = { category === activeCategory}
                        onClick={() => {
                            if(unlocked){
                                onSelectCategory(category)
                            } else {
                                alert(hint)
                            }
                        }}
                        sx = {{
                            borderRadius: 'md', my: 1, py: 2, px: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 1,
                            color: unlocked ? 'inherit' : 'neutral.400',
                            bgcolor: category === activeCategory ? 'primary.softBg' : 'background.surface',
                            cursor: unlocked ? 'pointer' : 'not-allowed',
                            '&:hover': { bgcolor: unlocked ? 'primary.softBgHover' : 'danger.softBgHover' },
                        }}
                        >
                            {!unlocked && <LockSimple size={16}/>}
                            <Typography>
                                {category.charAt(0).toUpperCase() + category.slice(1)} - <strong>{summary?.completed ?? 0}/{summary?.total ?? 0}</strong>
                            </Typography>
                        </ListItemButton>
                    )
                })}
        </List>
    )
}
