import * as moment from 'moment';

export const createCommentTemplate = (comment) => {
  const {user, emoji, date, text} = comment;
  const relativeDate = moment(date).format(`YYYY/MM/DD hh:mm`);
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${user}</span>
          <span class="film-details__comment-day">${relativeDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};
