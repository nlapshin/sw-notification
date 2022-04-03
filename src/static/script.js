// Получает public key
const vapidPublicKey = 'BOQO2527g_d3YKTVqmJbkHpRL5UkRF9sow23anTzqCd_PDM93d5wMga-dkcQ3o42mnbsyxEzFdNpXFzql8EfLPk';

// Проверяем поддержку Notification
if (("Notification" in window)) {
  Notification.requestPermission(() => {
    if (Notification.permission === 'granted') {
      getSubscriptionObject()
        .then(subscribe)
    }
  });
}

// Функция регистрация воркера
function getSubscriptionObject() {
  return navigator.serviceWorker.register('./worker.js').then((worker) => {
    return worker.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: toUint8Array(vapidPublicKey)
      });
  });
}

// Функция запроса к серверу
function subscribe(subscription) {
  return fetch('http://localhost:5000/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
}

function toUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
