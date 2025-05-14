import { List, ListItemButton, Typography } from '@mui/joy'
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';
import { getCompletedProblems } from '../utils/getCompletedProblems';
import { Problem, Progress } from '../types';
import { LockSimple } from '@phosphor-icons/react';
import CategoryLock from '../utils/CategoryLock';

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

    const categoryLock = useMemo(() => new CategoryLock(progress), [progress]);

    function mapCategoryToLock(category: string) {
        switch(category) {
            case "Fundamentals": return categoryLock.fundamentals
            case "Logic": return categoryLock.logic
            case "String-1": return categoryLock.string_1
            case "String-2": return categoryLock.string_2
            case "String-3": return categoryLock.string_3
            case "List-1: Indexing": return categoryLock.list_1
            case "List-2: Iterating": return categoryLock.list_2
            case "List-3: Complex Loop": return categoryLock.list_3
            case "Mutation": return categoryLock.mutation
            case "Haystack": return categoryLock.haystack
            default: return categoryLock.fundamentals
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
                const lock = mapCategoryToLock(category);
                const unlocked = lock.isUnlocked();

                return (
                    <ListItemButton 
                        key = {category}
                        selected = { category === activeCategory}
                        onClick={() => {
                            if(unlocked){
                                onSelectCategory(category)
                            } else {
                                lock.hint();
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
