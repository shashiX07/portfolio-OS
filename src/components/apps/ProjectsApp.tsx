
import React, { useState } from 'react';
import { ExternalLink, Github, Eye, Code } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
}

export const ProjectsApp: React.FC<{ windowId: string }> = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: '1',
      title: 'Niblie - Web Extension',
      description: 'Niblie is a cute and powerful Chrome extension that helps you analyze the visible content on any web page.',
      image: 'images/Niblie.jpg',
      technologies: ['Javascript', 'Node.js', 'Memory Management', 'UI/UX'],
      githubUrl: 'https://github.com/shashix07/Niblie',
      liveUrl: 'https://github.com/shashix07/Niblie',
      featured: true
    },
    {
      id: '2',
      title: 'Expense Tracker',
      description: 'Modern UI platfrom to for managing income and Expenses',
      image: 'images/expense.png',
      technologies: ['React', 'chartjs', 'memory management', 'vite'],
      githubUrl: 'https://github.com/shashiX07/expanse-tracker',
      liveUrl: 'https://expanse-tracker-mocha.vercel.app',
      featured: true
    },
    {
      id: '3',
      title: 'NixOS : Web Based Presentation',
      description: 'web based PPT using open source framework RevealJS',
      image: 'images/nixOS.png',
      technologies: ['React', 'TypeScript', 'OpenWeather API', 'Chart.js'],
      githubUrl: 'https://github.com/shashix07/nixos',
      liveUrl: 'https://shashix07.github.io/nixos/',
      featured: false
    }
  ];

  return (
    <div className="p-6 h-full">
      {!selectedProject ? (
        <div>
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Code className="w-6 h-6" />
            My Projects
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {project.featured && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                      Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech}
                        className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                      <Github className="w-4 h-4" />
                      Code
                    </button>
                    <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button 
            onClick={() => setSelectedProject(null)}
            className="mb-4 text-primary hover:underline"
          >
            ← Back to Projects
          </button>
          
          <div className="max-w-4xl">
            <img 
              src={selectedProject.image} 
              alt={selectedProject.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            
            <h1 className="text-3xl font-bold mb-4">{selectedProject.title}</h1>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {selectedProject.description}
            </p>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech) => (
                  <span 
                    key={tech}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4">
              <a 
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Github className="w-4 h-4" />
                View Code
              </a>
              <a 
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
