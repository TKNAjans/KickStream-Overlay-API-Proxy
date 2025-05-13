const express = require("express");
const path = require("path");
const WebSocket = require("ws");
const { chromium } = require("playwright");

const app = express();
const PORT = process.env.PORT || 3000;
const connectedChannels = new Map(); // channelId -> WebSocket
const clientSubscriptions = new Map(); // ws -> channelId

// Statik dosyalar için middleware
app.use("/static", express.static(path.join(__dirname, "public")));

// Ana sayfa
app.get("/", (req, res) => {
  res.send(`
    <h1>🎮 Kick Proxy API</h1>
    <p>Bu sunucu Kick platformunun API uç noktalarını proxy olarak sağlar:</p>
    <ul>
      <li>/api/channel/:username</li>
      <li>/api/channel/:username/livestream</li>
      <li>/api/featured/:lang</li>
      <li>/api/channel/:username/chatroom</li>
      <li>/api/channel/:username/videos</li>
      <li>/api/channel/:username/emotes</li>
      <li>/api/viewers/:channelId</li>
      <li>/api/channel/:username/leaderboards</li>
      <li>/api/channel/:username/predictions/latest</li>
      <li>/api/channel/:username/messages</li>
      <li>/api/channel/:username/polls</li>
      <li>/api/channel/:channelId/user/:userId/identity</li>
      <li>/api/channel/:username/goals</li>
      <li>/api/channel/:username/chatroom/rules</li>
      <li>/chat/:username → Canlı sohbet ekranı</li>
    </ul>
  `);
});

// Playwright ile API isteği işleyici
const makeApiRequest = async (url) => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    const response = await page.goto(url, { waitUntil: "networkidle" });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`API hatası: ${url}`, err.message);
    throw err;
  } finally {
    await browser.close();
  }
};

