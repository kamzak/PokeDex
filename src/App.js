import React, { useEffect, useRef, useState } from "react";
import classes from "./App.module.css";
import "animate.css";
import Modal from "./components/UI/Modal";
import logo from "./static/logo.png";
import searchIcon from "./static/search.png";
import lightIcon from "./static/light.png";
import errorIcon from "./static/error-icon.png";
import { typeColors, typeTextColors } from "./helpers/typesColors";

const limit = 20;

const typeDefault = {
  type: {
    name: 1,
  },
};

function App() {
  const [allData, setAllData] = useState([]);
  const [typesData, setTypesData] = useState([]);
  const [offset, setOffset] = useState(20);
  const [responseUrl, setResponseUrl] = useState(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
  );
  const [show, setShow] = useState(false);
  const [modalIndex, setModalIndex] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("bug");
  const [bg, setBg] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [disableFilter, setDisableFilter] = useState(false);
  const [disableAllFilter, setDisableAllFilter] = useState(false);
  const [allPokemons, setAllPokemons] = useState([]);
  const [showAllPokemons, setShowAllPokemons] = useState([]);
  const [filterAll, setFilterAll] = useState(false);

  const searchRef = useRef();

  const onTypeChange = (e) => {
    setFilter(e.target.value);
  };

  async function fetchPokemonsHandler() {
    setIsLoading(true);
    setDisableFilter(true);
    const response = await fetch(responseUrl);
    const data = await response.json();

    const transformedPokemons = data.results.map((pokes) => {
      return {
        name: pokes.name,
      };
    });

    for (let i = 0; i < transformedPokemons.length; i++) {
      const responseTypes = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${transformedPokemons[i].name}`
      );
      const data = await responseTypes.json();

      let tempName = "";
      // Problem in API
      if (transformedPokemons[i].name === "deoxys-normal") {
        tempName = "deoxys";
      } else if (transformedPokemons[i].name === "wormadam-plant") {
        tempName = "wormadam";
      } else if (transformedPokemons[i].name === "giratina-altered") {
        tempName = "giratina";
      } else {
        tempName = transformedPokemons[i].name;
      }
      const responseSpecies = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${tempName}`
      );
      const species = await responseSpecies.json();
      let desc = "";
      species.flavor_text_entries.some((flavor) => {
        if (flavor.language.name === "en") {
          desc = flavor.flavor_text;
        }
      });

      setAllData((prevState) => [
        ...prevState,
        {
          name: transformedPokemons[i].name,
          types: [...data.types, typeDefault],
          sprite: data.sprites.front_default,
          height: data.height,
          weight: data.weight,
          description: desc,
        },
      ]);

      if (i === transformedPokemons.length - 1) {
        setIsLoading(false);
        setDisableFilter(false);
      }
    }
    if (allData.length !== 0) {
      setIsLoading(false);
      setDisableFilter(false);
    }
  }

  async function fetchAllPokemonsHandler() {
    setIsLoading(true);
    setDisableAllFilter(true);
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=400");
    const data = await response.json();

    const transformedPokemons = data.results.map((pokes) => {
      return {
        name: pokes.name,
      };
    });
    var firstArray = [];

    for (let i = 0; i < transformedPokemons.length; i++) {
      const responseTypes = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${transformedPokemons[i].name}`
      );
      const data = await responseTypes.json();

      let tempName = "";
      // Problem in API
      if (transformedPokemons[i].name === "deoxys-normal") {
        tempName = "deoxys";
      } else if (transformedPokemons[i].name === "wormadam-plant") {
        tempName = "wormadam";
      } else if (transformedPokemons[i].name === "giratina-altered") {
        tempName = "giratina";
      } else {
        tempName = transformedPokemons[i].name;
      }
      const responseSpecies = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${tempName}`
      );
      const species = await responseSpecies.json();
      let desc = "";
      species.flavor_text_entries.some((flavor) => {
        if (flavor.language.name === "en") {
          desc = flavor.flavor_text;
        }
      });

      firstArray.push({
        name: transformedPokemons[i].name,
        types: [...data.types, typeDefault],
        sprite: data.sprites.front_default,
        height: data.height,
        weight: data.weight,
        description: desc,
      });

      if (i === transformedPokemons.length - 1) {
        setIsLoading(false);
        setDisableAllFilter(false);
      }
    }
    setAllPokemons(firstArray);
    if (allPokemons.length !== 0) {
      setIsLoading(false);
      setDisableAllFilter(false);
    }
  }

  const loadMoreHandler = () => {
    setIsLoading(true);
    setDisableFilter(true);
    setDisableAllFilter(true);
    setFilterAll(false);
    console.log(allData);
    console.log(allPokemons);

    setResponseUrl(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    setOffset((prevState) => prevState + 20);
  };

  const showModal = () => {
    setShow((prevState) => !prevState);
  };

  const hideErrorModal = () => {
    setErrorModal(false);
  };

  const modalIndexHandler = (index) => {
    setModalIndex(index);
  };
  const searchPokemon = async (e) => {
    e.preventDefault();
    setFilterAll(false);
    try {
      const searchPhrase = searchRef.current.value;
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchPhrase.toLowerCase()}`
      );
      const data = await response.json();

      const responseSpecies = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${searchPhrase.toLowerCase()}`
      );
      const species = await responseSpecies.json();
      let desc = "";
      species.flavor_text_entries.some((flavor) => {
        if (flavor.language.name === "en") {
          desc = flavor.flavor_text;
        }
      });

      setAllData(() => [
        {
          name: data.name,
          types: [...data.types, typeDefault],
          sprite: data.sprites.front_default,
          height: data.height,
          weight: data.weight,
          description: desc,
        },
      ]);
    } catch (err) {
      setErrorModal((prevState) => !prevState);
    }
  };

  const loadTypes = async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/type/`);
    const data = await response.json();
    const transformedTypes = data.results.map((pokes) => {
      return pokes.name;
    });
    setTypesData(transformedTypes);
  };

  const filterPokemon = async (e) => {
    e.preventDefault();
    setAllData([]);

    allData.forEach((e, i) => {
      if (
        allData[i].types[0].type.name === filter.toLowerCase() ||
        allData[i].types[1].type.name === filter.toLowerCase()
      ) {
        setAllData((prevState) => [
          ...prevState,
          {
            name: e.name,
            types: [...e.types],
            sprite: e.sprite,
            height: e.height,
            weight: e.weight,
            description: e.description,
          },
        ]);
      }
    });
  };

  const filterAllPokemons = async (e) => {
    e.preventDefault();
    setShowAllPokemons([]);
    setAllData([]);
    setFilterAll(true);

    allPokemons.forEach((e, i) => {
      if (
        allPokemons[i].types[0].type.name === filter.toLowerCase() ||
        allPokemons[i].types[1].type.name === filter.toLowerCase()
      ) {
        setShowAllPokemons((prevState) => [
          ...prevState,
          {
            name: e.name,
            types: [...e.types],
            sprite: e.sprite,
            height: e.height,
            weight: e.weight,
            description: e.description,
          },
        ]);
      }
    });
  };
  const bgClasses = bg ? "" : classes.dark;
  const navClasses = bg ? "" : classes.darkNav;
  const contClasses = bg ? "" : classes.darkCont;
  const cardClasses = bg ? classes.pokeCard : classes.darkCard;
  const typeClasses = bg ? "" : classes.darkType;
  const buttonClasses = bg ? "" : classes.darkButton;

  const changeColors = () => {
    setBg((prevState) => !prevState);
  };

  useEffect(() => {
    fetchAllPokemonsHandler();
    fetchPokemonsHandler();
    loadTypes();
  }, [responseUrl]);

  return (
    <div className={bgClasses}>
      <nav className={`${classes.nav} ${navClasses}`}>
        <img
          className={`${classes.logo} animate__animated animate__lightSpeedInRight`}
          src={logo}
          alt="logo"
        />
        <label className={classes.switch}>
          <img
            src={lightIcon}
            alt="darkLightIcon"
            className={classes.darkLightIcon}
          />
          <input
            className={classes.switchInput}
            type="checkbox"
            onClick={changeColors}
          />
          <span className={`${classes.slider} ${classes.round}`}></span>
        </label>
        <form className={classes.searchForm}>
          <input
            ref={searchRef}
            placeholder="Type in name or number..."
            type="text"
            className={classes.searchInput}
          />
          <img
            alt="searchIcon"
            className={classes.searchIcon}
            src={searchIcon}
          />
          <button
            className={`${classes.searchButton} ${buttonClasses}`}
            onClick={searchPokemon}
          >
            SEARCH
          </button>
          {errorModal && (
            <Modal class={classes.errorModal} onClose={hideErrorModal}>
              <img src={errorIcon} alt="errorIcon" />
              <span>There is no such pokemon!</span>
            </Modal>
          )}
        </form>
      </nav>
      <div className={`${classes.container} ${contClasses}`}>
        <div className={`${classes.typesButtons} ${typeClasses}`}>
          <label htmlFor="type-select">Type:</label>
          <select id="type-select" onChange={onTypeChange}>
            {typesData.sort().map((el) => {
              return (
                <option
                  style={{
                    backgroundColor: typeColors[el],
                    color: typeTextColors[el],
                  }}
                >
                  {el.toUpperCase()}
                </option>
              );
            })}
          </select>
          <button
            className={`${classes.searchButton} ${buttonClasses}`}
            onClick={filterPokemon}
            disabled={disableFilter}
          >
            Filter
          </button>
          <button
            className={`${classes.searchButton} ${buttonClasses}`}
            onClick={filterAllPokemons}
            disabled={disableAllFilter}
          >
            {disableAllFilter && (<div>
              <div className={classes["lds-ring"]}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              Filter all
              </div>
            )}
            {!disableAllFilter && <span>Filter all</span>}
          </button>
        </div>
        <ul className={classes.pokedex}>
          {!filterAll &&
            allData.map((el, i) => {
              return (
                <li
                  className={`${cardClasses} animate__animated animate__backInUp`}
                  key={i}
                >
                  <div
                    key={i}
                    onClick={() => {
                      showModal();
                      modalIndexHandler(i);
                    }}
                  >
                    <img key={i} src={el.sprite} alt="" />
                  </div>
                  <p className={classes.name}>{el.name}</p>
                  <div className={classes.types}>
                    {el.types.map((typy, j) => {
                      return (
                        <span
                          className={classes.type}
                          style={{
                            backgroundColor: typeColors[typy.type.name],
                            color: typeTextColors[typy.type.name],
                          }}
                          key={j}
                        >
                          {typy.type.name}
                        </span>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          {filterAll &&
            showAllPokemons.map((el, i) => {
              return (
                <li
                  className={`${cardClasses} animate__animated animate__backInUp`}
                  key={i}
                >
                  <div
                    key={i}
                    onClick={() => {
                      showModal();
                      modalIndexHandler(i);
                    }}
                  >
                    <img key={i} src={el.sprite} alt="" />
                  </div>
                  <p className={classes.name}>{el.name}</p>
                  <div className={classes.types}>
                    {el.types.map((typy, j) => {
                      return (
                        <span
                          className={classes.type}
                          style={{
                            backgroundColor: typeColors[typy.type.name],
                            color: typeTextColors[typy.type.name],
                          }}
                          key={j}
                        >
                          {typy.type.name}
                        </span>
                      );
                    })}
                  </div>
                </li>
              );
            })}
        </ul>
        {show && !filterAll && (
          <Modal
            typeColor={typeColors[allData[modalIndex].types[0].type.name]}
            onClose={showModal}
          >
            <img
              className={classes.spriteModal}
              src={allData[modalIndex].sprite}
              alt=""
            />
            <p className={classes.nameModal}>{allData[modalIndex].name}</p>
            <div className={classes.typesModal}>
              {allData[modalIndex].types.map((typy, j) => {
                return (
                  <span
                    className={classes.typeModal}
                    style={{
                      backgroundColor: typeColors[typy.type.name],
                      color: typeTextColors[typy.type.name],
                    }}
                    key={j}
                  >
                    {typy.type.name}
                  </span>
                );
              })}
            </div>
            <p className={classes.paramsModal}>
              <span style={{ fontWeight: "bold" }}>Height:</span>{" "}
              {allData[modalIndex].height}
            </p>
            <p className={classes.paramsModal}>
              <span style={{ fontWeight: "bold" }}>Weight: </span>
              {allData[modalIndex].weight}
            </p>
            <div className={classes.paramsModal} style={{ fontWeight: "bold" }}>
              Description
            </div>
            <div className={classes.desc}>
              {allData[modalIndex].description}
            </div>
          </Modal>
        )}
        {show && filterAll && (
          <Modal
            typeColor={
              typeColors[showAllPokemons[modalIndex].types[0].type.name]
            }
            onClose={showModal}
          >
            <img
              className={classes.spriteModal}
              src={showAllPokemons[modalIndex].sprite}
              alt=""
            />
            <p className={classes.nameModal}>
              {showAllPokemons[modalIndex].name}
            </p>
            <div className={classes.typesModal}>
              {showAllPokemons[modalIndex].types.map((typy, j) => {
                return (
                  <span
                    className={classes.typeModal}
                    style={{
                      backgroundColor: typeColors[typy.type.name],
                      color: typeTextColors[typy.type.name],
                    }}
                    key={j}
                  >
                    {typy.type.name}
                  </span>
                );
              })}
            </div>
            <p className={classes.paramsModal}>
              <span style={{ fontWeight: "bold" }}>Height:</span>{" "}
              {showAllPokemons[modalIndex].height}
            </p>
            <p className={classes.paramsModal}>
              <span style={{ fontWeight: "bold" }}>Weight: </span>
              {showAllPokemons[modalIndex].weight}
            </p>
            <div className={classes.paramsModal} style={{ fontWeight: "bold" }}>
              Description
            </div>
            <div className={classes.desc}>
              {showAllPokemons[modalIndex].description}
            </div>
          </Modal>
        )}
        {isLoading && (
          <div className={classes["skDouble"]}>
            <div
              className={`${classes["sk-child"]} ${classes["skDouble"]}`}
            ></div>
            <div
              className={`${classes["sk-child"]} ${classes["sk-double-bounce-2"]}`}
            ></div>
          </div>
        )}
        {showAllPokemons.length === 0 && !isLoading && filterAll && (
          <p className={classes.notFound}>Pokemon not found...</p>
        )}
        {allData.length === 0 && !isLoading && !filterAll && (
          <p className={classes.notFound}>Pokemon not found...</p>
        )}
        <button
          className={`${classes.loadMore} ${buttonClasses}`}
          onClick={loadMoreHandler}
        >
          Load more
        </button>
      </div>
    </div>
  );
}

export default App;
