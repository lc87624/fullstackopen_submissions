import styled, { createGlobalStyle } from 'styled-components'
import { Link } from 'react-router-dom'

export const GlobalStyle = createGlobalStyle`
  :root {
    color: #17202a;
    background: #eef2f6;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    background:
      radial-gradient(circle at top left, rgba(18, 118, 166, 0.16), transparent 34rem),
      linear-gradient(135deg, #eef2f6 0%, #f8fbfd 48%, #edf5ef 100%);
  }

  button,
  input {
    font: inherit;
  }

  a {
    color: inherit;
  }
`

export const PageShell = styled.div`
  width: min(960px, calc(100% - 32px));
  margin: 0 auto;
  padding: 28px 0 48px;
`

export const AppHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  padding: 14px 16px;
  border: 1px solid rgba(23, 32, 42, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 18px 44px rgba(39, 54, 71, 0.08);
  backdrop-filter: blur(12px);

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
  }
`

export const Brand = styled(Link)`
  color: #102030;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0;
  text-decoration: none;
`

export const NavCluster = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`

export const NavLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  color: #365167;
  font-weight: 700;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    background: #e6f0f6;
    color: #0d5778;
    outline: none;
  }
`

export const UserBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 22px;
  padding: 12px 14px;
  border-left: 4px solid #2c7a7b;
  border-radius: 8px;
  background: #ffffff;
  color: #395267;
  box-shadow: 0 12px 28px rgba(39, 54, 71, 0.07);

  p {
    margin: 0;
  }
`

export const Main = styled.main`
  display: grid;
  gap: 18px;
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
`

export const Title = styled.h1`
  margin: 0 0 4px;
  color: #102030;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1;
`

export const Subtitle = styled.p`
  max-width: 56ch;
  margin: 0;
  color: #607486;
`

export const BlogList = styled.ul`
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const BlogListItem = styled.li`
  margin: 0;
`

export const BlogListLink = styled(Link)`
  display: grid;
  gap: 6px;
  padding: 18px;
  border: 1px solid rgba(23, 32, 42, 0.08);
  border-radius: 8px;
  background: #ffffff;
  color: #102030;
  text-decoration: none;
  box-shadow: 0 14px 32px rgba(39, 54, 71, 0.07);
  transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;

  &:hover,
  &:focus-visible {
    border-color: rgba(23, 100, 130, 0.32);
    box-shadow: 0 18px 40px rgba(39, 54, 71, 0.12);
    outline: none;
    transform: translateY(-2px);
  }
`

export const BlogTitleText = styled.span`
  font-size: 1.05rem;
  font-weight: 800;
`

export const BlogMetaText = styled.span`
  color: #607486;
  font-size: 0.95rem;
`

export const Panel = styled.section`
  padding: 24px;
  border: 1px solid rgba(23, 32, 42, 0.08);
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 18px 44px rgba(39, 54, 71, 0.08);
`

export const Form = styled.form`
  display: grid;
  gap: 16px;
  margin-top: 18px;
`

export const Field = styled.label`
  display: grid;
  gap: 8px;
  color: #395267;
  font-weight: 700;
`

export const Input = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid #c8d5df;
  border-radius: 8px;
  background: #fbfdfe;
  color: #102030;

  &:focus {
    border-color: #187098;
    box-shadow: 0 0 0 3px rgba(24, 112, 152, 0.16);
    outline: none;
  }
`

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  width: fit-content;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: ${({ $variant }) => ($variant === 'danger' ? '#b42318' : '#187098')};
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
  transition: background 160ms ease, box-shadow 160ms ease, transform 160ms ease;

  &:hover,
  &:focus-visible {
    background: ${({ $variant }) => ($variant === 'danger' ? '#912018' : '#0d5778')};
    box-shadow: 0 10px 18px rgba(39, 54, 71, 0.16);
    outline: none;
    transform: translateY(-1px);
  }
`

export const SecondaryButton = styled(Button)`
  border-color: #c8d5df;
  background: #ffffff;
  color: #365167;

  &:hover,
  &:focus-visible {
    background: #e6f0f6;
    color: #0d5778;
  }
`