// API uç noktaları
app.get("/api/channel/:username", async (req, res) => {
  try {
    const data = await makeApiRequest(`https://kick.com/api/v1/channels/${req.params.username}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/channel/:username/livestream", async (req, res) => {
  try {
    const data = await makeApiRequest(`https://kick.com/api/v1/channels/${req.params.username}/livestream`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/featured/:lang", async (req, res) => {
  try {
    const data = await makeApiRequest(`https://kick.com/featured-livestreams/non-following/${req.params.lang}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/channel/:username/chatroom", async (req, res) => {
  try {
    const data = await makeApiRequest(`https://kick.com/api/v2/channels/${req.params.username}/chatroom`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/channel/:username/videos", async (req, res) => {
  try {
    const data = await makeApiRequest(`https://kick.com/api/v2/channels/${req.params.username}/videos`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/channel/:username/emotes", async (req, res) => {
  try {
    const data = await makeApiRequest(`https://kick.com/emotes/${req.params.username}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/viewers/:channelId", async (req, res) => {
  try {
    const data = await makeApiRequest(`https://kick.com/current-viewers?ids[]=${req.params.channelId}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/channel/:username/leaderboards", async (req, res) => {
  try {
    const data = await makeApiRequest(`https://kick.com/api/v2/channels/${req.params.username}/leaderboards`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/channel/:username/predictions/latest", async (req, res) => {
  try {
    const data = await makeApiRequest(`https://kick.com/api/v2/channels/${req.params.username}/predictions/latest`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/channel/:username/messages", async (req, res) => {
  try {
    const data = await makeApiRequest(`https://kick.com/api/v2/channels/${req.params.username}/messages`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/channel/:username/polls", async (req, res) => {
  try {
    const data = await makeApiRequest(`https://kick.com/api/v2/channels/${req.params.username}/polls`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/channel/:channelId/user/:userId/identity", async (req, res) => {
  try {
    const data = await makeApiRequest(`https://kick.com/api/v2/channels/${req.params.channelId}/users/${req.params.userId}/identity`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/channel/:username/goals", async (req, res) => {
  try {
    const data = await makeApiRequest(`https://kick.com/api/v2/channels/${req.params.username}/goals`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/channel/:username/chatroom/rules", async (req, res) => {
  try {
    const data = await makeApiRequest(`https://kick.com/api/v2/channels/${req.params.username}/chatroom/rules`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kick WebSocket bağlantısı
function connectToKickWS(channelId, ws) {
  // ws geçerliyse abonelik ekle
  if (ws && ws.readyState === WebSocket.OPEN) {
    clientSubscriptions.set(ws, channelId);
    console.log(`✅ İstemci abone oldu: ${channelId}`);
  }

  // Mevcut bağlantıyı kontrol et
  if (connectedChannels.has(channelId)) {
    return connectedChannels.get(channelId);
  }

  const kickSocket = new WebSocket(
    "wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false"
  );

  kickSocket.on("open", () => {
    console.log(`✅ Kick WS bağlandı: ${channelId}`);
    kickSocket.send(
      JSON.stringify({
        event: "pusher:subscribe",
        data: {
          auth: "",
          channel: `chatrooms.${channelId}.v2`,
        },
      })
    );
  });

  kickSocket.on("message", (data) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.event === "App\\Events\\ChatMessageEvent") {
        const msg = JSON.parse(parsed.data);
        // Mesajı yalnızca ilgili channelId’ye abone olan istemcilere gönder
        clientSubscriptions.forEach((subChannelId, clientWs) => {
          if (
            subChannelId === channelId &&
            clientWs &&
            clientWs.readyState === WebSocket.OPEN
          ) {
            clientWs.send(JSON.stringify(msg));
            /* console.log(`📤 Mesaj gönderildi: ${channelId}`); */
          } else if (!clientWs || clientWs.readyState === WebSocket.CLOSED) {
            clientSubscriptions.delete(clientWs);
            console.log(`🧹 Geçersiz istemci temizlendi: ${subChannelId}`);
          }
        });
      }
    } catch (err) {
      console.error(`WebSocket mesaj parse hatası: ${err.message}`);
    }
  });

  kickSocket.on("close", () => {
    console.log(`❌ Kick WS kapandı: ${channelId}`);
    connectedChannels.delete(channelId);
    clientSubscriptions.forEach((subChannelId, clientWs) => {
      if (subChannelId === channelId) {
        clientSubscriptions.delete(clientWs);
      }
    });
    // Yeniden bağlanma denemesi
    setTimeout(() => {
      if (Array.from(clientSubscriptions.values()).includes(channelId)) {
        connectToKickWS(channelId, null);
      }
    }, 5000);
  });

  kickSocket.on("error", (err) => {
    console.error(`Kick WS hatası: ${channelId}`, err.message);
  });

  connectedChannels.set(channelId, kickSocket);
  return kickSocket;
}

// Eski bağlantıları temizle
function cleanupOldConnections(currentChannelId) {
  connectedChannels.forEach((socket, channelId) => {
    if (channelId !== currentChannelId && socket.readyState !== WebSocket.CLOSED) {
      socket.close();
      connectedChannels.delete(channelId);
      console.log(`🧹 Eski WS bağlantısı kapatıldı: ${channelId}`);
    }
  });
  clientSubscriptions.forEach((subChannelId, clientWs) => {
    if (subChannelId !== currentChannelId || !clientWs || clientWs.readyState === WebSocket.CLOSED) {
      clientSubscriptions.delete(clientWs);
      console.log(`🧹 Eski abonelik temizlendi: ${subChannelId}`);
    }
  });
}

// Sohbet ekranı
app.get("/chat/:username", async (req, res) => {
  try {
    // /api/channel/:username/chatroom uç noktasından channelId al
    const chatroomData = await makeApiRequest(`https://kick.com/api/v2/channels/${req.params.username}/chatroom`);
    const channelId = chatroomData?.id;

    if (!channelId) {
      throw new Error("Kanal ID alınamadı");
    }

    // Eski bağlantıları temizle
    cleanupOldConnections(channelId);

    // WebSocket bağlantısını başlat
    connectToKickWS(channelId, null);

    // Sohbet ekranını döndür
    res.sendFile(path.join(__dirname, "public/index.html"));
  } catch (err) {
    console.error(`Sohbet ekranı hatası: ${req.params.username}`, err.message);
    res.status(500).send(`Hata: ${err.message}`);
  }
});

const server = app.listen(PORT, () => {
  console.log(`✅ Kick Proxy API + Chat çalışıyor: http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  console.log("✅ Tarayıcı WebSocket bağlandı");

  // /chat/:username rotasından channelId’yi almak için geçici bir mekanizma
  ws.on("message", async (data) => {
    try {
      const { username } = JSON.parse(data);
      if (username) {
        const chatroomData = await makeApiRequest(`https://kick.com/api/v2/channels/${username}/chatroom`);
        const channelId = chatroomData?.id;
        if (channelId) {
          connectToKickWS(channelId, ws);
          console.log(`✅ İstemci ${username} için channelId ${channelId}’ye abone oldu`);
        }
      }
    } catch (err) {
      console.error("İstemci mesaj parse hatası:", err.message);
    }
  });

  ws.on("close", () => {
    console.log("❌ Tarayıcı WebSocket kapandı");
    const channelId = clientSubscriptions.get(ws);
    if (channelId) {
      clientSubscriptions.delete(ws);
      if (!Array.from(clientSubscriptions.values()).includes(channelId)) {
        const socket = connectedChannels.get(channelId);
        if (socket && socket.readyState !== WebSocket.CLOSED) {
          socket.close();
          connectedChannels.delete(channelId);
          console.log(`🧹 WS bağlantısı kapatıldı: ${channelId}`);
        }
      }
    }
  });

  ws.on("error", (err) => {
    console.error("Tarayıcı WebSocket hatası:", err.message);
    clientSubscriptions.delete(ws); // Hatalı istemciyi temizle
  });
});