# Progressive Web Apps sebagai Solusi Tantangan Teknis dalam Pembelajaran Elektronik di Indonesia: Kajian Literatur Sistematis

Pembelajaran elektronik (e-learning) di Indonesia telah mengalami perkembangan pesat dalam beberapa tahun terakhir. Namun, implementasinya masih menghadapi berbagai tantangan teknis, seperti keterbatasan infrastruktur jaringan internet, keterbatasan perangkat keras yang digunakan oleh siswa dan tenaga pengajar, serta keterbatasan aplikasi berbasis web tradisional yang bergantung pada koneksi internet yang stabil

## **Abstrak**  
**Latar Belakang:** Pembelajaran elektronik (e-learning) di Indonesia telah mengalami perkembangan pesat dalam beberapa tahun terakhir. Namun, implementasinya masih menghadapi berbagai tantangan teknis, seperti keterbatasan infrastruktur jaringan internet, keterbatasan perangkat keras yang digunakan oleh siswa dan tenaga pengajar, serta keterbatasan aplikasi berbasis web tradisional yang bergantung pada koneksi internet yang stabil. Dalam menghadapi tantangan ini, **Progressive Web Apps (PWA)** muncul sebagai solusi potensial yang menawarkan fitur seperti **kemampuan offline, caching yang efisien, serta konsumsi sumber daya yang lebih rendah dibandingkan aplikasi web tradisional**.  

**Tujuan:** Penelitian ini bertujuan untuk **melakukan kajian sistematis terhadap PWA dalam konteks pembelajaran daring di Indonesia**, dengan fokus pada tiga aspek utama:  
1) **Mengidentifikasi permasalahan teknis utama dalam penyelenggaraan e-learning di Indonesia.**  
2) **Menganalisis sejauh mana PWA dapat menjadi solusi untuk mengatasi tantangan tersebut.**  
3) **Membandingkan PWA dengan solusi teknologi lain yang telah diterapkan dalam LMS berbasis web.**  

**Metode:** Kajian ini dilakukan menggunakan **Systematic Literature Review (SLR)** berdasarkan berbagai publikasi ilmiah dari database bereputasi seperti **IEEE Xplore, Springer Nature, ACM Digital Library, dan Garuda**. Artikel yang digunakan dalam studi ini dipilih berdasarkan **kriteria inklusi dan eksklusi yang ketat**, dengan fokus pada penelitian yang membahas **implementasi teknis PWA, tantangan infrastruktur pembelajaran daring, serta solusi teknologi alternatif dalam e-learning**. Evaluasi literatur dilakukan dengan pendekatan tematik, mengelompokkan temuan ke dalam tiga kategori utama: **masalah teknis pembelajaran daring, peran PWA dalam e-learning, dan solusi teknologi alternatif yang tersedia**.  

**Hasil:** Hasil kajian menunjukkan bahwa **PWA memiliki keunggulan signifikan dibandingkan LMS berbasis web tradisional**, terutama dalam **kecepatan muat halaman, efisiensi penggunaan bandwidth, serta kemampuannya untuk tetap berfungsi dalam kondisi jaringan terbatas melalui caching**. Selain itu, PWA memiliki keunggulan dalam **penggunaan sumber daya yang lebih efisien**, sehingga cocok untuk digunakan di perangkat dengan spesifikasi rendah. Namun, kajian ini juga mengidentifikasi **gap penelitian** yang masih perlu diatasi, termasuk **kurangnya studi empiris yang mengevaluasi performa PWA dalam kondisi jaringan ekstrem, minimnya studi komparatif antara PWA dan LMS berbasis teknologi lain, serta kurangnya implementasi di wilayah dengan infrastruktur terbatas**.  

**Kesimpulan:** Berdasarkan hasil kajian literatur, PWA berpotensi menjadi solusi teknis yang efisien untuk mengatasi berbagai permasalahan pembelajaran daring di Indonesia. Namun, untuk memastikan efektivitasnya, diperlukan studi lebih lanjut dalam bentuk **evaluasi empiris terhadap kinerja PWA dalam LMS, pengujian komprehensif terkait efisiensi konsumsi energi, serta analisis keandalan sistem dalam skenario penggunaan skala besar**. Dengan demikian, penelitian ini memberikan rekomendasi bagi pengembang LMS dan institusi pendidikan untuk mempertimbangkan implementasi PWA sebagai bagian dari strategi peningkatan kualitas e-learning di Indonesia.  

**Kata Kunci:** Progressive Web Apps, LMS, Pembelajaran Elektronik, Tantangan Teknis, Infrastruktur, Evaluasi Kinerja.  

---

## **1. Pendahuluan**

### **1.1 Latar Belakang**  
Pembelajaran elektronik (e-learning) telah menjadi bagian integral dari sistem pendidikan di Indonesia, terutama sejak meningkatnya kebutuhan akan pendidikan jarak jauh. Kemajuan teknologi informasi dan komunikasi telah memungkinkan akses terhadap berbagai platform pembelajaran daring, seperti **Learning Management System (LMS)** berbasis web. Namun, meskipun e-learning memberikan fleksibilitas dalam pembelajaran, implementasinya di Indonesia masih menghadapi berbagai tantangan teknis dan infrastruktur.  

Beberapa penelitian menunjukkan bahwa **keterbatasan infrastruktur jaringan internet** menjadi hambatan utama dalam penyelenggaraan pembelajaran daring di Indonesia. Banyak daerah, terutama di wilayah pedesaan dan terpencil, mengalami **akses internet yang terbatas atau tidak stabil**, yang berdampak pada efektivitas pembelajaran daring. Selain itu, keterbatasan **perangkat dan fasilitas pendukung** juga menjadi kendala yang signifikan, di mana banyak siswa dan pendidik masih menggunakan perangkat dengan spesifikasi rendah yang kurang mendukung aplikasi pembelajaran berbasis web.  

Selain masalah infrastruktur, aplikasi pembelajaran berbasis web tradisional juga memiliki **keterbatasan teknis**, seperti performa yang lambat, ketergantungan penuh pada koneksi internet, serta konsumsi data yang tinggi. Dalam konteks ini, **Progressive Web Apps (PWA)** muncul sebagai alternatif solusi yang menjanjikan karena menawarkan pengalaman pengguna yang lebih cepat, efisiensi sumber daya, serta kemampuan offline melalui mekanisme caching berbasis **Service Worker**.  

### **1.2 Motivasi Penelitian**  
Mengingat tantangan teknis yang dihadapi dalam pembelajaran daring di Indonesia, diperlukan solusi teknologi yang dapat meningkatkan **aksesibilitas, performa, dan efisiensi dalam penggunaan sumber daya**. **Progressive Web Apps (PWA)** menjadi pendekatan yang potensial dalam mengatasi permasalahan ini, karena PWA dapat **berfungsi secara offline, mengurangi konsumsi bandwidth, serta diakses dengan lancar pada perangkat dengan spesifikasi rendah**.  

Beberapa studi menunjukkan bahwa PWA telah berhasil diterapkan dalam berbagai sektor, termasuk dalam **sistem pembelajaran daring**. Namun, masih terdapat **kekurangan studi sistematis yang menganalisis sejauh mana PWA dapat menjadi solusi teknis dalam konteks pembelajaran elektronik di Indonesia**. Oleh karena itu, penelitian ini bertujuan untuk mengisi kesenjangan penelitian dengan mengevaluasi peran PWA dalam menghadapi tantangan teknis LMS berbasis web.  

