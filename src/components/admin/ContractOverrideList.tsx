import { Box, Button, List, ListItem, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { getProfiles } from "../../utils/getProfiles";
import { StudentRecord } from "../../types";
import { supabase } from "../../supabaseClient";

const boxStyles = {
  bgcolor: "#b2f2bb",
  border: "2px solid",
  borderColor: "#006400",
  borderRadius: 2,
  p: 2,
};

export default function ContractOverrideList() {
  const [profilesWithOverrides, setProfilesWithOverrides] = useState<StudentRecord[]>();

  useEffect(() => {
    const fetchProfileWithOverrides = async () => {
      const profiles = await getProfiles("contract_override", "true", "eq");
      setProfilesWithOverrides(profiles);
    };
    fetchProfileWithOverrides();
  });

  const disableOverride = async (profile_id: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ contract_override: false })
      .eq("profile_id", `${profile_id}`);

    if (error) {
      throw Error(error.message);
    }

    // remove the profile from the local list
    setProfilesWithOverrides((prev) => prev?.filter((p) => p.profile_id !== profile_id));
  };

  return (
    <Box sx={boxStyles}>
      <Typography fontWeight="bold">Students with Write Access Overrides</Typography>
      <List>
        {profilesWithOverrides && profilesWithOverrides.length > 0 ? (
          profilesWithOverrides.map((profile, idx) => (
            <ListItem
              key={idx}
              sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
            >
              <Typography>
                {profile.username}({profile.student_id})
              </Typography>
              <Button onClick={() => disableOverride(profile.profile_id)}> Disable </Button>
            </ListItem>
          ))
        ) : (
          <Typography>No Students Found with Overrides</Typography>
        )}
      </List>
    </Box>
  );
}
