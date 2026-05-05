import { Avatar, Stack } from "@mui/joy"

export default function ProfileAvatar({ fileName = "coding-cat-pfp.png" }: { fileName: string }){
  var pfp;

  try{
    pfp = require(`../../assets/pfps/${fileName}`);
  }catch(e){
    return <Avatar />
  }

  return (
    <Stack alignItems={"center"} gap={0.5}>
      <Avatar
        src={ pfp }
        sx={{ width: 100, height: 100 }}
      />
    </Stack>
  )
}