### **1.3 Tujuan Penelitian**  
Penelitian ini bertujuan untuk:  
1. **Mengidentifikasi permasalahan teknis dan infrastruktur utama dalam penyelenggaraan pembelajaran elektronik di Indonesia.**  
2. **Menganalisis sejauh mana PWA dapat menjadi solusi dalam mengatasi tantangan teknis pembelajaran daring.**  
3. **Membandingkan efektivitas PWA dengan solusi teknologi lain yang telah digunakan dalam sistem pembelajaran daring.**  

### **1.4 Pertanyaan Penelitian**  
Berdasarkan tujuan yang telah dirumuskan, penelitian ini difokuskan untuk menjawab pertanyaan berikut:  
1. **Apa saja masalah teknis dan infrastruktur yang dihadapi dalam penyelenggaraan pembelajaran elektronik di Indonesia?**  
2. **Bagaimana PWA dapat membantu mengatasi tantangan teknis tersebut?**  
3. **Apa saja solusi teknologi alternatif selain PWA dalam konteks pembelajaran daring?**

---

## **2. Metodologi Penelitian**  

### **2.1 Pendekatan Penelitian**  
Penelitian ini menggunakan pendekatan **Systematic Literature Review (SLR)** untuk menganalisis bagaimana **Progressive Web Apps (PWA) dapat menjadi solusi terhadap tantangan teknis dalam pembelajaran elektronik di Indonesia**. SLR dipilih karena memungkinkan **pengumpulan, evaluasi, dan sintesis studi yang telah dilakukan sebelumnya** guna memahami **tren, tantangan, serta peluang dalam implementasi PWA dalam sistem pembelajaran daring**.  

Proses SLR dalam penelitian ini mengacu pada metodologi yang diadaptasi dari Kitchenham & Charters (2007), yang terdiri dari beberapa tahap utama:  
1. **Identifikasi sumber literatur**  
2. **Penerapan kriteria inklusi dan eksklusi**  
3. **Seleksi dan analisis literatur**  
4. **Sintesis temuan utama**  

### **2.2 Sumber Data dan Database yang Digunakan**  
Artikel yang digunakan dalam penelitian ini diperoleh dari **database ilmiah bereputasi**, yaitu:  
- **IEEE Xplore**  
- **Springer Nature**  
- **ACM Digital Library**  
- **Garuda (Garba Rujukan Digital)** – digunakan untuk mencari **artikel terkait tantangan pembelajaran jarak jauh (PJJ) di Indonesia** serta beberapa studi tentang PWA.  

Database ini dipilih untuk memastikan bahwa **studi yang digunakan memiliki standar akademik yang tinggi serta mencakup sumber yang relevan dengan konteks penelitian ini**.  

### **2.3 Kriteria Inklusi dan Eksklusi**  

Untuk memastikan bahwa artikel yang dikaji sesuai dengan ruang lingkup penelitian ini, diterapkan **kriteria inklusi dan eksklusi** sebagai berikut:  

### **2.3.1 Kriteria Inklusi**:  
- Studi yang membahas **implementasi PWA di wilayah dengan akses internet terbatas**.  
- Artikel yang menganalisis **performa teknis PWA**, seperti kecepatan muat halaman, efisiensi penggunaan bandwidth, dan caching.  
- Studi tentang **usability PWA**, terutama dalam konteks pembelajaran daring.  
- Artikel yang membahas **Service Worker dalam PWA**, yang menjadi komponen kunci dalam efisiensi caching dan mode offline.  

### **2.3.2 Kriteria Eksklusi**:  
- Studi tentang implementasi PWA dalam **sektor industri lain**, seperti **e-commerce, kesehatan, atau bisnis**, yang tidak berkaitan dengan **pendidikan atau daerah dengan keterbatasan infrastruktur**.  
- Artikel yang hanya membahas **teori umum tentang PWA tanpa analisis teknis atau studi kasus dalam e-learning**.  
- Studi yang diterbitkan **sebelum 10 tahun terakhir** untuk memastikan kesesuaian dengan perkembangan teknologi terbaru.  

### **2.4 Prosedur Seleksi Publikasi**  

Setelah pencarian artikel dilakukan, proses seleksi dilakukan dengan **beberapa tahapan** berikut:  

1. **Pencarian Awal**  
   - Menggunakan kata kunci seperti:  
     - `"Progressive Web Apps in e-learning"`  
     - `"PWA for low-connectivity environments"`   
     - `"PWA for education in Indonesia"`  
   - Pencarian dilakukan dalam **judul, abstrak, dan kata kunci** dari setiap database yang digunakan.  

2. **Penyaringan Berdasarkan Kriteria**  
   - Artikel yang ditemukan melalui pencarian awal akan disaring berdasarkan **kriteria inklusi dan eksklusi**.  
   - Studi yang tidak relevan dengan **konteks pendidikan dan daerah dengan keterbatasan akses** akan dihapus dari daftar.  

3. **Evaluasi Kualitas dan Relevansi**  
   - Artikel yang lolos penyaringan akan **dievaluasi lebih lanjut** berdasarkan relevansi dengan **topik utama penelitian ini**.  
   - Artikel yang memiliki **data teknis yang kurang lengkap atau tidak menyediakan informasi mendalam tentang performa PWA** akan dieliminasi.  

4. **Ekstraksi dan Analisis Data**  
   - Artikel yang memenuhi semua kriteria akan dianalisis dan dikategorikan berdasarkan **tiga aspek utama dalam penelitian ini**:  
     1. **Masalah teknis dalam pembelajaran daring**  
     2. **Peran PWA dalam mengatasi tantangan tersebut**  
     3. **Alternatif solusi teknologi lainnya**  

5. **Sintesis Temuan**  
   - Setelah semua data dikumpulkan dan dikategorikan, penelitian ini akan **mensintesis temuan utama dari setiap artikel** untuk mendapatkan **gambaran menyeluruh mengenai efektivitas PWA sebagai solusi dalam LMS berbasis web**.  

### **2.5 Batasan Metodologi**  
Meskipun pendekatan SLR dalam penelitian ini telah dirancang secara sistematis, terdapat beberapa **batasan metodologi** yang perlu diperhatikan:  

- **Hanya artikel dalam database tertentu yang digunakan**, sehingga mungkin terdapat penelitian lain di luar database tersebut yang tidak teridentifikasi.  
- **Studi empiris langsung belum dilakukan**, sehingga hasil kajian ini masih bersifat sintesis dari studi-studi terdahulu.  
- **Konteks geografis penelitian sebagian besar berfokus pada Indonesia**, meskipun terdapat beberapa literatur internasional yang relevan.  

Meskipun demikian, **hasil analisis ini tetap memberikan wawasan penting mengenai efektivitas dan tantangan dalam penerapan PWA untuk pembelajaran daring**, serta menjadi dasar bagi studi lebih lanjut yang lebih empiris dan terfokus pada implementasi nyata.  

---

## 3.1 Masalah Teknis dan Infrastruktur dalam Penyelenggaraan Pembelajaran Elektronik di Indonesia  

Dalam kajian literatur ini, ditemukan berbagai permasalahan teknis dan infrastruktur yang menjadi kendala utama dalam penyelenggaraan pembelajaran elektronik di Indonesia. Permasalahan tersebut dapat dikategorikan menjadi lima aspek utama: **keterbatasan infrastruktur jaringan internet**, **keterbatasan perangkat dan fasilitas pendukung**, **masalah teknis pada aplikasi pembelajaran**, **keterbatasan teknologi web tradisional**, serta **kendala pengembangan dan pemeliharaan aplikasi**.

