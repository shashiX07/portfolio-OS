import React from 'react';
import { User, Download, Code, Briefcase, GraduationCap } from 'lucide-react';

export const AboutApp: React.FC<{ windowId: string }> = () => {
  const skills = [
    { name: 'React/TypeScript', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'Python', level: 80 },
    { name: 'UI/UX Design', level: 75 },
    { name: 'Cloud Services', level: 85 }
  ];

  const handleDownloadResume = () => {
    // Create a link element to trigger download
    const link = document.createElement('a');
    link.href = '/Resume.pdf'; // Path to your resume in public folder
    link.download = 'Shashikant_Resume.pdf'; // Name for downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 h-full">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Shashikant</h1>
          <p className="text-muted-foreground">Full Stack Developer & UI/UX Designer</p>
        </div>

        {/* Bio */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            About Me
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Passionate full-stack developer with expertise in modern web technologies. 
            I love creating innovative solutions and beautiful user experiences. 
            Currently focused on React, TypeScript, and cloud technologies.
          </p>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5" />
            Skills
          </h2>
          <div className="space-y-3">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Education
          </h2>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium">Agricultural and Food Engineering</h3>
            <p className="text-sm text-muted-foreground">Indian Institute of Technology, Kharagpur • 2024-2028</p>
            <p className="text-sm mt-2">will graduate with honors, specialized in software engineering and web development.</p>
          </div>
        </div>

        {/* Download Resume */}
        <div className="text-center">
          <button 
            onClick={handleDownloadResume}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </button>
        </div>
      </div>
    </div>
  );
};