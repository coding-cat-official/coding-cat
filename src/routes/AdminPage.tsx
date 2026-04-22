import { useEffect, useState } from 'react'
import { Box, Typography, Button } from '@mui/joy'
import { supabase } from '../supabaseClient'

type Feature = {
  topic: string
  activated: boolean
}

/**
 * React component that handles the rendering and logic of the admin page
 * @returns A React Component
 */
export default function AdminPage() {
  const [features, setFeatures] = useState<Feature[]>([])

  // Load the toggles from the db for what categories to enable/disables 
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('activated')
        .select('topic, activated')
        .order('topic', { ascending: true })
      if (error) {
        console.error(error)
      } else {
        setFeatures(data as Feature[])
      }
    }
    load()
  }, [])

  // Handles changing the value between true or false
  const handleChange = (idx: number, value: string) => {
    setFeatures((f) => {
      const copy = [...f]
      copy[idx] = { ...copy[idx], activated: value === 'true' }
      return copy
    })
  }

  // Handles sending changes to toggles to the db (does not work currently)
  const handleSave = async () => {
    await Promise.all(
      features.map((f) =>
        supabase
          .from('activated')
          .update({ activated: f.activated })
          .eq('topic', f.topic)
      )
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography level="h1">Admin Dashboard</Typography>

      {features.map((f, i) => (
        <Box
          key={f.topic}
          sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}
        >
          <Typography sx={{ width: 150 }}>{f.topic}</Typography>
          <select
            value={f.activated ? 'true' : 'false'}
            onChange={(e) => handleChange(i, e.target.value)}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </Box>
      ))}

      <Button
        variant="solid"
        onClick={handleSave}
        sx={{ mt: 2 }}
      >
        Update
      </Button>
    </Box>
  )
}