### 3.1.1 Permasalahan Infrastruktur Jaringan Internet  
Salah satu hambatan terbesar dalam penyelenggaraan pembelajaran daring adalah **terbatasnya infrastruktur jaringan internet**, terutama di daerah terpencil. Kurnia (2022) menyebutkan bahwa keterbatasan akses internet menjadi faktor utama yang menghambat efektivitas pembelajaran elektronik. Tanpa konektivitas yang memadai, siswa dan guru mengalami kesulitan dalam mengakses materi pembelajaran, menghadiri kelas daring, dan berpartisipasi dalam diskusi interaktif secara real-time.  

Selain itu, Rica (2019) menambahkan bahwa lemahnya konektivitas internet, bahkan di daerah perkotaan dengan infrastruktur yang lebih baik, masih menjadi kendala utama dalam implementasi pembelajaran berbasis teknologi. Dalam konteks portal edukasi seperti **Rumah Belajar**, tantangan terbesar adalah ketidakstabilan jaringan yang menyebabkan siswa sulit mengakses konten pembelajaran secara berkelanjutan. Masalah ini diperparah dengan tingginya biaya akses internet bagi sebagian besar pengguna di Indonesia.  

### 3.1.2 Keterbatasan Perangkat dan Fasilitas Pendukung  
Selain masalah konektivitas, **keterbatasan perangkat dan infrastruktur teknologi** juga menjadi hambatan signifikan dalam pembelajaran daring. Menurut Azzahra, Abidin, dan Wulandari (2021), banyak guru di SMA yang menghadapi kendala akibat keterbatasan perangkat yang mereka miliki. Sebagian besar guru dan siswa masih menggunakan perangkat dengan spesifikasi rendah yang kurang mendukung aplikasi pembelajaran berbasis internet.  

Hal yang sama juga ditemukan dalam penelitian Hamela, Situmorang, dan Efendi (2022), yang mengungkapkan bahwa keterbatasan perangkat pendukung, seperti laptop dan tablet, menjadi tantangan utama dalam pemanfaatan Learning Management Systems (LMS). Selain perangkat, fasilitas pendukung seperti **laboratorium komputer, akses listrik yang stabil, dan ruang belajar yang memadai** juga menjadi faktor yang sering diabaikan dalam implementasi pembelajaran daring, terutama di sekolah-sekolah yang memiliki keterbatasan anggaran.  

### 3.1.3 Masalah Teknis pada Aplikasi Pembelajaran  
Banyaknya platform pembelajaran daring yang digunakan di Indonesia tidak selalu berarti solusi yang mudah diakses oleh semua pengguna. Sebaliknya, beberapa penelitian menunjukkan bahwa kompleksitas teknis dari aplikasi pembelajaran justru menjadi hambatan tersendiri.  

Ningsih (2024) menyoroti bahwa implementasi teknologi digital dalam pembelajaran sering kali terkendala oleh **kerumitan antarmuka aplikasi**, yang menyebabkan pengguna mengalami kesulitan dalam navigasi dan penggunaan fitur-fitur yang tersedia. Selain itu, beberapa platform juga mengalami **masalah kompatibilitas dengan berbagai perangkat**, terutama bagi pengguna yang masih menggunakan ponsel atau komputer dengan sistem operasi lama.  

Masalah serupa juga disampaikan dalam penelitian lain (Rica, 2019; Azzahra et al., 2021), yang menyebutkan bahwa beberapa aplikasi pembelajaran daring memiliki **kurangnya fitur aksesibilitas**, seperti mode akses untuk pengguna dengan keterbatasan fisik atau pilihan mode hemat data bagi pengguna dengan koneksi terbatas. Hal ini menunjukkan bahwa masih ada celah dalam pengembangan aplikasi pembelajaran yang perlu diperbaiki untuk memastikan aksesibilitas yang lebih luas.  

### 3.1.4 Keterbatasan Teknologi Web Tradisional  
Beberapa penelitian juga menyoroti keterbatasan aplikasi web tradisional yang masih banyak digunakan dalam pembelajaran daring. Menurut Hamela, Situmorang, dan Efendi (2022), aplikasi berbasis web yang tidak dioptimalkan sering kali menghadapi **masalah performa dan latensi tinggi**, terutama ketika digunakan dalam kondisi koneksi internet yang tidak stabil.  

Kelemahan utama dari web tradisional adalah ketergantungannya pada **koneksi internet yang terus-menerus**, sehingga ketika pengguna mengalami gangguan jaringan, aplikasi menjadi tidak responsif atau bahkan tidak dapat diakses sama sekali. Ini menyebabkan pengalaman pengguna yang buruk, terutama dalam pembelajaran daring yang membutuhkan akses cepat dan tanpa hambatan ke berbagai materi pembelajaran.  

Selain itu, beberapa aplikasi web tradisional masih menggunakan **arsitektur lama** yang tidak mendukung caching data yang efisien, sehingga tidak dapat memberikan pengalaman yang optimal dalam mode offline. Hal ini menjadi tantangan besar bagi siswa dan guru di daerah dengan infrastruktur jaringan yang tidak dapat diandalkan.  

### 3.1.5 Kendala Pengembangan dan Pemeliharaan Aplikasi  
Selain masalah pada aplikasi yang telah digunakan, tantangan lain yang ditemukan dalam literatur adalah **keterbatasan sumber daya dalam pengembangan dan pemeliharaan aplikasi pembelajaran daring**. Hamela, Situmorang, dan Efendi (2022) mengungkapkan bahwa banyak institusi pendidikan, terutama di tingkat sekolah, tidak memiliki tenaga teknis yang cukup untuk menangani pembaruan dan pemeliharaan sistem pembelajaran daring mereka.  

Karena keterbatasan sumber daya ini, banyak aplikasi mengalami **penurunan performa seiring waktu** akibat kurangnya pemeliharaan yang optimal. Dalam beberapa kasus, pengguna juga mengalami masalah dalam mendapatkan **dukungan teknis**, baik karena kurangnya dokumentasi yang jelas maupun terbatasnya tenaga ahli di sekolah dan universitas yang dapat membantu menyelesaikan kendala teknis yang mereka hadapi.  

Kondisi ini menunjukkan bahwa tantangan dalam implementasi pembelajaran daring tidak hanya berkaitan dengan infrastruktur jaringan dan perangkat keras, tetapi juga melibatkan aspek pemeliharaan jangka panjang dari sistem yang digunakan.  

## **3.2 Progressive Web Apps (PWA) dalam Konteks Pembelajaran Elektronik**

Literatur dalam kajian ini secara khusus membahas bagaimana **Progressive Web Apps (PWA)** digunakan untuk mengatasi permasalahan teknis dan infrastruktur dalam penyelenggaraan pembelajaran elektronik. Sejumlah penelitian menunjukkan bahwa PWA menawarkan berbagai keunggulan dalam hal **aksesibilitas, efisiensi, dan pengalaman pengguna**, yang menjadikannya solusi potensial bagi pembelajaran elektronik, terutama di wilayah dengan keterbatasan infrastruktur digital.

