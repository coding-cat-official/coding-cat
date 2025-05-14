import { useEffect, useState } from 'react'
import { Box, Typography, Button } from '@mui/joy'
import { supabase } from '../supabaseClient'

type Feature = {
  topic: string
  activated: boolean
}

export default function AdminPage() {
  const [features, setFeatures] = useState<Feature[]>([])

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

  const handleChange = (idx: number, value: string) => {
    setFeatures((f) => {
      const copy = [...f]
      copy[idx] = { ...copy[idx], activated: value === 'true' }
      return copy
    })
  }

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
      </Button>
    </Box>
  )
}
