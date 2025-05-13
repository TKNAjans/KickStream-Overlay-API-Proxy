# 🎥 KickStream Overlay & API Proxy

Kick.com için canlı sohbeti tarayıcıda gösteren, emote desteği olan, yayınlara entegre edilebilen bir chat overlay sistemi + proxy destekli API sunucusu.

## 🚀 Özellikler

- ✅ Kick WebSocket bağlantısı (chatrooms.CHANNELID.v2)
- ✅ Emote gösterimi ([emote:ID:NAME] formatında)
- ✅ Animasyonlu mesaj akışı (soldan veya sağdan giriş)
- ✅ Dinamik font boyutu (`?fontsize=20`)
- ✅ Otomatik yeniden bağlanma
- ✅ Playwright ile tüm API uç noktalarına erişim (CORS engeli yok)
- ✅ Sade, gölgelendirilmiş yazı tasarımı – OBS için birebir
- ✅ HTML/CSS sade yapıda – özelleştirilebilir

---

### 🎤 Canlı Chat Ekranı

- `:username` → Kick kullanıcı adı
- `fontsize` → yazı boyutu
- `animation=left|right` → mesaj giriş yönü

### 💬 Emote Formatı
Kick chat mesajları şu şekilde gelir:

---

## 📦 API Proxy Uç Noktaları

Tüm Kick API’lerini `Playwright` üzerinden çekerek CORS engelini aşar:

| Uç Nokta | Açıklama |
|---------|----------|
| `/api/channel/:username` | Kullanıcı bilgisi |
| `/api/channel/:username/livestream` | Canlı yayın bilgisi |
| `/api/channel/:username/chatroom` | Chatroom ID |
| `/api/channel/:username/videos` | Kanal videoları |
| `/api/channel/:username/emotes` | Emote listesi |
| `/api/viewers/:channelId` | Anlık izleyici sayısı |
| `/api/channel/:username/leaderboards` | Bağış liderleri |
| `/api/channel/:username/messages` | Son mesajlar |
| `/api/channel/:username/goals` | Hedefler |
| `/api/channel/:username/polls` | Anketler |
| `/api/channel/:channelId/user/:userId/identity` | Kullanıcı kimliği |
| ...ve daha fazlası ✅ |

---

## 🧪 Başlatma

1. Gerekli kurulum:
```bash
npm install
npx playwright install
```
