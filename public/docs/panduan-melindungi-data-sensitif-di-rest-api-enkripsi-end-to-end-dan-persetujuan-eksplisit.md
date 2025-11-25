# Panduan Melindungi Data Sensitif di REST API: Enkripsi End-to-End dan Persetujuan Eksplisit

---

![pdp-image](https://jdih.sukoharjokab.go.id/images/berita/37a602580020d850637d22612017add2.jpg)

---

Di era digital saat ini, perlindungan data pribadi adalah hal yang sangat penting. Banyak regulasi di seluruh dunia, termasuk Undang-Undang Perlindungan Data Pribadi (UU PDP) di Indonesia, mengatur ketat bagaimana data sensitif harus diproses dan dilindungi. Jika Anda mengelola REST API yang menangani data pribadi, memahami cara menjaga keamanan data tersebut sangat penting, terutama jika API Anda menangani data sensitif seperti informasi kesehatan, data biometrik, atau informasi finansial.

Dalam artikel ini, kita akan membahas dua hal utama:

1.	Bagaimana memastikan bahwa permintaan data sensitif dilakukan dengan persetujuan eksplisit dari subjek data.
2.	Bagaimana menerapkan enkripsi end-to-end untuk melindungi data sensitif selama transmisi.

## Apa Itu Data Sensitif dan Mengapa Harus Dilindungi?

Dalam Undang-Undang Perlindungan Data Pribadi (UU PDP) di Indonesia, data sensitif (sering juga disebut sebagai data pribadi spesifik) diatur secara khusus karena sifatnya yang lebih rentan terhadap penyalahgunaan. Data ini memiliki potensi untuk menyebabkan kerugian besar bagi individu jika disalahgunakan, oleh karena itu membutuhkan perlindungan yang lebih ketat.

Berdasarkan UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi, data sensitif didefinisikan sebagai data pribadi spesifik yang mencakup:

1.	**Data dan informasi kesehatan**: Segala informasi yang berkaitan dengan kondisi fisik dan mental individu, termasuk rekam medis, riwayat pengobatan, serta informasi terkait kesehatan lainnya.
2.	**Data biometrik**: Data yang dihasilkan dari proses teknologi yang berkaitan dengan karakteristik fisik atau biologis seseorang, seperti sidik jari, retina mata, pengenalan wajah, DNA, dan sejenisnya.
3.	**Data genetika**: Data yang mengandung informasi mengenai karakteristik genetik seseorang, biasanya berkaitan dengan DNA atau informasi terkait keturunan.
4.	**Pandangan politik**: Informasi mengenai pandangan atau keyakinan politik individu, termasuk afiliasi dengan partai politik atau pilihan dalam pemilihan.
5.	**Data keuangan pribadi**: Informasi terkait status atau aktivitas keuangan individu, termasuk nomor rekening, transaksi keuangan, dan informasi lainnya yang dapat memengaruhi privasi keuangan seseorang.
6.	**Orientasi seksual**: Data terkait dengan preferensi seksual seseorang.
7.	**Data terkait keyakinan keagamaan atau kepercayaan lainnya**: Informasi mengenai afiliasi keagamaan, keyakinan spiritual, atau kepercayaan individu lainnya.
8.	**Data lainnya**: Data yang sesuai dengan ketentuan peraturan perundang-undangan yang dianggap sebagai data sensitif. Ini bisa termasuk data mengenai status perkawinan, ras, etnis, dan data lain yang memiliki dampak signifikan terhadap individu jika terungkap.

Menurut UU PDP, pengumpulan dan pengolahan data sensitif harus dilakukan dengan persetujuan eksplisit dari pemilik data (subjek data), serta harus memenuhi prinsip-prinsip perlindungan data, yaitu transparansi, akuntabilitas, integritas, dan kerahasiaan.

Selain itu, pengendali data (organisasi atau pihak yang memproses data pribadi) harus memberikan keamanan yang lebih ketat dalam mengelola data sensitif untuk menghindari akses, pengungkapan, atau penggunaan tanpa izin yang dapat merugikan individu terkait.

## Mendapatkan Persetujuan Eksplisit dalam REST API

Agar REST API Anda mematuhi regulasi UU PDP, Anda harus memastikan bahwa setiap permintaan yang terkait dengan data sensitif dilakukan hanya setelah memperoleh persetujuan eksplisit dari subjek data. Berikut adalah beberapa cara umum untuk mencapainya.

### 1. Persetujuan Melalui JSON Web Token (JWT)

JWT adalah metode yang populer untuk otorisasi dalam API. Anda bisa menyertakan persetujuan eksplisit di dalam payload JWT sebagai klaim tambahan. Berikut contoh payload JWT yang menyimpan persetujuan eksplisit untuk mengakses data sensitif:

```json
{
  "userId": "12345",
  "email": "johndoe@example.com",
  "permissions": {
    "access_sensitive_data": true, 
    "data_types": ["health_data", "financial_data"],
    "consent_timestamp": "2024-10-06T12:34:56Z"
  }
}
```

Dalam JWT ini, klaim access_sensitive_data menunjukkan bahwa pengguna telah memberikan persetujuan eksplisit untuk mengakses data sensitif tertentu. Kemudian, di sisi server, Anda bisa memeriksa klaim ini sebelum memberikan akses ke data sensitif.

Contoh Middleware di Node.js:

```javascript
const jwt = require('jsonwebtoken');

const checkSensitiveDataPermission = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    
    const permissions = user.permissions;
    if (permissions.access_sensitive_data && permissions.data_types.includes('health_data')) {
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Explicit consent not provided." });
    }
  });
};
```

Dengan pendekatan ini, Anda bisa memastikan bahwa pengguna yang mencoba mengakses data sensitif telah memberikan izin sebelumnya.

### 2. Persetujuan Melalui Parameter Request

Alternatif lainnya adalah dengan menyertakan parameter consent=true pada request. Sistem bisa memeriksa apakah parameter tersebut ada dan kemudian memproses data sensitif.

Contoh Request:

```http
GET /user/health?consent=true HTTP/1.1
Authorization: Bearer <JWT>
```

Middleware kemudian akan memeriksa apakah persetujuan eksplisit telah diberikan:

```javascript
const checkExplicitConsent = (req, res, next) => {
  const consent = req.query.consent;

  if (consent === 'true') {
    next(); 
  } else {
    return res.status(403).json({ message: "Access denied. Explicit consent not provided." });
  }
};
```

## Enkripsi End-to-End untuk REST API

Selain persetujuan eksplisit, melindungi data sensitif selama transmisi sangat penting. Data yang berjalan melalui jaringan bisa dicegat oleh pihak ketiga jika tidak dienkripsi. Oleh karena itu, enkripsi end-to-end (E2EE) adalah solusi penting untuk melindungi privasi data selama pengiriman.

### 1. Gunakan HTTPS (TLS/SSL)

Langkah pertama untuk melindungi data sensitif di REST API adalah dengan menggunakan HTTPS, yang mengenkripsi seluruh komunikasi antara klien dan server menggunakan protokol TLS/SSL. HTTPS melindungi data saat transit, sehingga tidak bisa dibaca oleh siapa pun yang mungkin menyadap koneksi.

Contoh Penggunaan HTTPS di Node.js:

```javascript
const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('Server running on port 443 with HTTPS');
});
```

### 2. Enkripsi Data Sensitif Secara Khusus dalam Payload

Selain HTTPS, Anda bisa mengenkripsi data sensitif secara khusus dalam payload, misalnya menggunakan AES (Advanced Encryption Standard). Ini memberikan lapisan keamanan tambahan jika Anda perlu menjaga data terenkripsi bahkan setelah disimpan atau di-cache.

Contoh Enkripsi AES pada Payload:

```javascript
const crypto = require('crypto');

const encryptionKey = "a_very_secret_key_32bytes";
const algorithm = 'aes-256-cbc';

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

app.get('/user/health', (req, res) => {
  const healthData = {
    blood_type: "A",
    medical_history: "Diabetes Type 2"
  };
  
  const healthDataString = JSON.stringify(healthData);
  const encryptedData = encrypt(healthDataString);
  
  res.json({ encrypted_data: encryptedData });
});
```

### 3. Menggunakan JSON Web Encryption (JWE)

Jika Anda lebih suka standar yang sudah ada untuk mengenkripsi payload, Anda bisa menggunakan JSON Web Encryption (JWE). JWE menawarkan format standar untuk mengenkripsi data JSON yang bisa ditransmisikan di REST API.

Contoh Penggunaan JWE:

```javascript
const jose = require('node-jose');

const publicKey = `-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----`;

const payload = {
  blood_type: "A",
  medical_history: "Diabetes Type 2"
};

jose.JWK.asKey(publicKey, 'pem').then(function (key) {
  jose.JWE.createEncrypt({ format: 'compact' }, key)
    .update(JSON.stringify(payload))
    .final()
    .then(function (encrypted) {
      res.json({ encrypted_data: encrypted });
    });
});
```

## Kesimpulan

Mengelola data sensitif dalam REST API memerlukan pendekatan yang hati-hati. Anda harus memastikan bahwa persetujuan eksplisit diperoleh sebelum mengakses data sensitif, dan juga menerapkan enkripsi end-to-end untuk melindungi data selama transmisi. Mulai dari penggunaan HTTPS hingga enkripsi payload menggunakan AES atau JWE, langkah-langkah ini akan membantu memastikan bahwa REST API Anda mematuhi regulasi perlindungan data dan menjaga privasi pengguna.

Dengan mengimplementasikan solusi ini, Anda tidak hanya mematuhi peraturan hukum seperti UU PDP, tetapi juga membangun kepercayaan dengan pengguna dengan memastikan keamanan data mereka.

Semoga artikel ini membantu Anda memahami pentingnya persetujuan eksplisit dan enkripsi dalam melindungi data sensitif pada REST API. Jika Anda memiliki pertanyaan lebih lanjut tentang topik ini, jangan ragu untuk bertanya di kolom komentar!