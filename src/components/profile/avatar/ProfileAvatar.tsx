import { Avatar, Button, Stack } from "@mui/joy"
import { CustomPfp } from "../UserInfo";
import CustomPfpPopup from "./CustomPfpPopup";
import { useState } from "react";

export default function ProfileAvatar({ isCustom, onEdit, premadePfpName = "coding-cat-pfp.png", customPfpLayers = {"bg": 0, "face": 0, "accessory": 0} }: { isCustom: boolean, onEdit: Function, premadePfpName: string, customPfpLayers: CustomPfp }){
  const [isEditing, setIsEditing] = useState(false);
  if(isCustom) return (<Avatar />);
  
  var pfp;

  try{
    // TODO: find better way to reach assets
    pfp = require(`../../../assets/pfp-premade/${premadePfpName}`);
  }catch(e){
    console.warn(e);
    return <Avatar />
  }

  return (
    <Stack alignItems={"center"} gap={0.5}>
      <Avatar
        src={ pfp }
        sx={{ width: 100, height: 100 }}
      />
      { 
        isEditing ? 
        <>
          <Button 
            onClick={() => setIsEditing(false)} 
            sx={{ fontSize: 12 }}
          >
            Save
          </Button>
          <CustomPfpPopup
            onConfirm={
              (newCustomPfpLayers: CustomPfp) => onEdit(true, premadePfpName, newCustomPfpLayers)
            }
          />
        </>
        : 
        <Button onClick={() => setIsEditing(true)} sx={{ fontSize: 12 }}>
          Edit
        </Button>
      }
    </Stack>
  )
}