### **3.2.1 Kemampuan PWA dalam Mengatasi Kendala Konektivitas dan Mode Offline**  
Salah satu permasalahan utama dalam implementasi pembelajaran elektronik di Indonesia adalah **keterbatasan akses internet yang stabil dan andal**, terutama di daerah terpencil. Sejumlah penelitian menegaskan bahwa PWA dapat menjadi solusi efektif untuk mengatasi masalah ini melalui **fitur caching** yang memungkinkan aplikasi tetap dapat diakses meskipun tanpa koneksi internet (Roumeliotis & Tselikas, 2022; Correia et al., 2021).  
Teknologi **Service Worker** dalam PWA memainkan peran penting dalam memungkinkan aplikasi **beroperasi secara offline**, dengan menyimpan sumber daya aplikasi secara lokal. Fitur ini memastikan bahwa konten pembelajaran tetap tersedia bagi pengguna meskipun koneksi internet terputus (Tahir et al., 2021). Selain itu, mekanisme **sinkronisasi latar belakang (background synchronization)** memungkinkan data yang dibuat saat offline secara otomatis dikirim ke server begitu koneksi kembali tersedia, menjaga kesinambungan proses pembelajaran daring (Josephe et al., 2023).  
Beberapa penelitian bahkan mengusulkan **jalur komunikasi alternatif** seperti pengiriman data melalui SMS dalam kondisi tanpa koneksi internet sama sekali, yang dapat menjadi solusi inovatif bagi pembelajaran di daerah dengan infrastruktur jaringan yang sangat terbatas (Josephe et al., 2023).

### **3.2.2 Efisiensi dan Kinerja PWA dalam Pembelajaran Elektronik**  
Sejumlah studi mengungkapkan bahwa **PWA menawarkan peningkatan performa dibandingkan aplikasi web tradisional**, terutama dalam aspek **waktu muat (loading time), latensi, dan throughput** (Tahir et al., 2021; Pande et al., 2018).  
Caching yang lebih efisien dalam PWA memungkinkan pengurangan lalu lintas data hingga **25%**, menjadikannya solusi yang lebih ringan dibandingkan aplikasi web konvensional dalam kondisi jaringan yang lemah (Pande et al., 2018; Correia et al., 2021).  
Selain itu, penelitian lain menyoroti bahwa **efisiensi PWA juga terkait dengan konsumsi energi perangkat pengguna**. Meskipun fitur caching meningkatkan performa aplikasi, terdapat hubungan antara **peningkatan cache dan konsumsi energi perangkat**, yang dapat menjadi faktor penting dalam implementasi PWA untuk pembelajaran elektronik di perangkat dengan spesifikasi rendah (Malavolta et al., 2020; Kurniawan et al., 2022).

### **3.2.3 Kemudahan Implementasi dan Keunggulan PWA dibandingkan Aplikasi Native**  
Salah satu keunggulan utama PWA adalah kemudahannya dalam **distribusi dan instalasi**, karena aplikasi dapat diakses langsung melalui browser tanpa perlu diunduh dari toko aplikasi seperti Google Play Store atau Apple App Store (Cuenca-Enrique et al., 2024; Behl & Raj, 2018).  
Dibandingkan dengan aplikasi native, **PWA memiliki biaya pengembangan yang lebih rendah, lebih mudah diperbarui, serta lebih ringan dalam penggunaan sumber daya perangkat** (Huber et al., 2021).  
Studi menunjukkan bahwa implementasi PWA menggunakan **framework seperti Angular dan pemanfaatan Service Worker** dapat meningkatkan performa aplikasi secara signifikan, mendekati pengalaman aplikasi native (Tahir et al., 2021). Hal ini menjadikan PWA sebagai alternatif yang menarik untuk pengembangan sistem pembelajaran elektronik yang **fleksibel, hemat biaya, dan tidak bergantung pada ekosistem aplikasi tertentu**.

### **3.2.4 Dampak PWA terhadap Pengalaman dan Aksesibilitas Pengguna**  
PWA juga membawa dampak positif terhadap **pengalaman dan aksesibilitas pengguna dalam pembelajaran elektronik**. Studi menunjukkan bahwa **fitur push notifications** dalam PWA dapat meningkatkan keterlibatan pengguna, memungkinkan interaksi yang lebih aktif dalam proses pembelajaran daring (Jeong & Hur, 2022).  
Selain itu, PWA dinilai **lebih aksesibel dibandingkan aplikasi web konvensional**, terutama bagi pengguna dengan disabilitas. Namun, masih diperlukan **audit aksesibilitas secara berkala** agar aplikasi PWA benar-benar sesuai dengan standar WCAG (Web Content Accessibility Guidelines) dan dapat diakses secara optimal oleh semua kelompok pengguna (Roumeliotis & Tselikas, 2022).  
Sebagai bukti keberhasilan implementasi, sebuah studi kasus di komunitas pedesaan **Ngäbe Buglé, Panama** menunjukkan bahwa penggunaan PWA dapat meningkatkan akses pendidikan secara signifikan di daerah dengan keterbatasan infrastruktur teknologi, yang dapat menjadi referensi bagi daerah pedesaan di Indonesia (Cuenca-Enrique et al., 2024).

### **3.2.5 Keamanan dan Tantangan Implementasi PWA**  
Meskipun memiliki banyak keunggulan, beberapa penelitian menyoroti **potensi risiko keamanan dalam implementasi PWA**. Penggunaan **Service Worker** memungkinkan fitur seperti push notifications dan caching, tetapi juga membuka peluang eksploitasi untuk serangan **phishing, penyadapan informasi lokasi, serta penyalahgunaan cache untuk script injection dan mining cryptocurrency** (Jeong & Hur, 2022).  
Oleh karena itu, pengembang yang menerapkan PWA untuk pembelajaran elektronik harus memperhatikan aspek **keamanan aplikasi**, termasuk perlindungan terhadap serangan siber yang dapat merugikan pengguna.

### **3.2.6 Gap Penelitian yang Ditemukan**  

Meskipun penelitian sebelumnya telah mengidentifikasi **keunggulan arsitektural dan fungsional PWA**, masih terdapat **gap dalam evaluasi teknis yang lebih mendalam**, terutama dalam konteks rekayasa perangkat lunak untuk pendidikan daring di daerah dengan akses terbatas. Sebagian besar literatur lebih menyoroti aspek konseptual dan manfaat umum PWA (Roumeliotis & Tselikas, 2022; Correia et al., 2021), tetapi belum banyak studi yang **mengukur performa PWA secara empiris dalam kondisi infrastruktur terbatas**, termasuk dalam aspek **efisiensi caching, latensi jaringan, dan manajemen sumber daya perangkat dengan spesifikasi rendah**. Meskipun Service Worker telah diidentifikasi sebagai komponen utama yang memungkinkan mode offline (Tahir et al., 2021), penelitian yang mengeksplorasi **strategi optimasi caching untuk konten pembelajaran interaktif seperti video atau simulasi berbasis web** masih terbatas. Padahal, dalam konteks pembelajaran daring, strategi caching yang efisien dapat berkontribusi pada **pengurangan beban jaringan serta peningkatan pengalaman pengguna**, terutama di wilayah dengan keterbatasan infrastruktur (Correia et al., 2021).  

Selain performa teknis, **evaluasi komparatif terhadap efisiensi konsumsi energi antara PWA dan aplikasi native dalam pembelajaran elektronik** masih kurang mendapat perhatian. Studi sebelumnya menunjukkan bahwa **implementasi caching dalam PWA berpotensi meningkatkan konsumsi daya perangkat pengguna**, meskipun tetap lebih efisien dibandingkan beberapa teknologi aplikasi lintas platform lainnya seperti React Native dan Flutter (Huber et al., 2021). Namun, penelitian lebih lanjut diperlukan untuk **mengidentifikasi bagaimana desain arsitektur PWA dapat dioptimalkan guna mengurangi konsumsi energi**, terutama untuk perangkat dengan **spesifikasi rendah yang sering digunakan di daerah dengan keterbatasan daya dan konektivitas** (Kurniawan et al., 2022). Dalam rekayasa perangkat lunak, optimalisasi konsumsi daya sangat penting untuk memastikan bahwa aplikasi dapat berjalan secara efisien tanpa membebani prosesor atau baterai pengguna, khususnya di lingkungan dengan keterbatasan infrastruktur digital.

