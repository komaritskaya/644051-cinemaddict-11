import FilmCardComponent from "../components/film-card.js";
import FilmDetailsComponent from "../components/film-details.js";
import {render, replace, remove} from "../utils/render.js";
import {KeyCode} from '../utils/common';

const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};

const renderComments = (filmDetailsComponent, film) => {
  const comments = generateComments(film.commentsCount);
  const commentsListElement = filmDetailsComponent.getElement().querySelector(`.film-details__comments-list`);
  comments.slice(0, comments.length)
    .forEach((comment) => render(commentsListElement, new Comment(comment)));
};

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._mode = Mode.DEFAULT;

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    console.log(this._filmDetailsComponent);

    this._filmCardComponent.setWatchListButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isInWatchList: !film.isInWatchList,
      }));
    });

    this._filmCardComponent.setWatchedButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatched: !film.isWatched,
      }));
    });

    this._filmCardComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
    });

    this._filmDetailsComponent.setWatchListInputClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isInWatchList: !film.isInWatchList,
      }));
      console.log(film);
    });

    this._filmDetailsComponent.setWatchedInputClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatched: !film.isWatched,
      }));
    });

    this._filmDetailsComponent.setFavoriteInputClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
    });

    this._filmCardComponent.setDetailsOpenersClickHandler(() => {
      this._openDetails();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmDetailsComponent.setCloseButtonClickHandler(() => {
      this._closeDetails();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    render(this._container, this._filmCardComponent);
  }

  _openDetails() {
    const bodyElement = document.querySelector(`body`);
    render(bodyElement, this._filmDetailsComponent);
    // bodyElement.appendChild(filmDetailsComponent.getElement());
    // document.addEventListener(`keydown`, this._onEscKeyDown);
    // renderComments(this._filmDetailsComponent, film);
    this._mode = Mode.DETAILS;
  }

  _closeDetails() {
    remove(this._filmDetailsComponent);
    // document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.keyCode === KeyCode.ESC_KEY;

    if (isEscKey) {
      remove(this._filmDetailsComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
