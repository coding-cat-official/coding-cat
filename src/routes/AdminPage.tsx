import { Box, Typography, Link, Card } from "@mui/joy";
import { ReactNode, useEffect, useState } from "react";
import AdminPageModal from "../components/admin/AdminPageModal";
import { AdminSwitch, Problem } from "../types";
import CategoryPasswordForm from "../components/admin/CategoryPasswordForm";
import { supabase } from "../supabaseClient";
import { ListProtectedCategories } from "../components/admin/ListProtectedCategories";
import { useLoaderData } from "react-router-dom";

// Defines the data in the modal
interface ModalMetaData {
  title: string;
  desc: string;
  switch?: AdminSwitch;
  extraNodes?: ReactNode[];
}

// CSS styles of links
const linkStyle = { marginBottom: 2, color: "black" };

/**
 * Page level component that renders a box of link that render modals that allows the user to make changes to the app itself
 * @returns <AdminPage />
 */
export default function AdminPage() {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [switchToggle, setSwitchToggle] = useState(false);

  const handleOpen = (index: number) => setActiveModalIndex(index);
  const handleClose = () => setActiveModalIndex(null);
  const problems = useLoaderData() as Problem[];

  // List of categories that have test-questions in their name
  const testCategories = problems
    .map((c) => c.meta.category)
    .filter((c) => c.match(/^(final|midterm)\d+$/))
    .filter((c, index, arr) => arr.indexOf(c) === index);

  // Meta data for each link
  const links: ModalMetaData[] = [
    {
      title: "View Student Information",
      desc: "Enter the email/student id of the student you want to a detailed view of",
    },
    {
      title: "Toggle Public/Test Questions",
      desc: "Below is a switch that toggles what types of questions to display to the user. You can choose to display test questions or the pubic questions",
      extraNodes: [
        <CategoryPasswordForm />,
        <ListProtectedCategories testCategories={testCategories} />,
      ],
    },
    {
      title: "Modify Global Contract Permissions",
      desc: "Below is a switch that toggles the contract to be read-only globally. This does not apply for student who have contract overrides enabled.",
      switch: { switchLabel: "Toggle Read-Only Mode", switchAction: () => ({}) },
    },
  ];

  const activeModal = activeModalIndex !== null ? links[activeModalIndex] : null;

  return (
    <Box
      sx={{
        height: "90%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          border: "10px, solid ,#d4ff99",
          padding: "100px",
        }}
      >
        <Typography level="h2" sx={{ marginBottom: 2, color: "black" }}>
          Admin Dashboard
        </Typography>

        {/* Dynamically render links */}
        {links.map((elem, index) => (
          <Link key={index} component="button" sx={linkStyle} onClick={() => handleOpen(index)}>
            {elem.title}
          </Link>
        ))}

        {/* Renders different modals data depending on what link was clicked */}
        {activeModal && (
          <AdminPageModal
            open
            handleClose={handleClose}
            modalTitle={activeModal.title}
            modalDesc={activeModal.desc}
            switchLabel={activeModal.switch?.switchLabel}
            switchAction={activeModal.switch?.switchAction}
            extraNodes={activeModal.extraNodes}
          />
        )}
      </Card>
    </Box>
  );
}
