import { useState } from 'react';
import Project from "../Project";

function Portfolio() {

  // Replace links with deployed projects and GitHub repos
  const [projects] = useState([
    {
      name: 'aiTTRPG',
      description: 'React App utilizing AI to generate content for Table-Top RPGs',
      // link: "https://github.com",
      repo: "https://github.com/AJRead13/ttrpg-prompts"
    },
    {
      name: 'dungeonsnotes',
      description: 'MERN Stack application to create a character for a TTRPG and keep notes for that character',
      // link: "https://github.com",
      repo: "https://github.com/AJRead13/dungeons_notes_dragons"
    },
    {
      name: 'jate',
      description: 'PWA/Webpack A text editor you can install',
      // link: "https://github.com",
      repo: "https://github.com/AJRead13/Text_Editor_Xtreme"
    },
    {
      name: 'moviesToComics',
      description: 'Javascript/CSS/APIs Application to search for movies and find relavent comics about the movie',
      link: "https://ajread13.github.io/Movie-Hype-Generator/",
      repo: "https://github.com/AJRead13/Movie-Hype-Generator"
    },
    {
      name: 'readMe',
      description: 'Node/Javascript application used to create high quality readMes for projects',
      // link: "https://github.com",
      repo: "https://github.com/AJRead13/Node_ReadMe_Generator"
    },
  ]);

  return (
    <div>
      <div className="flex-row">
        {projects.map((project, idx) => (
          <Project
            project={project}
            key={"project" + idx}
          />
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
