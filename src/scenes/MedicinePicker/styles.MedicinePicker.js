import styled from 'styled-components';

export const InputFieldWrapper = styled.div`
  display: flex;
  flex-direction: row;

  & > * + * {
    margin: 0px 0px 0px 16px;
  }
`;
