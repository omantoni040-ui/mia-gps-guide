// ═══════════════════════════════════════════════════════════════
// 📍 MIA PRESENSI — GPS SPOOF CONSOLE (copy-paste, 5 detik)
// ═══════════════════════════════════════════════════════════════
// PILIH MODE:
//   MODE = 0  → koordinat manual (isi LAT/LNG di bawah)
//   MODE = 1  → gedung (pilih angka di GE)
//
// GANTI SESUAI KEBUTUHAN:
var LAT = -7.2819695;    // ← koordinat manual (latitude)
var LNG = 112.7950407;   // ← koordinat manual (longitude)
var MODE = 0;            // 0 = manual, 1 = gedung
var GE = 17;             // kepake kalau MODE = 1 (17 = Tower 1)
// ═══════════════════════════════════════════════════════════════

// jangan ubah di bawah sini
(function () {
  var POOL = [
    [-7.2789283, 112.7949039, "GKT"], [-7.2816092, 112.7954745, "Perpustakaan"],
    [-7.2795736, 112.7972841, "Informatika"], [-7.2823959, 112.7947604, "Sistem Info"],
    [-7.2849264, 112.7960776, "Elektro"], [-7.2843551, 112.7961045, "Mesin"],
    [-7.2829933, 112.7966985, "Kimia"], [-7.2837293, 112.7976541, "Industri"],
    [-7.2807686, 112.7933211, "Sipil"], [-7.2797528, 112.7926403, "Lingkungan"],
    [-7.2821102, 112.7972141, "Perkapalan"], [-7.2822204, 112.7964260, "Kelautan"],
    [-7.2812372, 112.7940712, "Arsitektur"], [-7.2785419, 112.7969058, "DKV"],
    [-7.2788916, 112.7964643, "Desain Produk"], [-7.2797187, 112.7944083, "PWK"],
    [-7.2850531, 112.7941012, "Tower 1 (MIPA)"], [-7.2852456, 112.7953424, "Tower 2"],
    [-7.2849064, 112.7949670, "Matematika"], [-7.2845785, 112.7947413, "Fisika"],
    [-7.2838771, 112.7947291, "Kimia"], [-7.2854211, 112.7941195, "Statistika"],
    [-7.2856952, 112.7943173, "Biologi"], [-7.2801213, 112.7946348, "Geomatika"],
    [-7.2799537, 112.7955581, "Geofisika"], [-7.2851298, 112.7978194, "Material"],
    [-7.2844566, 112.7966371, "Komputer"], [-7.2783138, 112.7922179, "Instrumentasi"],
    [-7.2844092, 112.7956180, "Teknik Fisika"], [-7.2821244, 112.7967409, "Sistem Perkapalan"],
    [-7.2818032, 112.7972901, "Perkapalan C2"]
  ];

  var lat, lon, label;
  if (MODE === 1) {
    var i = Math.min(Math.max(GE, 0), POOL.length - 1);
    lat = POOL[i][0]; lon = POOL[i][1]; label = POOL[i][2];
  } else {
    lat = LAT; lon = LNG; label = "Manual";
  }

  // jitter ±15m
  lat += (Math.random() * 30 - 15) / 111320;
  lon += (Math.random() * 30 - 15) / (111320 * Math.cos(lat * Math.PI / 180));
  var acc = Math.random() < 0.7 ? 5 + Math.floor(Math.random() * 11) : 16 + Math.floor(Math.random() * 20);
  var ts = Date.now();

  // 1) cache lokasi
  localStorage.setItem('user_location_cache', JSON.stringify({ latitude: lat, longitude: lon, timestamp: ts }));

  // 2) override geolocation
  var fake = { coords: { latitude: lat, longitude: lon, accuracy: acc }, timestamp: ts };
  Object.defineProperty(navigator, 'geolocation', {
    get: function () {
      return {
        getCurrentPosition: function (cb) { cb(fake); },
        watchPosition: function (cb) { cb(fake); return 0; },
        clearWatch: function () {}
      };
    },
    configurable: true
  });

  // 3) permission palsu
  if (navigator.permissions && navigator.permissions.query) {
    navigator.permissions.query = function () {
      return Promise.resolve({ state: 'granted', onchange: null, addEventListener: function () {}, removeEventListener: function () {} });
    };
  }

  console.log("[GPS SPOOF] " + label + " | " + lat.toFixed(6) + ", " + lon.toFixed(6) + " | acc " + acc + "m");
  console.log("[GPS SPOOF] Reload otomatis...");
  setTimeout(function () { location.reload(); }, 1000);
})();