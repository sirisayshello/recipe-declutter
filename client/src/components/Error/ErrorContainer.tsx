import styled from "@emotion/styled";

type Props = {
  errorMessage: string;
};

let Container = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50vh",
});

export const ErrorContainer = ({ errorMessage }: Props) => {
  return (
    <Container>
      <p>{errorMessage}</p>
    </Container>
  );
};
