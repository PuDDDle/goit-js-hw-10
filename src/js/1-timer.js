import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysEl = document.querySelector('.value[data-days]');
const hoursEl = document.querySelector('.value[data-hours]');
const minutesEl = document.querySelector('.value[data-minutes]');
const secondsEl = document.querySelector('.value[data-seconds]');

let userSelectedDate;
let timerInterval;
startBtn.disabled = true;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    // Отримуємо поточну дату
    const currentDate = new Date();
    if (userSelectedDate.getTime() <= currentDate.getTime()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future!',
        position: 'topRight',
      });
    }
    startBtn.disabled = false;
  },
};
flatpickr(datetimePicker, options);

const timer = {
  start() {
    if (!userSelectedDate || timerInterval) {
      return;
    }
    // Блокуємо інпут при старті таймера
    datetimePicker.disabled = true;

    timerInterval = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = userSelectedDate - currentTime;

      if (deltaTime <= 0) {
        clearInterval(timerInterval);
        timerInterval = null; // Скидаємо змінну після завершення таймера
        updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        // Розблоковуємо інпут і кнопку після закінчення таймера
        datetimePicker.disabled = false;
        startBtn.disabled = false;
      } else {
        const timeComponents = convertMs(deltaTime);
        updateTimer(timeComponents);
      }
    }, 1000);
  },
};

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  if (userSelectedDate) {
    timer.start();
  }
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
  daysEl.textContent = days;
  hoursEl.textContent = hours;
  minutesEl.textContent = minutes;
  secondsEl.textContent = seconds;
}
