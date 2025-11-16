import coverImage from '../../assets/cover/midnight_nation_cover.png';

function Header(props) {

  return (
    <header className="flex-row space-between px-1">
      <h1>Midnight Nation RPG</h1>
      <img src={coverImage} alt="midnight nation banner"></img>
      {props.children}
    </header>
  );
}

export default Header;
