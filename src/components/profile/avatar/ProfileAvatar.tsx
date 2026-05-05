import { Avatar, Stack } from "@mui/joy"
// import { CustomPfp } from "../UserInfo";
// import CustomPfpPopup from "./CustomPfpPopup";

export default function ProfileAvatar({ isUpdating, premadePfpName = "coding-cat-pfp.png" }: { isUpdating: boolean, premadePfpName: string }){
  // if(isCustom) return (<Avatar />);
  
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
        isUpdating ? 
        <>
          {/* <CustomPfpPopup
            onConfirm={
              (newCustomPfpLayers: CustomPfp) => onEdit(true, premadePfpName, newCustomPfpLayers)
            }
          /> */}
        </>
        : <></>
      }
    </Stack>
  )
}