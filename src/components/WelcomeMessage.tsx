"use client";

import { getTimeOfDay } from "../lib/utils";
import { Box, Title, Text } from "@mantine/core";

type WelcomeMessageProps = {
  userName: string;
};

const WelcomeMessage = ({ userName }: WelcomeMessageProps) => {
  const timeOfDay = getTimeOfDay();

  let greeting;
  let subtext;

  switch (timeOfDay) {
    case "morning":
      greeting = "Good morning";
      subtext = "Ready to start your day off right?";
      break;
    case "afternoon":
      greeting = "Hello there";
      subtext = "Time to start thinking about dinner?";
      break;
    case "evening":
      greeting = "Good evening";
      subtext = "Feeling snackish?";
      break;
    case "night":
      greeting = "Hey there, night owl";
      subtext = "Time to get those last-minute recipes done!";
      break;
    default:
      greeting = "Welcome back";
      subtext = "Let's get those recipes decluttered for you.";
  }

  return (
    <Box>
      <Title fz={{ base: "2.5rem", xs: "3rem" }}>
        {greeting}, {userName}!
      </Title>
      <Text>{subtext}</Text>
    </Box>
  );
};

export default WelcomeMessage;
