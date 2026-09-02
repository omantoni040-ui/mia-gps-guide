// ═══════════════════════════════════════════════════════════════
// ✅ VERIFIER — Cek lokasi yang AKAN dikirim ke server
// ═══════════════════════════════════════════════════════════════
// CARA PAKAI:
//   1. Paste bookmarklet GPS dulu (seperti biasa)
//   2. DI HALAMAN SETELAH RELOAD, tekan F12 → Console
//   3. Paste kode ini → Enter → muncul status ✅/❌
//   4. Kalau ✅ hijau, klik Hadir — dijamin pakai koordinat target
// ═══════════════════════════════════════════════════════════════

// ISI KOORDINAT YANG LO MAU — harus SAMA dengan yang lo set di bookmarklet
var TARGET_LAT = -7.2819695;   // ← sesuai input lo
var TARGET_LNG = 112.7950407;  // ← sesuai input lo

// ── jangan ubah di bawah ────────────────────────────────────────
(function () {
  // 1. Baca apa yang akan dikirim app (replay logika asli app)
  function readCache() {
    try {
      var raw = localStorage.getItem('user_location_cache');
      if (!raw) return null;
      var c = JSON.parse(raw);
      if (Date.now() - c.timestamp < 300000) return c;
      localStorage.removeItem('user_location_cache');
    } catch (e) {}
    return null;
  }

  var cache = readCache();
  var hasil = [];

  if (!cache) {
    hasil.push(['❌ Cache lokasi KOSONG — bookmarklet belum jalan / lebih dari 5 menit. Paste ulang!', 'red']);
  } else {
    // 2. Bandingkan dengan target
    var diffLat = Math.abs(cache.latitude - TARGET_LAT) * 111320;
    var diffLng = Math.abs(cache.longitude - TARGET_LNG) * (111320 * 0.99218);
    var dist = Math.sqrt(diffLat * diffLat + diffLng * diffLng);

    hasil.push(['📡 Cache location : ' + cache.latitude.toFixed(6) + ', ' + cache.longitude.toFixed(6), 'gray']);
    hasil.push(['🎯 Target lo       : ' + TARGET_LAT.toFixed(6) + ', ' + TARGET_LNG.toFixed(6), 'gray']);

    if (dist <= 25) {
      hasil.push(['✅ OK — jarak ' + dist.toFixed(1) + 'm dari target (dalam jitter ±15m). Koordinat SPOOF yang akan dikirim!', 'green']);
    } else {
      hasil.push(['❌ MISMATCH — jarak ' + dist.toFixed(0) + 'm dari target. Koordinat cache BUKAN punya lo!', 'red']);
    }

    // 3. Cek GPS asli masih di-override gak
    var overridden = false;
    try {
      navigator.geolocation.getCurrentPosition(function (pos) {
        var d2 = Math.abs(pos.coords.latitude - TARGET_LAT) * 111320;
        if (d2 < 100) overridden = true;
      });
    } catch (e) {}
    hasil.push([overridden || dist <= 25 ? '✅ GPS API override aktif — fallback pun aman' : '⚠️ GPS API gak ke-override (cache masih menang)', 'orange']);
  }

  console.log('%c════════ VERIFIKASI GPS SPOOF ════════', 'font-weight:bold;font-size:13px');
  hasil.forEach(function (h) {
    var color = h[1] === 'green' ? '#22c55e' : h[1] === 'red' ? '#ef4444' : h[1] === 'orange' ? '#f59e0b' : '#9ca3af';
    console.log('%c' + h[0], 'color:' + color + ';font-size:12px;font-weight:' + (h[1] === 'green' || h[1] === 'red' ? 'bold' : 'normal'));
  });
  console.log('%c═══════════════════════════════════', 'font-weight:bold');
  console.log('%cKALAU ✅ HIJAU → klik Hadir. Dijamin server terima koordinat target.', 'color:#22c55e;font-size:12px');
})();