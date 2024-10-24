"use client";

import { useState } from "react";
import { Container, Group, Burger, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Navbar.module.css";

const links = [
  { link: "/dashboard", label: "Dashboard" },
  { link: "/about", label: "About" },
  {
    link: "https://github.com/sirisayshello/recipe-declutter",
    label: "Github",
  },
];

export const Navbar = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={() => {
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Text>Recipe Declutter</Text>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
};

// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import Box from "@mui/material/Box";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import MenuIcon from "@mui/icons-material/Menu";
// import PersonIcon from "@mui/icons-material/Person";

// export default function Navbar() {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <>
//       <Box
//         component="header"
//         sx={{
//           width: "100%",
//           backgroundColor: "grey.500",
//           height: "56px",
//           display: "flex",
//           alignItems: "center",
//           px: 2,
//         }}
//       >
//         <Box
//           component="nav"
//           sx={{
//             width: "100%",
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <Link href="/">Recipe Declutter</Link>
//           <Box sx={{ display: "flex", gap: 2 }}>
//             <Link href="/login">
//               {" "}
//               <PersonIcon />
//             </Link>

//             <button onClick={handleClick} aria-label="Open menu">
//               <MenuIcon />
//             </button>

//             <Menu
//               id="menu"
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleClose}
//             >
//               <MenuItem onClick={handleClose}>
//                 <Link href="/dashboard">Account</Link>
//               </MenuItem>
//               <MenuItem onClick={handleClose}>
//                 <Link href="#">About</Link>
//               </MenuItem>
//               <MenuItem onClick={handleClose}>
//                 <Link href="#">GitHub Repository</Link>
//               </MenuItem>
//             </Menu>
//           </Box>
//         </Box>
//       </Box>
//     </>
//   );
// }
