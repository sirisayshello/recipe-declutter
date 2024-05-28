import styled from "@emotion/styled";

const Wrapper = styled.div({
  "@media (min-width: 1100px)": {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    padding: "2rem",
  },
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  maxWidth: "1000px",
});

const IngredientsDiv = styled.div({});

const InstructionsDiv = styled.div({});

const StyledOl = styled.ol({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

type Props = {
  ingredients: React.ReactNode;
  instructions: React.ReactNode;
};

export const RecipeCard = ({ ingredients, instructions }: Props) => {
  return (
    <Wrapper>
      <IngredientsDiv>
        <h2>Ingredients</h2>
        <div>{ingredients}</div>
      </IngredientsDiv>
      <InstructionsDiv>
        <h2>Instructions</h2>
        <StyledOl>{instructions}</StyledOl>
      </InstructionsDiv>
    </Wrapper>
  );
};
