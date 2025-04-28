import { List, ListItemButton, Typography } from '@mui/joy'
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';
import { getCompletedProblems } from '../utils/getCompletedProblems';
import { Progress } from '../types';

export interface CategoryListProps {
    activeCategory: string | null
    onSelectCategory: (cat: string) => void;
    session: Session | null;
}

export default function CategoryList({
    activeCategory,
    onSelectCategory,
    session
  }: CategoryListProps) {
    const [error, setError] = useState("");
    const [progress, setProgress] = useState<Progress[]>([]);

    // TODO: hide categories that don't have any search results

    useEffect(() => {
        async function fetchProgress() {
            if (!session) return;
            const { user } = session;
            
            const {data: submissions, error } = await supabase
            .from('submissions')
            .select('problem_title, passed_tests, total_tests')
            .eq('profile_id', user.id);

            if(error) {
                setError(error.message);
            }

            const summary = getCompletedProblems(submissions || []);

            setProgress(summary);
        }

        fetchProgress();
    }, [session])

    return (
        <List component="nav" sx={{ py: 2}}>
            {progress.map((p) => (
            <ListItemButton
                key={p.category}
                selected={p.category === activeCategory}
                onClick={()=> {
                    onSelectCategory(p.category)
                }}
                sx = {{
                    borderRadius: 'md', my: 1, py: 2, px: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: p.category === activeCategory ? 'primary.softBg' : 'background.surface',
                    '&:hover': { bgcolor: 'primary.softBgHover' },
                }} >
                <Typography>{p.category} - <strong>{p.completed}/{p.total}</strong></Typography>
            </ListItemButton>
            ))}
        </List>
    )
}
