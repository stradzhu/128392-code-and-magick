'use strict';

window.form = (function() {
  var formContainer = document.querySelector('.overlay-container');
  var formCloseButton = document.querySelector('.review-form-close');

  var form = {
    onClose: null,

    /**
     * @param {Function} cb
     */
    open: function(cb) {
      formContainer.classList.remove('invisible');
      cb();
    },

    close: function() {
      formContainer.classList.add('invisible');

      if (typeof this.onClose === 'function') {
        this.onClose();
      }
    }
  };


  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    form.close();
  };

  return form;
})();

var reviewFormGroupMark = document.querySelector('.review-form-group-mark');
var reviewNameField = document.getElementById('review-name');
var reviewTextField = document.getElementById('review-text');

reviewNameField.oninput = goValidate;
reviewTextField.oninput = goValidate;

// Узнаю куда кликнули, сделал через делегирование просто чтобы попробовать.
// Да и вдруг у нас в будущем изменится количество звездочек для рейтинга.
reviewFormGroupMark.onclick = (function(event) {
  var target = event.target;
  while (target !== this) {
    if (target.name === 'review-mark') {
      goValidate();
      return;
    }
    target = target.parentNode;
  }
});

//Вызываю функцию, чтобы установить начальные значения
goValidate();

function goValidate() {
  var MIN_NAME_LENGTH = 2;
  var MIN_MARK_TEXT_REQUIRED = 3;

  var reviewMarkRadioValue = document.querySelector('input[name="review-mark"]:checked').value;
  var reviewSubmitButton = document.querySelector('.review-submit');
  var reviewFieldsBlock = document.querySelector('.review-fields');
  var reviewNameLabel = reviewFieldsBlock.querySelector('label[for="review-name"]');
  var reviewTextLabel = reviewFieldsBlock.querySelector('label[for="review-text"]');

  // Кнопка "Добавить отзыв"
  if (((reviewMarkRadioValue < MIN_MARK_TEXT_REQUIRED) && (reviewNameField.value.length >= MIN_NAME_LENGTH) && (reviewTextField.value.length > 0)) ||
    ((reviewMarkRadioValue >= MIN_MARK_TEXT_REQUIRED) && (reviewNameField.value.length >= MIN_NAME_LENGTH))) {
    reviewSubmitButton.removeAttribute('disabled');
  } else {
    reviewSubmitButton.setAttribute('disabled', '');
  }

  //Поле "Имя" блока "Осталось заполнить"
  if (reviewNameField.value.length < MIN_NAME_LENGTH) {
    controlVisible(reviewNameLabel, true);
  } else {
    controlVisible(reviewNameLabel, false);
  }

  //Поле "Отзыв" блока "Осталось заполнить"
  if ((reviewTextField.value.length === 0) && (reviewMarkRadioValue < MIN_MARK_TEXT_REQUIRED)) {
    controlVisible(reviewTextLabel, true);
  } else {
    controlVisible(reviewTextLabel, false);
  }

  //Блок "Осталось заполнить"

  if (controlVisible(reviewNameLabel) || controlVisible(reviewTextLabel)) {
    controlVisible(reviewFieldsBlock, true);
  } else {
    controlVisible(reviewFieldsBlock, false);
  }
}

// Если в функцию передать один параметр "elem", то функция вернёт true или false в зависимости видел ли данный элемент
// Вторым параметров в функцию можно передать true или false, чтобы показать или скрыть элемент
function controlVisible(elem, flag) {
  var answer;
  if (typeof flag === 'undefined') {
    if (window.getComputedStyle(elem).display !== 'none') {
      answer = true;
    } else {
      answer = false;
    }
  } else {
    if (flag) {
      elem.classList.remove('invisible');
    } else {
      elem.classList.add('invisible');
    }
  }
  return answer;
}
