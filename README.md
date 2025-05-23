# 🎥 KickStream Overlay & API Proxy
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/TKNAjans/KickStream-Overlay-API-Proxy)](https://github.com/TKNAjans/KickStream-Overlay-API-Proxy/releases)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/)
[![Last Commit](https://img.shields.io/github/last-commit/TKNAjans/KickStream-Overlay-API-Proxy)](https://github.com/TKNAjans/KickStream-Overlay-API-Proxy/commits/main)
[![Repo Size](https://img.shields.io/github/repo-size/TKNAjans/KickStream-Overlay-API-Proxy)](https://github.com/TKNAjans/KickStream-Overlay-API-Proxy)
[![Contributors](https://img.shields.io/github/contributors/TKNAjans/KickStream-Overlay-API-Proxy)](https://github.com/TKNAjans/KickStream-Overlay-API-Proxy/graphs/contributors)
[![Issues](https://img.shields.io/github/issues/TKNAjans/KickStream-Overlay-API-Proxy)](https://github.com/TKNAjans/KickStream-Overlay-API-Proxy/issues)
[![Documentation](https://img.shields.io/badge/📚-DOCUMENTATION-black?style=flat)](https://github.com/TKNAjans/KickStream-Overlay-API-Proxy#readme)

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
```
```bash
npm install @playwright/test ws express
```
```bash
npx playwright install
```
```bash
node server.js
```

## 📄 Yasal Uyarı

*Kullanım koşulları ve sorumluluk reddi için [DISCLAIMER.md](./DISCLAIMER.md) dosyasına bakınız.*

