import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProjectCard from './ProjectCard';

const mockProject = {
  title: 'Test Project',
  category: 'Web Application',
  year: '2024',
  description: 'A test project description',
  image: 'https://example.com/image.jpg',
  bgColor: '#5CB5B5',
  tags: ['React', 'TypeScript'],
  link: '#',
};

describe('ProjectCard', () => {
  it('should have width and height attributes on project image', () => {
    render(<ProjectCard project={mockProject} index={0} />);
    const projectImage = screen.getByAltText(/test project/i);
    expect(projectImage).toHaveAttribute('width', '800');
    expect(projectImage).toHaveAttribute('height', '600');
  });

  it('should have lazy loading on project image', () => {
    render(<ProjectCard project={mockProject} index={0} />);
    const projectImage = screen.getByAltText(/test project/i);
    expect(projectImage).toHaveAttribute('loading', 'lazy');
  });

  it('should render project title', () => {
    render(<ProjectCard project={mockProject} index={0} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('should render project category', () => {
    render(<ProjectCard project={mockProject} index={0} />);
    expect(screen.getByText('Web Application')).toBeInTheDocument();
  });
});
