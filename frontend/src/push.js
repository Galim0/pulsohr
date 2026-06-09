const API = 'http://127.0.0.1:8000';

export async function subscribeToPush(userId) {
  try {
    // Запрашиваем разрешение
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Разрешение не дано');
      return;
    }

    // Регистрируем service worker
    const reg = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    // Получаем публичный ключ с сервера
    const res = await fetch(`${API}/push/public-key`);
    const { public_key } = await res.json();

    // Конвертируем ключ
    const key = urlBase64ToUint8Array(public_key);

    // Подписываемся
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: key
    });

    const subJson = sub.toJSON();

    // Отправляем подписку на сервер
    await fetch(`${API}/push/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: subJson.endpoint,
        p256dh: subJson.keys.p256dh,
        auth: subJson.keys.auth,
        user_id: userId
      })
    });

    console.log('Push подписка оформлена!');
  } catch (e) {
    console.error('Ошибка подписки:', e);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(c => c.charCodeAt(0)));
}