import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Page = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1e293b;
`

export const Navigation = styled.nav`
  background-color: #1e293b;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #f8fafc;
`

export const NavLink = styled(Link)`
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 500;
  padding: 0.35rem 0.65rem;
  border-radius: 5px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #334155;
    color: #ffffff;
  }
`

export const NavRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 420px;
  background-color: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-weight: 500;
  font-size: 0.95rem;
`

export const Input = styled.input`
  padding: 0.55rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`

export const Button = styled.button`
  background-color: ${props => (props.$danger ? '#dc2626' : '#2563eb')};
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  width: fit-content;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${props => (props.$danger ? '#b91c1c' : '#1d4ed8')};
  }
`

export const Alert = styled.div`
  padding: 0.85rem 1rem;
  margin-bottom: 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  background-color: ${props => (props.$type === 'error' ? '#fef2f2' : '#f0fdf4')};
  color: ${props => (props.$type === 'error' ? '#991b1b' : '#166534')};
  border: 1px solid ${props => (props.$type === 'error' ? '#fecaca' : '#bbf7d0')};
`

export const BlogListItem = styled.div`
  padding: 0.85rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 0.6rem;
  background-color: #ffffff;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  a {
    text-decoration: none;
    color: #0f172a;
    font-weight: 500;
    display: block;
  }

  a:hover {
    color: #2563eb;
  }
`

export const BlogCard = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  h2 {
    margin: 0;
    color: #0f172a;
  }

  a {
    color: #2563eb;
    text-decoration: none;
    word-break: break-all;
  }

  a:hover {
    text-decoration: underline;
  }
`

export const LikesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
`