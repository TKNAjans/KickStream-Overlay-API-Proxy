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
- `/api/channel/:username`  
  Kullanıcının kanal bilgilerini döner (ID, kullanıcı adı, açıklama, vb.)

- `/api/channel/:username/livestream`  
  Kullanıcının canlı yayın durumu ve stream bilgilerini getirir

- `/api/featured/:lang`  
  Öne çıkan yayıncıları çeker (HTML olarak döner). `lang` → tr/en gibi

- `/api/channel/:username/chatroom`  
  Kanalın chatroom ID'sini verir (chat bağlantısı için gerekir)

- `/api/channel/:username/videos`  
  Kanalın VOD (video geçmişi) listesini döner

- `/api/channel/:username/emotes`  
  Kanalın emote (ifade) listesini döner – `[emote:ID:NAME]` çözümlemesi için kullanılır

- `/api/viewers/:channelId`  
  Kanalın anlık izleyici sayısını döner

- `/api/channel/:username/leaderboards`  
  Kanalın en çok bağış yapan kullanıcılarını listeler

- `/api/channel/:username/predictions/latest`  
  Yayındaki son prediction (tahmin oyunu) bilgilerini verir

- `/api/channel/:username/messages`  
  Yayındaki son sohbet mesajlarını verir (statik snapshot)

- `/api/channel/:username/polls`  
  Aktif anketleri döner (yayın içinde yapılan oylamalar)

- `/api/channel/:channelId/user/:userId/identity`  
  Belirli bir kullanıcının kimlik, badge ve renk bilgilerini getirir

- `/api/channel/:username/goals`  
  Kanalda aktif olan hedefler (örneğin abone hedefi) listelenir

- `/api/channel/:username/chatroom/rules`  
  Kanalın sohbet kurallarını verir

- `/chat/:username` → Canlı sohbet ekranı  
  Tarayıcıda emote destekli canlı chat görünümü sağlar (OBS uyumlu)


---



## 🧪 Başlatma

1. Gerekli kurulum:
```bash
npm install
npm install @playwright/test ws express
npx playwright install
```

## 📄 Yasal Uyarı

*Kullanım koşulları ve sorumluluk reddi için [DISCLAIMER.md](./DISCLAIMER.md) dosyasına bakınız.*

