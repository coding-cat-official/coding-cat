import { List, ListItem, Switch, Typography } from "@mui/joy";
import Box from "@mui/joy/Box";

interface ListProtectedCategoriesProps {
  testCategories: string[];
  visibility: boolean
}

const boxStyles = {
  bgcolor: "#b2f2bb",
  border: "2px solid",
  borderColor: "#006400",
  borderRadius: 2,
  p: 2,
};

/**
 * A component that display and controls what test categories to display
 * @param testCategories List of strings representing the test categories 
 * @returns <ListProtectedCategories {...props} />
 */
export function ListProtectedCategories({ testCategories, visibility }: ListProtectedCategoriesProps) {
  return visibility ? (
    <Box
      sx={boxStyles}
    >
      <Typography>
        <List>
          {testCategories.map((elem) => (
            <ListItem key={elem}>
              {elem}
              <Switch />
            </ListItem>
          ))}
        </List>
      </Typography>
    </Box>
  ) : null;
}
