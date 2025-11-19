function Footer() {

  // Replace links with social media profiles
  const icons = [
    {
      name: "fab fa-github",
      link: "https://github.com/AJRead13/"
    },
    {
      name: "fab fa-linkedin",
      link: "https://www.linkedin.com/in/andrewjread"
    },
    {
      name: "fab fa-discord",
      link: "https://discord.gg/7h4btsMy"
    },
    {
      name: "fab fa-instagram",
      link: "https://www.instagram.com/"
    },
    {
      name: "fab fa-x-twitter",
      link: "https://twitter.com/"
    },
    {
      name: "fab fa-patreon",
      link: "https://www.patreon.com/"
    }
  ]

  return (
    <footer className="flex-row px-1">
      {icons.map(icon =>
      (
        <a href={icon.link} key={icon.name} target="_blank" rel="noopener noreferrer"><i className={icon.name}></i></a>
      )
        )}
    </footer>
  );
}

export default Footer;
