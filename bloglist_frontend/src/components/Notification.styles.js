import styled from 'styled-components'

export const Notice = styled.div`
  margin-bottom: 18px;
  padding: 14px 16px;
  border: 1px solid ${({ $type }) => ($type === 'error' ? '#f1a7a0' : '#9ed9bf')};
  border-left-width: 5px;
  border-radius: 8px;
  background: ${({ $type }) => ($type === 'error' ? '#fff3f1' : '#eefbf4')};
  color: ${({ $type }) => ($type === 'error' ? '#912018' : '#0f5132')};
  font-weight: 800;
  box-shadow: 0 12px 28px rgba(39, 54, 71, 0.07);
`
