function b64(s){var p="=".repeat((4-s.length%4)%4),b=(s+p).replace(/-/g,"+").replace(/_/g,"/"),r=atob(b),o=new Uint8Array(r.length);for(var i=0;i<r.length;i++)o[i]=r.charCodeAt(i);return o}
function daftarPush(db,sub,info){return db.rpc("daftar_push",{p_endpoint:sub.endpoint,p_sub:sub.toJSON(),p_nama:info.nama,p_peran:info.peran,p_pulau:info.pulau,p_brand:info.brand})}
async function aktifkanPush(db,info){
  if(!("serviceWorker" in navigator)||!("PushManager" in window)) throw new Error("Browser ini belum mendukung notifikasi. Di iPhone: tekan Bagikan lalu Add to Home Screen, kemudian buka dari ikonnya.");
  var reg=await navigator.serviceWorker.register("sw.js");
  await navigator.serviceWorker.ready;
  var p=await Notification.requestPermission();
  if(p!=="granted") throw new Error("Izin notifikasi ditolak. Aktifkan lewat pengaturan HP atau browser.");
  var sub=(await reg.pushManager.getSubscription())||(await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(CFG.vapid)}));
  var r=await daftarPush(db,sub,info);
  if(r.error) throw new Error("Gagal menyimpan pendaftaran. Coba lagi.");
}
async function segarkanPush(db,info){
  try{
    if(typeof Notification==="undefined"||Notification.permission!=="granted"||!("serviceWorker" in navigator)) return false;
    var reg=await navigator.serviceWorker.register("sw.js");await navigator.serviceWorker.ready;
    var sub=await reg.pushManager.getSubscription();
    if(!sub) return false;
    await daftarPush(db,sub,info);return true;
  }catch(e){return false}
}
