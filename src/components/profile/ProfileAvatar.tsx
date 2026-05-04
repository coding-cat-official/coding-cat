import { Avatar } from "@mui/joy"
import { MouseEventHandler, SetStateAction } from "react";
import { CustomPfp } from "./UserInfo";

export default function ProfileAvatar({ isCustom, onClickFn, avatarFileName = "coding-cat-pfp.png", customPfpLayers = {"bg": 0, "face": 0, "accessory": 0} }: { isCustom: boolean, onClickFn: Function, avatarFileName: string, customPfpLayers: CustomPfp }){
  if(isCustom) return (<Avatar />);
  console.log(`${isCustom}, ${avatarFileName}, ${customPfpLayers}`);

  var pfp;

  try{
    pfp = require(`../../assets/pfp-premade/${avatarFileName}`);
  }catch(e){
    return <Avatar />
  }

  return (
    <a onClick={ onClickFn }> {/* TODO: Doesn't work */}
      <Avatar
        src={ pfp }
        size="lg"
      />
    </a>
  )
}