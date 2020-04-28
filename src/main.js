import UserInfoComponent from './components/user-info';
import MainNavigationComponent from './components/main-navigation';
import SortComponent from './components/sort';
import FilmsSectionComponent from './components/films-section';
import FilmsCountComponent from './components/films-count';
import AllFilmsContainerComponent from './components/all-films-container';
import ExtraFilmsContainerComponent from './components/extra-films-container';
import NoFilmsComponent from './components/no-films';
import Comment from './components/comment';
import FilmCardComponent from './components/film-card';
import FilmDetailsComponent from './components/film-details';
import ShowMoreButtonComponent from './components/show-more-btn';
import {generateComments} from './mock/comment';
import {KeyCode} from "./utils/common";
import {render, remove} from "./utils/render";
import PageController from "./controllers/page.js";
import {generateFilms} from './mock/film-card';
import {generateFilters} from './mock/filter';

const ALL_FILMS_COUNT = 23;
const SHOWING_ALL_FILMS_COUNT_ON_START = 5;
const SHOWING_ALL_FILMS_COUNT_BY_BUTTON = 5;
const EXTRA_FILMS_COUNT = 2;
const EXTRA_FILMS_LISTS = [`Top rated`, `Most commented`];

const allFilms = generateFilms(ALL_FILMS_COUNT);
const filters = generateFilters();

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);
const mainElement = bodyElement.querySelector(`.main`);

render(headerElement, new UserInfoComponent());
render(mainElement, new MainNavigationComponent(filters));
render(mainElement, new SortComponent());
render(mainElement, new FilmsSectionComponent());

const filmsSectionElement = mainElement.querySelector(`.films`);
// const pageController = new PageController(allFilmsContainerComponent);
// pageController.render(filmsSectionElement, allFilms);

const renderComments = (filmDetailsComponent, film) => {
  const comments = generateComments(film.commentsCount);
  const commentsListElement = filmDetailsComponent.getElement().querySelector(`.film-details__comments-list`);
  comments.slice(0, comments.length)
  .forEach((comment) => render(commentsListElement, new Comment(comment)));
}

const renderFilm = (filmsListElement, film) => {
  const onOpenButtonClick = () => {
    bodyElement.appendChild(filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const onCloseButtonClick = () => {
    remove(filmDetailsComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.keyCode === KeyCode.ESC_KEY;

    if (isEscKey) {
      remove(filmDetailsComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const filmCardComponent = new FilmCardComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);

  filmCardComponent.setDetailsOpenersClickHandler(onOpenButtonClick);
  filmDetailsComponent.setCloseButtonClickHandler(onCloseButtonClick);

  renderComments(filmDetailsComponent, film);

  render(filmsListElement, filmCardComponent);
};

const renderAllFilmsList = (filmsContainerComponent, films) => {
  let showingAllFilmsCount = SHOWING_ALL_FILMS_COUNT_ON_START;
  const filmsContainerElement = filmsContainerComponent.getElement().querySelector(`.films-list__container`);

  films.slice(0, showingAllFilmsCount)
  .forEach((film) => renderFilm(filmsContainerElement, film));

  const allFilmsListElement = filmsSectionElement.querySelector(`.films-list`);

  const showMoreButtonComponent = new ShowMoreButtonComponent();
  render(allFilmsListElement, showMoreButtonComponent);

  showMoreButtonComponent.setClickHandler(() => {
    const prevAllFilmsCount = showingAllFilmsCount;
    showingAllFilmsCount = prevAllFilmsCount + SHOWING_ALL_FILMS_COUNT_BY_BUTTON;

    allFilms.slice(prevAllFilmsCount, showingAllFilmsCount)
    .forEach((film) => renderFilm(filmsContainerElement, film));

    if (showingAllFilmsCount >= allFilms.length) {
      remove(showMoreButtonComponent);
    }
  });
};

const renderExtraFilmsList = (filmsContainerComponent, films) => {
  let showingExtraFilmsCount = EXTRA_FILMS_COUNT;
  const filmsContainerElement = filmsContainerComponent.getElement().querySelector(`.films-list__container`);

  films.slice(0, showingExtraFilmsCount)
    .forEach((film) => renderFilm(filmsContainerElement, film));
};

const renderFilmsSection = (filmsSectionElement, films) => {
  const allFilmsContainerComponent = new AllFilmsContainerComponent();
  const noFilmsComponent = new NoFilmsComponent();
  render(filmsSectionElement, allFilmsContainerComponent);

  if (films.length) {
    renderAllFilmsList(allFilmsContainerComponent, films);

    EXTRA_FILMS_LISTS.forEach((list) => {
      const extraFilmsContainerComponent = new ExtraFilmsContainerComponent(list);
      const extraFilms = generateFilms(EXTRA_FILMS_COUNT);
      render(filmsSectionElement, extraFilmsContainerComponent);
      renderExtraFilmsList(extraFilmsContainerComponent, extraFilms);
    });
  } else {
    render(filmsSectionElement, noFilmsComponent);
  }
}

renderFilmsSection(filmsSectionElement,allFilms);

const footerStatisticsElement = document.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FilmsCountComponent(ALL_FILMS_COUNT));

