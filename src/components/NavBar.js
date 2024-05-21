import React from "react";
import { Dropdown, Navbar, Button } from "flowbite-react";

const NavBar = ({ selectedLanguage, onLanguageSelect,selectedTheme, onThemeSelect}) => {
  const handleSelectLanguage = (language) => {
    onLanguageSelect(language);
  };
  const  handleSelectTheme = (theme) =>{
    onThemeSelect(theme);
  }

  return (
    <Navbar fluid>
      <Navbar.Brand>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-large">
          Rapid Judge
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2 text-white">
        <Button>
        <Dropdown arrowIcon={false} inline label={selectedLanguage}>
          <Dropdown.Item onClick={() => handleSelectLanguage("javascript")}>
            JavaScript
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSelectLanguage("python")}>
            Python
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSelectLanguage("c")}>
            C
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSelectLanguage("cpp")}>
            C++
          </Dropdown.Item>
        </Dropdown>
        </Button>
      </div>
     <Dropdown label={selectedTheme} dismissOnClick={false}>
      <Dropdown.Item onClick={()=> handleSelectTheme("vs-dark")}>vs-dark</Dropdown.Item>
      <Dropdown.Item onClick={()=> handleSelectTheme("hc-black")}>hc-black</Dropdown.Item>
      <Dropdown.Item onClick={()=> handleSelectTheme("hc-light")}>hc-light</Dropdown.Item>
      {/* <Dropdown.Item onClick={()=> handleSelectTheme("monokai")}>monokai</Dropdown.Item> */}
    </Dropdown>
    </Navbar>
  );
};

export default NavBar;