Aspek lain yang masih kurang dieksplorasi adalah **keamanan arsitektur PWA dalam lingkungan pembelajaran daring**. Beberapa penelitian telah mengidentifikasi potensi risiko keamanan, seperti **serangan melalui push notifications, eksploitasi caching untuk menyisipkan skrip berbahaya, serta penyalahgunaan sinkronisasi latar belakang untuk mengakses data pengguna secara tidak sah** (Jeong & Hur, 2022). Namun, belum banyak studi yang secara spesifik membahas **model mitigasi risiko untuk PWA dalam sistem pendidikan berbasis cloud**. Dalam rekayasa perangkat lunak, diperlukan **strategi keamanan berbasis enkripsi, otentikasi multi-faktor, serta mekanisme deteksi anomali dalam Service Worker** guna memastikan bahwa PWA tetap aman digunakan dalam ekosistem pembelajaran daring (Jeong & Hur, 2022). Oleh karena itu, penelitian lebih lanjut diperlukan dalam aspek **performa, efisiensi sumber daya, dan keamanan PWA**, guna memastikan bahwa teknologi ini dapat diterapkan secara optimal sebagai solusi pembelajaran daring yang berkelanjutan, terutama dalam kondisi infrastruktur yang terbatas.

## 3.3 Alternatif Solusi Teknologi untuk Penyampaian Pembelajaran Elektronik

Selain penggunaan Progressive Web Apps (PWA), literatur juga mengidentifikasi berbagai alternatif solusi teknologi yang digunakan dalam penyampaian pembelajaran elektronik.

### 3.3.1 Learning Management System (LMS) Tradisional

Beberapa referensi mengkaji penggunaan Learning Management System (LMS) sebagai solusi utama dalam penyelenggaraan pembelajaran elektronik. LMS seperti Moodle, Google Classroom, dan Edmodo banyak digunakan karena memiliki fitur lengkap yang mendukung interaksi guru-siswa secara terstruktur. Hamela, Situmorang, dan Efendi (2022) menekankan bahwa LMS memberikan manfaat dalam pengelolaan kelas daring secara efisien, termasuk dalam pengelolaan tugas, ujian, dan komunikasi antara guru serta siswa. Namun, LMS juga memiliki keterbatasan, terutama dalam hal kebutuhan konektivitas internet yang stabil dan ketergantungan pada infrastruktur teknologi yang memadai (Ningsih, 2024).

### 3.3.2 Aplikasi Mobile Native

Referensi lainnya menyoroti penggunaan aplikasi mobile native sebagai alternatif yang umum digunakan, khususnya di daerah dengan akses internet yang lebih stabil. Aplikasi mobile native, yang dikembangkan secara khusus untuk platform Android atau iOS, menawarkan performa yang lebih baik dibandingkan aplikasi berbasis web. Kelebihan aplikasi native meliputi pengalaman pengguna yang lebih responsif serta optimalisasi penggunaan perangkat keras, seperti kamera dan sensor perangkat (Kurnia, 2022). Namun, pengembangan aplikasi native memerlukan biaya lebih tinggi serta proses distribusi yang lebih kompleks melalui platform seperti Google Play Store dan Apple App Store (Rica, 2019).

### 3.3.3 Aplikasi Hybrid dan Cross-platform

Meskipun tidak ditemukan referensi eksplisit dalam literatur yang dianalisis terkait penggunaan aplikasi hybrid atau cross-platform dalam pembelajaran elektronik, solusi ini sering kali digunakan sebagai pendekatan alternatif. Aplikasi hybrid menggabungkan keunggulan aplikasi berbasis web dan aplikasi native, dengan kelebihan dalam pengembangan yang lebih cepat serta kemudahan dalam pembaruan. Teknologi seperti Flutter dan React Native umumnya digunakan untuk memungkinkan aplikasi berjalan di berbagai sistem operasi tanpa memerlukan pengembangan terpisah untuk setiap platform.

### 3.3.4 Teknologi Alternatif Lainnya

Selain LMS dan aplikasi mobile native, beberapa referensi membahas alternatif teknologi lainnya dalam penyampaian pembelajaran elektronik. Contohnya, teknologi berbasis cloud yang memungkinkan penyimpanan dan akses materi secara fleksibel melalui berbagai perangkat (Ningsih, 2024). Selain itu, ada pula pendekatan berbasis Single Page Application (SPA), yang memungkinkan pengalaman aplikasi web yang lebih interaktif dengan pemuatan halaman yang lebih cepat dan efisien. Pendekatan ini dianggap sebagai solusi potensial dalam mengatasi kendala teknis yang sering dihadapi dalam pembelajaran daring (Selly Puspita Azzahra et al., 2021).

## **4. Evaluasi Teknis Usulan untuk Progressive Web Apps dalam LMS**

Evaluasi teknis diperlukan untuk memastikan bahwa **Progressive Web Apps (PWA) dalam Learning Management System (LMS)** dapat menjadi solusi yang efektif dalam menghadapi tantangan teknis pembelajaran elektronik. Evaluasi ini berfokus pada **performa, efisiensi sumber daya, dan kegunaan teknis** dengan pendekatan pengujian yang berbasis pada **benchmarking terhadap LMS berbasis web tradisional (Moodle berbasis web) dibandingkan dengan Moodle berbasis PWA**. 

Pendekatan ini bertujuan untuk mengukur apakah PWA benar-benar memberikan keunggulan dalam kecepatan, keandalan, efisiensi sumber daya, serta pengalaman pengguna, terutama dalam kondisi konektivitas yang terbatas. Berikut adalah rincian metodologi yang akan digunakan dalam evaluasi ini.

### **4.1 Evaluasi Performa (Performance Testing)**

Evaluasi performa bertujuan untuk mengukur **seberapa cepat, responsif, dan efisien PWA dalam LMS dibandingkan dengan LMS berbasis web tradisional**. Pengujian ini berfokus pada **waktu muat halaman, efisiensi bandwidth, penggunaan CPU/memori, serta konsumsi energi**.

#### **4.1.1 Waktu Muat Halaman (Load Time) dan Responsivitas (Response Time)**

Kecepatan dalam memuat halaman dan merespons interaksi pengguna merupakan faktor utama dalam menentukan kualitas pengalaman pengguna. PWA yang baik harus mampu **memuat halaman dengan lebih cepat dibandingkan aplikasi berbasis web tradisional**, terutama dalam kondisi jaringan yang kurang stabil.

- **Metode Pengujian:**  
  - Pengukuran dilakukan menggunakan **Google Lighthouse**, **WebPageTest**, dan **GTmetrix** untuk menganalisis waktu muat halaman pertama dan interaktivitas aplikasi.
  - Pembandingan dilakukan antara **PWA berbasis Moodle** dan **Moodle berbasis web tradisional**.
- **Hasil yang Diharapkan:**  
  - PWA diharapkan dapat memanfaatkan **Service Worker** untuk caching, sehingga mengurangi waktu muat halaman dan meningkatkan responsivitas dibandingkan LMS berbasis web tradisional.

#### **4.1.2 Efisiensi Penggunaan Bandwidth (Data Usage)**

Efisiensi penggunaan bandwidth menjadi penting, terutama bagi pengguna di daerah dengan akses internet terbatas. PWA dapat mengurangi konsumsi data dengan **memanfaatkan mekanisme caching yang memungkinkan data yang sudah pernah diakses tidak perlu dimuat ulang**.

