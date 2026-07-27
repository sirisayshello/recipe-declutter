import { Paper, Text, Button, CloseButton, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { Transition } from "@mantine/core";
import Link from "next/link";

export const CTABanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <Transition
      mounted={isVisible}
      transition="slide-up"
      duration={400}
      timingFunction="ease"
    >
      {(styles) => (
        <Paper
          shadow="md"
          style={{
            ...styles,
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            borderRadius: "0 0 0 0",
            padding: "32px",
          }}
        >
          <CloseButton
            style={{
              position: "absolute",
              top: 16,
              right: 16,
            }}
            onClick={handleClose}
          />

          <Stack align="center" mt={8}>
            <Text size="lg" fw={500}>
              Save, Edit & Organize Recipes
            </Text>
            <Text ta="center" c="dimmed" size="sm">
              Unlock the full experience by creating an account. Keep your
              recipes saved, customized, and perfectly organized.
            </Text>
            <Button
              component={Link}
              href="/signup"
              size="md"
              color="yellow.6"
              fullWidth
              mt="md"
              style={{
                maxWidth: "300px",
              }}
            >
              Create Free Account
            </Button>
          </Stack>
        </Paper>
      )}
    </Transition>
  );
};
