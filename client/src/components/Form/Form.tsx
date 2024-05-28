import styled from "@emotion/styled";

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const FormElement = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: #f5f5f5;
  border-radius: 1.5rem;
  padding: 2rem 0;
  max-width: 500px;
  width: 90%;
  @media (prefers-color-scheme: dark) {
    background-color: #1c1c1c;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const InputField = styled.input`
  width: 200px;
  text-align: center;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  @media (prefers-color-scheme: dark) {
    border: 1px solid transparent;
  }
  &:hover {
    border-color: #1a1a1a;
    transition: border-color 0.3s;
    @media (prefers-color-scheme: dark) {
      border-color: transparent;
    }
  }
`;

type Props = {
  url: string | undefined;
  handleInputChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
};

export const Form = ({ url, handleInputChange, handleSubmit }: Props) => {
  return (
    <FormWrapper>
      <FormElement onSubmit={handleSubmit}>
        <InputWrapper>
          <label htmlFor="urlInput">Paste your url here:</label>
          <InputField
            value={url || ""}
            onChange={handleInputChange}
            id="urlInput"
            type="url"
            placeholder="https://www.recipe.com"
          />
        </InputWrapper>
        <button type="submit">Declutter</button>
      </FormElement>
    </FormWrapper>
  );
};
