import { Avatar, Stack } from "@mui/joy"
import { CustomPfp } from "../UserInfo";
import ChangePfpPopup from "./ChangePfpPopup";
import { MouseEventHandler } from "react";

export default function ProfileAvatar({ isCustom, onEdit, openEdit, showEdit, premadePfpName = "coding-cat-pfp.png", customPfpLayers = {"bg": 0, "face": 0, "accessory": 0} }: { isCustom: boolean, onEdit: Function, openEdit: MouseEventHandler, showEdit: boolean, premadePfpName: string, customPfpLayers: CustomPfp }){
  if(isCustom) return (<Avatar />);
  console.log(`${isCustom}, ${premadePfpName}, ${customPfpLayers}`);

  var pfp;

  try{
    pfp = require(`../../assets/pfp-premade/${premadePfpName}`);
  }catch(e){
    console.warn(e);
    return <Avatar />
  }

  return (
    <Stack alignItems={"center"} gap={0.5}>
      <Avatar
        src={ pfp }
        size="lg"
      />
      <button onClick={openEdit}>
        Edit
      </button>
      { 
        showEdit ? 
        <ChangePfpPopup 
          onConfirmPremade={
            (pfpFileName: string) => onEdit(false, pfpFileName, customPfpLayers)
          } 
          onConfirmCustom={
            (newCustomPfpLayers: CustomPfp) => onEdit(true, premadePfpName, newCustomPfpLayers)
          }
        />
        : <></>
      }
    </Stack>
  )
}