- **Metode Pengujian:**  
  - Simulasi akses ke berbagai halaman LMS menggunakan **Chrome DevTools Network Throttling** dengan skenario konektivitas berbeda (**Wi-Fi cepat, 4G, 3G, dan offline**).
  - Pengukuran jumlah data yang ditransfer selama sesi pembelajaran dalam setiap kondisi jaringan.
- **Hasil yang Diharapkan:**  
  - PWA diharapkan mampu menghemat bandwidth dengan **mengurangi permintaan jaringan berulang** melalui mekanisme caching yang optimal.

#### **4.1.3 Penggunaan CPU dan Memori (Resource Consumption)**

Salah satu aspek penting dalam evaluasi performa adalah efisiensi penggunaan CPU dan memori. **Aplikasi yang boros dalam penggunaan sumber daya dapat menyebabkan kinerja perangkat melambat, terutama pada perangkat dengan spesifikasi rendah**.

- **Metode Pengujian:**  
  - Menggunakan **Chrome Task Manager** untuk melihat pemanfaatan CPU dan memori selama aktivitas pembelajaran dalam LMS.
  - Membandingkan konsumsi sumber daya antara **PWA berbasis Moodle** dan **Moodle berbasis web tradisional** saat membuka materi, mengerjakan kuis, dan mengakses konten multimedia.
- **Hasil yang Diharapkan:**  
  - PWA diharapkan memiliki penggunaan CPU dan memori yang lebih optimal dibandingkan LMS berbasis web karena **memanfaatkan caching untuk mengurangi permintaan jaringan yang berat**.

#### **4.1.4 Konsumsi Energi (Battery Consumption)**

Efisiensi energi merupakan faktor penting dalam penggunaan LMS berbasis PWA. Berdasarkan studi **Huber et al. (2022)**, konsumsi energi pada PWA dipengaruhi oleh **browser engine, metode caching, dan interaksi UI**.

- **Metode Pengujian:**  
  - Menggunakan **Battery Historian (Android)** dan **Power Profiler** untuk mengukur konsumsi energi saat menggunakan Moodle berbasis PWA dibandingkan Moodle berbasis web tradisional.
  - Mengamati pengaruh **browser engine yang berbeda** terhadap konsumsi daya saat menjalankan LMS berbasis PWA.
- **Hasil yang Diharapkan:**  
  - Konsumsi energi PWA diharapkan lebih efisien dibandingkan aplikasi web tradisional, meskipun mungkin masih lebih tinggi dibandingkan aplikasi native.

### **4.2 Efisiensi Sumber Daya (Resource Usage Testing)**

Evaluasi ini bertujuan untuk menilai bagaimana PWA dalam LMS **mengelola sumber daya perangkat secara efisien**, terutama dalam kondisi koneksi yang buruk atau tanpa koneksi.

#### **4.2.1 Pengelolaan Cache dan Mode Offline**

Salah satu fitur unggulan PWA adalah **kemampuannya untuk tetap berfungsi dalam kondisi offline dengan caching konten secara efisien**. Evaluasi ini bertujuan untuk mengukur sejauh mana LMS berbasis PWA mampu **menyediakan akses ke materi pembelajaran meskipun tanpa koneksi internet**.

- **Metode Pengujian:**  
  - Simulasi penggunaan LMS **dalam mode offline** menggunakan **Chrome DevTools Offline Mode**.
  - Evaluasi bagaimana **Service Worker menangani caching dan penyajian konten pembelajaran**.
  - Menggunakan **Workbox dari Google** untuk menganalisis strategi caching yang diterapkan.
- **Hasil yang Diharapkan:**  
  - LMS berbasis PWA harus mampu **memuat halaman dan materi pembelajaran secara offline dengan caching yang optimal**.

#### **4.2.2 Skalabilitas (Scalability Testing)**

Skalabilitas menjadi faktor penting ketika jumlah pengguna meningkat. LMS berbasis PWA harus mampu **menangani peningkatan jumlah pengguna tanpa mengalami degradasi performa**.

- **Metode Pengujian:**  
  - Menggunakan **Apache JMeter** untuk melakukan **stress testing** terhadap LMS berbasis PWA.
  - Mengukur respons sistem saat jumlah pengguna meningkat secara signifikan.
- **Hasil yang Diharapkan:**  
  - PWA harus dapat menangani jumlah pengguna yang lebih besar dibandingkan LMS berbasis web tradisional dengan memanfaatkan **strategi caching dan optimalisasi performa**.

### **4.3 Pengujian Kegunaan Teknis (Technical Usability Testing)**

Selain performa dan efisiensi sumber daya, LMS berbasis PWA harus **mudah digunakan secara teknis** tanpa memerlukan konfigurasi tambahan yang kompleks.

#### **4.3.1 Kemudahan Navigasi dan Interaksi**

Evaluasi ini bertujuan untuk mengukur bagaimana **struktur navigasi dan desain antarmuka pengguna dalam LMS berbasis PWA** mempengaruhi pengalaman pengguna.

- **Metode Pengujian:**  
  - Menggunakan **Google Lighthouse Usability Score** dan **Heatmap Tracking** untuk melihat pola navigasi pengguna.
  - Simulasi akses pengguna dari berbagai perangkat (PC, tablet, ponsel).
- **Hasil yang Diharapkan:**  
  - LMS berbasis PWA harus menawarkan navigasi yang lebih intuitif dibandingkan LMS berbasis web.

#### **4.3.2 Pengalaman Pengguna Offline vs Online**

Dalam lingkungan dengan konektivitas yang terbatas, **LMS berbasis PWA harus tetap fungsional dan memberikan pengalaman yang mendekati penggunaan online**.

- **Metode Pengujian:**  
  - Simulasi penggunaan **LMS berbasis PWA dalam kondisi koneksi tidak stabil** untuk melihat bagaimana konten dapat diakses.
- **Hasil yang Diharapkan:**  
  - LMS berbasis PWA harus mampu memberikan pengalaman yang hampir sama baik dalam mode online maupun offline.

#### **4.3.3 Aksesibilitas di Berbagai Perangkat**

Aksesibilitas menjadi faktor penting untuk memastikan bahwa LMS berbasis PWA dapat digunakan di berbagai jenis perangkat.

- **Metode Pengujian:**  
  - Pengujian kompatibilitas dengan **BrowserStack atau LambdaTest**.
  - Evaluasi bagaimana **PWA menyesuaikan tampilan pada berbagai perangkat**.
- **Hasil yang Diharapkan:**  
  - LMS berbasis PWA harus responsif dan dapat diakses dengan baik dari berbagai ukuran layar dan sistem operasi.

---

## **5. Kesimpulan, Keterbatasan, dan Studi Lanjutan**

### **5.1 Kesimpulan**  
Berdasarkan hasil tinjauan literatur yang dilakukan dalam kajian ini, dapat disimpulkan bahwa **Progressive Web Apps (PWA) memiliki potensi besar sebagai solusi teknis dalam penyelenggaraan pembelajaran elektronik di Indonesia**, terutama dalam mengatasi berbagai tantangan infrastruktur dan keterbatasan teknis yang dihadapi dalam implementasi Learning Management System (LMS) berbasis web.  

Secara spesifik, PWA menawarkan **keunggulan dalam efisiensi penggunaan sumber daya, fleksibilitas akses melalui berbagai perangkat, serta kemampuan untuk tetap berfungsi dalam kondisi konektivitas terbatas melalui fitur caching dan Service Worker**. Dengan karakteristik tersebut, PWA menjadi alternatif yang menarik dibandingkan dengan LMS berbasis web tradisional, native apps, maupun hybrid apps.  

