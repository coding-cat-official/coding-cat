import { List, ListItem, Switch } from "@mui/joy";
import Box from "@mui/joy/Box";

interface ListProtectedCategoriesProps {
  testCategories: Map<string, boolean>;
  toggleAction: (category: string, isActive: boolean) => void;
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
export function ListProtectedCategories({
  testCategories,
  toggleAction,
}: ListProtectedCategoriesProps) {
  return (
    <Box sx={boxStyles}>
      <List>
        {Array.from(testCategories.entries()).map(([category, isActive]) => (
          <ListItem key={category}>
            {category}
            <Switch checked={isActive} onChange={() => toggleAction(category, !isActive)} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
