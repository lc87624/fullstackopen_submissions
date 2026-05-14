import styled from 'styled-components'

export const BlogCard = styled.article`
  display: grid;
  gap: 18px;
  padding: 24px;
  border: 1px solid rgba(23, 32, 42, 0.08);
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 18px 44px rgba(39, 54, 71, 0.08);
`

export const Summary = styled.div`
  h2 {
    margin: 0;
    color: #102030;
    font-size: clamp(1.8rem, 3vw, 2.7rem);
    line-height: 1.08;
  }
`

export const Details = styled.div`
  display: grid;
  gap: 12px;
  color: #475f73;
`

export const ExternalLink = styled.a`
  color: #0d5778;
  font-weight: 800;
  overflow-wrap: anywhere;
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`
