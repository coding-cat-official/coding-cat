import { useEffect, useState } from "react";
import { Box, Typography, Button, Switch } from "@mui/joy";
import { supabase } from "../supabaseClient";

type Feature = {
  topic: string;
  activated: boolean;
};

/**
 * React component that handles the rendering and logic of the admin page
 * @returns A React Component
 */
export default function AdminPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [originalFeatures, setOriginalFeatures] = useState<Feature[]>([]);

  // Load the toggles from the db for what categories to enable/disables
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("activated")
        .select("topic, activated")
        .order("topic", { ascending: true });
      if (error) {
        console.error(error);
      } else {
        const features = data as Feature[];
        setFeatures(features);
        setOriginalFeatures(features);
      }
    }
    load();
  }, []);

  // Handles changing a feature toggle by topic
  const handleChange = (topic: string, checked: boolean) => {
    setFeatures((current) =>
      current.map((feature) =>
        feature.topic === topic ? { ...feature, activated: checked } : feature,
      ),
    );
  };

  // Handles sending changes to toggles to the db
  const handleSave = async () => {
    const changed = features.filter(
      (f) => originalFeatures.find((o) => o.topic === f.topic)?.activated !== f.activated,
    );

    if (changed.length === 0) {
      console.log("No changes to save");
      return;
    }

    await Promise.all(
      changed.map((f) =>
        supabase.from("activated").update({ activated: f.activated }).eq("topic", f.topic),
      ),
    );

    setOriginalFeatures(features);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography level="h1">Admin Dashboard</Typography>

      {features.map((f) => (
        <Box key={f.topic} sx={{ display: "flex", alignItems: "center", gap: 2, my: 1 }}>
          <Typography sx={{ width: 150 }}>{f.topic}</Typography>
          <Switch
            checked={f.activated}
            onChange={(event) => handleChange(f.topic, event.currentTarget.checked)}
          />
        </Box>
      ))}

      <Button variant="solid" onClick={handleSave} sx={{ mt: 2 }}>
        Update
      </Button>
    </Box>
  );
}
