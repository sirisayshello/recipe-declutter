import {
  Title,
  Text,
  Stack,
  Anchor,
  Center,
  List,
  Button,
} from "@mantine/core";
import Link from "next/link";

export default function About() {
  return (
    <Center>
      <Stack mb="4rem" maw={"60ch"}>
        <Stack mt={"xl"}>
          <Title ta="center">About us</Title>
          <Text>
            Welcome to <strong>Savorly</strong>—the ultimate solution for home
            cooks who’ve had enough of endless scrolling, pop-up ads, and life
            stories before getting to the actual recipe. We’re here to bring
            simplicity back to your kitchen with clean, distraction-free recipes
            that are easy to save, edit, and organize.
          </Text>
          <Text>
            Our mission is to help you spend less time scrolling and more time
            cooking (or eating—no judgment!).
          </Text>
        </Stack>
        <Stack mt={"xl"}>
          <Title order={2} ta="center">
            Why we built Savorly
          </Title>
          <Text>
            This site isn’t just a passion project; it’s our exam project for
            the{" "}
            <Anchor
              href={"https://www.yrgo.se/program/webbutvecklare/"}
              component={Link}
            >
              Web Development
            </Anchor>{" "}
            program at Yrgo. Created by three determined students with a love
            for clean code and delicious food, this project represents months of
            learning, late-night debugging sessions, and probably way too much
            coffee.
          </Text>
        </Stack>
        <Stack mt={"xl"}>
          <Title order={2} ta="center">
            What we offer
          </Title>
          <Stack>
            <List spacing="xs">
              <li>
                <strong>Decluttered Recipes</strong>: No ads, no fluff, no
                unnecessary life stories. Just the ingredients and instructions
                you need.
              </li>
              <li>
                <strong>Save & Organize</strong>: Create an account to build
                your own digital cookbook with all your favorites.
              </li>
              <li>
                <strong>Edit Recipes</strong>: Tweak recipes to fit your taste,
                dietary needs, or spice tolerance.
              </li>
            </List>
          </Stack>
        </Stack>
        <Stack mt={"xl"}>
          <Title order={2} ta="center">
            Who we are
          </Title>
          <Text>
            We’re a team of three students who wanted to take our skills from
            the classroom to the real world. Our backgrounds may vary, but we
            all agree on one thing: recipes shouldn’t feel like navigating a
            labyrinth.
          </Text>
        </Stack>
        <Stack mt={"xl"}>
          <Title order={2} ta="center">
            A note of gratitude
          </Title>
          <Text>
            Thank you for supporting a student project with big dreams! By using
            Savorly, you’re not just getting a better cooking experience—you’re
            helping launch the careers of three web developers into the wild. We
            hope you love using the site as much as we loved building it (bugs
            and all).
          </Text>
          <Text>Now, go declutter a recipe and get cooking!</Text>
          <Button
            component={Link}
            href="/"
            size="md"
            mt={"md"}
            style={{ width: "min-content", alignSelf: "center" }}
          >
            I want to declutter!
          </Button>
        </Stack>
      </Stack>
    </Center>
  );
}
