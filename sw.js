self.addEventListener("install", function(){ self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(clients.claim()); });
self.addEventListener("push", function(e){
  var d = {};
  try { d = e.data.json(); } catch (x) {}
  e.waitUntil(self.registration.showNotification(d.title || "Permintaan baru", {
    body: d.body || "", icon: "icon-192.png", badge: "icon-192.png", tag: d.tag,
    renotify: true, requireInteraction: true, vibrate: [300, 100, 300],
    data: { url: d.url || "staff.html" }
  }));
});
self.addEventListener("notificationclick", function(e){
  e.notification.close();
  var u = new URL(e.notification.data.url, self.registration.scope).href;
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(list){
    for (var i = 0; i < list.length; i++) {
      if (list[i].url.indexOf(self.registration.scope) === 0 && "focus" in list[i]) { list[i].navigate(u); return list[i].focus(); }
    }
    return clients.openWindow(u);
  }));
});
