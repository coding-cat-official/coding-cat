import { Avatar } from "@mui/joy"

export default function ProfileAvatar({ avatarFileName }: { avatarFileName: string }){
  var pfp;

  try{
    pfp = require(`../../assets/pfp-premade/${avatarFileName}`);
  }catch(e){
    console.error(e);
    return <Avatar />
  }

  return (
    <Avatar
      src={ pfp }
    />
  )
}