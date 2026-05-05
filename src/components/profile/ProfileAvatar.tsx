import { Avatar, Stack } from "@mui/joy"

export default function ProfileAvatar({ fileName = "coding-cat-pfp.png", height = 100, width = 100 }: { fileName: string, height: number, width: number }){
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
        sx={{ height: height, width: width }}
      />
    </Stack>
  )
}