Namun demikian, **kajian yang telah dilakukan juga mengungkap beberapa celah penelitian yang masih perlu dieksplorasi lebih lanjut**, terutama dalam aspek evaluasi teknis secara mendalam, studi kasus di wilayah dengan infrastruktur terbatas, serta analisis komparatif langsung antara PWA dan LMS berbasis teknologi lain.

### **5.2 Keterbatasan Penelitian**  
Meskipun kajian ini telah mengidentifikasi berbagai keunggulan teknis PWA serta tantangan yang dihadapi dalam implementasi LMS berbasis web di Indonesia, terdapat beberapa keterbatasan dalam penelitian ini yang perlu diperhatikan:

1. **Keterbatasan dalam Evaluasi Teknis Terstruktur**  
   - Sebagian besar penelitian yang tersedia saat ini hanya membahas manfaat umum PWA, seperti **kemampuan offline, performa responsif, dan efisiensi distribusi**, tanpa adanya evaluasi teknis yang lebih terstruktur.  
   - Minimnya penelitian yang menguji **kinerja PWA dalam kondisi jaringan sangat terbatas**, evaluasi keamanan aplikasi, serta analisis penggunaan sumber daya pada perangkat dengan spesifikasi rendah menjadi celah yang perlu ditindaklanjuti lebih lanjut.  

2. **Kurangnya Studi Kasus di Wilayah dengan Infrastruktur Terbatas**  
   - Studi-studi yang tersedia lebih banyak berfokus pada pengembangan PWA dalam lingkungan yang memiliki akses jaringan yang relatif baik.  
   - Masih sedikit penelitian yang secara spesifik **mengevaluasi implementasi PWA dalam LMS di daerah terpencil dengan akses internet terbatas**, padahal tantangan utama pembelajaran daring di Indonesia justru berkaitan dengan **disparitas infrastruktur digital antar wilayah**.  

3. **Minimnya Evaluasi Perbandingan Langsung dengan LMS Berbasis Teknologi Lain**  
   - Hingga saat ini, penelitian yang membahas PWA dalam LMS masih dilakukan secara terpisah, tanpa adanya studi **komparatif langsung** dengan **LMS berbasis web tradisional, native apps, atau hybrid apps**.  
   - Evaluasi yang lebih mendalam mengenai **performa, konsumsi sumber daya, serta pengalaman pengguna dalam berbagai skenario penggunaan** masih sangat dibutuhkan untuk memahami posisi strategis PWA di antara solusi teknologi lain yang telah digunakan dalam e-learning.  

### **5.3 Studi Lanjutan yang Direkomendasikan**  
Untuk menjembatani gap penelitian yang telah diidentifikasi, studi lanjutan diperlukan guna mengevaluasi efektivitas PWA sebagai instrumen pembelajaran daring secara lebih mendalam. Berikut beberapa aspek yang direkomendasikan untuk diteliti lebih lanjut:

1. **Evaluasi Performa dalam Berbagai Skenario Jaringan**  
   - Studi lanjutan perlu melakukan **pengujian empiris terhadap kinerja PWA dalam berbagai kondisi jaringan**, termasuk Wi-Fi cepat, 4G, 3G, dan bahkan dalam mode offline.  
   - Pengukuran teknis yang lebih detail terhadap **waktu muat halaman (Load Time), responsivitas aplikasi (Response Time), serta efisiensi konsumsi bandwidth** perlu dilakukan untuk memastikan PWA benar-benar mampu mengatasi tantangan teknis yang ada.  

2. **Analisis Efisiensi Penggunaan Sumber Daya**  
   - Studi lebih lanjut perlu mengevaluasi **penggunaan CPU, RAM, storage, serta konsumsi energi** dari LMS berbasis PWA dibandingkan dengan LMS berbasis web tradisional.  
   - Uji coba pada berbagai perangkat, termasuk **smartphone dan laptop dengan spesifikasi rendah**, akan memberikan wawasan mengenai seberapa ringan dan efisien PWA dalam konteks pembelajaran daring.  

3. **Pengujian Keandalan dan Skalabilitas PWA dalam Pembelajaran Daring**  
   - Simulasi **penggunaan LMS berbasis PWA oleh jumlah pengguna yang besar** perlu dilakukan untuk menilai sejauh mana aplikasi ini dapat menangani beban yang tinggi tanpa mengalami degradasi performa.  
   - Studi tentang **cara PWA menangani kegagalan sistem serta tingkat crash/error pada berbagai skenario penggunaan** juga penting untuk memastikan bahwa teknologi ini benar-benar dapat diandalkan dalam implementasi skala besar.  

4. **Studi Kasus Implementasi PWA dalam LMS di Daerah dengan Konektivitas Terbatas**  
   - Evaluasi empiris di lapangan, terutama di daerah dengan akses internet terbatas, diperlukan untuk memahami sejauh mana PWA dapat memberikan manfaat nyata dalam meningkatkan akses pembelajaran daring bagi siswa dan tenaga pendidik.  
   - Studi ini juga dapat mengeksplorasi bagaimana pengguna di daerah dengan keterbatasan infrastruktur merespons pengalaman penggunaan LMS berbasis PWA dibandingkan dengan LMS berbasis web tradisional.  

5. **Keamanan dan Privasi dalam PWA untuk LMS**  
   - Mengingat PWA mengandalkan **Service Worker dan mekanisme caching**, diperlukan studi yang lebih mendalam tentang potensi risiko keamanan, seperti **manipulasi data offline, serangan XSS (Cross-Site Scripting), serta penyimpanan informasi sensitif dalam cache**.  
   - Studi tentang **implementasi standar keamanan yang lebih baik** dalam LMS berbasis PWA juga dapat menjadi kontribusi penting dalam pengembangan sistem pembelajaran daring yang lebih aman dan terpercaya.  

### **5.4 Implikasi Penelitian bagi Rekayasa Perangkat Lunak**  
Penelitian ini memberikan implikasi yang penting bagi bidang **rekayasa perangkat lunak**, khususnya dalam pengembangan LMS berbasis PWA. Dari temuan yang telah diidentifikasi, terdapat beberapa aspek yang dapat menjadi **panduan bagi pengembang sistem e-learning berbasis PWA**:

- **Optimasi Performa**  
  - Pengembang LMS berbasis PWA perlu lebih fokus pada **optimasi waktu muat halaman, caching strategi yang lebih efisien, serta responsivitas aplikasi**, terutama untuk penggunaan dalam kondisi jaringan yang tidak stabil.  

- **Pengelolaan Sumber Daya**  
  - Desain arsitektur LMS berbasis PWA harus **meminimalkan penggunaan CPU dan RAM**, agar tetap dapat berjalan dengan baik di perangkat dengan spesifikasi rendah.  

- **Keamanan Data**  
  - Pengembangan PWA dalam LMS perlu memperhatikan standar keamanan yang lebih tinggi, termasuk **enkripsi data, pengelolaan cache yang lebih aman, serta perlindungan terhadap ancaman serangan berbasis web**.  

- **Pengujian dan Validasi Lebih Lanjut**  
  - Studi lanjutan diperlukan untuk **melakukan pengujian skala besar**, sehingga dapat diperoleh gambaran yang lebih akurat mengenai **seberapa jauh PWA dapat bersaing dengan solusi LMS berbasis teknologi lain**.  

