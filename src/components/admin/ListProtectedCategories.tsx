import { List, ListItem, Switch } from "@mui/joy";
import Box from "@mui/joy/Box";

interface ListProtectedCategoriesProps {
  testCategories: string[];
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
export function ListProtectedCategories({ testCategories }: ListProtectedCategoriesProps) {
  return (
    <Box sx={boxStyles}>
      <List>
        {testCategories.map((elem) => (
          <ListItem key={elem}>
            {elem}
            <Switch />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
