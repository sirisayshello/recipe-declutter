import { Center, Loader } from "@mantine/core";

export default function DefaultLoadingSpinner() {
  return (
    <Center h={"90dvh"}>
      <Loader size="lg" />
    </Center>
  );
}