Dengan adanya studi lanjutan yang berfokus pada aspek-aspek tersebut, diharapkan PWA dapat semakin berkembang sebagai **solusi teknis yang andal, efisien, dan adaptif dalam mendukung sistem pembelajaran elektronik di Indonesia**. Hal ini akan membantu institusi pendidikan, pengembang LMS, serta pemangku kepentingan lainnya dalam **memilih dan mengimplementasikan solusi teknologi yang paling sesuai dengan kebutuhan pembelajaran daring di era digital ini**.

---

### **Daftar Pustaka**  

1. Adi, L., Akbar, R. J., & Khotimah, W. N. (2018). **Platform e-Learning untuk Pembelajaran Pemrograman Web Menggunakan Konsep Progressive Web Apps.** *Jurnal Teknik ITS, 6*(2). https://doi.org/10.12962/j23373539.v6i2.24291  

2. Azzahra, S. P., Abidin, F. A., Susiati, E., & Cahyadi, S. (2021). **Tantangan dan Upaya Guru SMA Dalam Melaksanakan Pembelajaran Jarak Jauh.** *Lectura: Jurnal Pendidikan, 12*(2), 108–121. https://doi.org/10.31849/lectura.v12i2.7160  

3. Behl, K., & Raj, G. (2018). **Architectural Pattern of Progressive Web and Background Synchronization.** *2018 International Conference on Advances in Computing and Communication Engineering (ICACCE)*, 366–371. https://doi.org/10.1109/ICACCE.2018.8441701  

4. Camarini, N. P. I., Riastini, P. N., & Suarjana, I. M. (2024). **Permasalahan Penggunaan Aplikasi Digital: Studi Masalah Guru Sekolah Dasar.** *Jurnal Media Dan Teknologi Pendidikan, 4*(2), 158–165. https://doi.org/10.23887/jmt.v4i2.62701  

5. Correia, F., Ribeiro, O., & Silva, J. C. (2021). **Progressive Web Apps Development: Study of Caching Mechanisms.** *Proceedings - 2021 21st International Conference on Computational Science and Its Applications (ICCSA)*, 181–187. https://doi.org/10.1109/ICCSA54496.2021.00033  

6. Cuenca-Enrique, C., del-Río-Carazo, L., Iglesias-Pradas, S., Acquila-Natale, E., Chaparro-Peláez, J., Voinov, I. A., Fernández, J. G. M., & Martínez, C. R. (2024). **Progressive Web Apps: An Optimal Solution for Rural Communities in Developing Countries?** *Lecture Notes in Networks and Systems, 801*, 356–365. https://doi.org/10.1007/978-3-031-45648-0_35  

7. Hamela, S. S., Situmorang, I., & Efendi, S. (2022). **The Effectiveness of Using Learning Management System (LMS) in Blended Learning Model in The Learning System of 4.0 Era.** *Jurnal Mantik, 1*(1), 417–422. https://www.iocscience.org/ejournal/index.php/mantik/article/view/2258  

8. Huber, S., Demetz, L., & Felderer, M. (2021). **PWA vs the Others: A Comparative Study on the UI Energy-Efficiency of Progressive Web Apps.** *Lecture Notes in Computer Science, 12706*, 464–479. https://doi.org/10.1007/978-3-030-74296-6_35  

9. Huber, S., Demetz, L., & Felderer, M. (2022). **A Comparative Study on the Energy Consumption of Progressive Web Apps.** *Information Systems, 108*. https://doi.org/10.1016/j.is.2022.102017  

10. Jeong, Y., & Hur, J. (2022). **A Survey on Vulnerabilities of Service Workers.** *International Conference on ICT Convergence (ICTC)*, 2080–2082. https://doi.org/10.1109/ICTC55196.2022.9952818  

11. Jiménez-Honrado, J., Gómez García, J., Costa-Tebar, F., Marco, F. A., Gallud, J. A., & Sebastián Rivera, G. (2024, June 19). **Progressive Web Application for Storytelling Therapy Support.** *ACM International Conference Proceeding Series.* https://doi.org/10.1145/3657242.3658588  

12. Josephe, A. O., Chrysoulas, C., Peng, T., Boudani, B. el, Iatropoulos, I., & Pitropakis, N. (2023). **Progressive Web Apps to Support (Critical) Systems in Low or No Connectivity Areas.** *2023 IEEE IAS Global Conference on Emerging Technologies, GlobConET 2023.* https://doi.org/10.1109/GlobConET56651.2023.10150058  

13. Kurnia, F. (2022). **Pendidikan Berbasis Teknologi (Permasalahan dan Tantangan).** *Tarbawi: Journal Studi Pendidikan Islam, 10*, 205–221. https://doi.org/10.55757/tarbawi  

14. Kurniawan, W., Fatwanto, A., & Korespondensi, P. (2022). **Hubungan Antara Cache, Energy Consumption dan Runtime Performance pada Progressive Web Apps.** *Jurnal Teknologi Informasi dan Ilmu Komputer (JTIIK), 9*(2), 293–302. https://doi.org/10.25126/jtiik.202294993  

15. Mahadin, M., Rochalina, C. I., & Ibrahim, N. (2022). **Challenges of E-Learning Effectiveness During the Covid-19 Pandemic in Historical Subjects.** *Journal of Education Research and Evaluation, 6*(2), 348–357. https://doi.org/10.23887/jere.v6i2.43573  

16. Malavolta, I., Chinnappan, K., Jasmontas, L., Gupta, S., & Soltany, K. A. K. (2020). **Evaluating the Impact of Caching on the Energy Consumption and Performance of Progressive Web Apps.** *2020 IEEE/ACM 7th International Conference on Mobile Software Engineering and Systems, MOBILESoft 2020*, 109–119. https://doi.org/10.1145/3387905.3388593  

17. Ningsih, E. P. (2024). **Implementasi Teknologi Digital dalam Pendidikan: Manfaat dan Hambatan.** *EduTech Journal, 1*(1), 1–8. https://doi.org/10.62872/qbp1fg61  

18. Pande, N., Somani, A., Prasad Samal, S., & Kakkirala, V. (2018). **Enhanced Web Application and Browsing Performance through Service-Worker Infusion Framework.** *Proceedings - 2018 IEEE International Conference on Web Services (ICWS)*, 195–202. https://doi.org/10.1109/ICWS.2018.00032  

19. Rica, Y. (2019). **Pemanfaatan Portal Rumah Belajar untuk Meningkatkan Kompetensi Teknologi Informasi dan Komunikasi Guru Daerah Tertinggal.** *TEKNODIK, 23*(2). https://doi.org/10.32550/teknodik.v0i1.514  

20. Roumeliotis, K. I., & Tselikas, N. D. (2022). **Evaluating Progressive Web App Accessibility for People with Disabilities.** *Network, 2*(2), 350–369. https://doi.org/10.3390/network2020022  

21. Schmetz, A., & Kampker, A. (2024). **Evaluation of Offline Data Synchronization Approaches in Data-Intense Manufacturing.** *IFAC-PapersOnLine, 58*(27), 1316–1321. https://doi.org/10.1016/j.procir.2024.10.245  

22. Tahir, Z., Ilham, A. A., Niswar, M., Adnan, & Fauzy, A. A. (2021). **Progressive Web Apps Development and Analysis with Angular Framework and Service Worker for E-Commerce System.** *2021 IEEE International Conference on Computing, ICOCO 2021*, 192–195. https://doi.org/10.1109/ICOCO53166.2021.9673557  

23. Jiménez-Honrado, J., Gómez García, J., Costa-Tebar, F., Marco, F. A., Gallud, J. A., & Sebastián Rivera, G. (2024, June 19). Progressive Web Application for Storytelling Therapy Support. ACM International Conference Proceeding Series. https://doi.org/10.1145/3657242.3658588