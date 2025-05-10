import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let intervalId = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];
    if (selected <= new Date()) {
      iziToast.error({
        title: 'Ошибка',
        message: 'Пожалуйста, выбери дату в будущем',
        position: 'topRight',
        timeout: 3000,
      });
      startBtn.disabled = true;
    } else {
      userSelectedDate = selected;
      startBtn.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  input.disabled = true;

  intervalId = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      clearInterval(intervalId);
      input.disabled = false;
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      iziToast.success({
        title: 'Готово!',
        message: 'Обратный отсчет завершен',
        position: 'topRight',
        timeout: 3000,
      });

      return;
    }

    const time = convertMs(diff);
    updateTimer(time);
  }, 1000);
});

function updateTimer({ days, hours, minutes, seconds }) {
  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
