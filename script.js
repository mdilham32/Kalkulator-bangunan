function formatRupiah(angka) {
    return "Rp" + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  
  function updateTypeOptions() {
    const jenis = document.getElementById('jenis').value;
    const renovasiOptions = document.getElementById('renovasiOptions');
    
    if (jenis === 'renovasi') {
      renovasiOptions.style.display = 'block';
    } else {
      renovasiOptions.style.display = 'none';
      document.getElementById('renovasiToiletOptions').style.display = 'none';
    }
  }
  
  function updateRenovasiOptions() {
    const tipeRenovasi = document.getElementById('tipeRenovasi').value;
    const toiletOptions = document.getElementById('renovasiToiletOptions');
    
    if (tipeRenovasi === 'toilet') {
      toiletOptions.style.display = 'block';
      // Add event listeners for toggle switches
      document.querySelectorAll('.toggle-switch input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          const parentItem = this.closest('.toggle-item');
          if (this.checked) {
            parentItem.classList.add('active');
          } else {
            parentItem.classList.remove('active');
          }
        });
      });
    } else {
      toiletOptions.style.display = 'none';
    }
  }
  
  function hitungAtapPlafon(luas) {
    const acuan = 60.48; // m2 dari RAB awal
    const rasio = luas / acuan;
  
    const pekerjaan = [
      { nama: "Mobilisasi & Demobilisasi", total: 500000 },
      { nama: "Bongkaran", total: 1000000 },
      { nama: "Gypsum + Rangka Hollow", total: 12096000 * rasio },
      { nama: "Lis Plafond GRC", total: 6090000 * rasio },
      { nama: "Plafond Water Resistant", total: 860800 * rasio },
      { nama: "Rangka Atap", total: 27652219.32 * rasio },
      { nama: "Penutup Atap", total: 8055936 * rasio },
      { nama: "Pengecatan Plafond Interior", total: 2661120 * rasio },
      { nama: "Pengecatan Lis Plafond", total: 2661120 * rasio },
      { nama: "Instalasi Lampu", total: 464000 * rasio },
      { nama: "Instalasi Saklar", total: 232000 * rasio }
    ];
  
    let total = 0;
    pekerjaan.forEach(item => {
      total += item.total;
    });
  
    // Rentang harga estimasi
    const minRange = Math.round(total * 0.9);  // 10% kurang dari total
    const maxRange = Math.round(total * 1.1);  // 10% lebih dari total
  
    return `
      <strong>Jenis: Renovasi Atap & Plafon</strong><br>
      <p>Estimasi rentang harga: </p>
      <div class="total">${formatRupiah(minRange)} - ${formatRupiah(maxRange)}</div>
      <div class="note"><em>*Perhitungan ini sudah termasuk semua komponen renovasi atap dan plafon. Angka-angka di atas hanyalah estimasi rentang harga. Untuk mengetahui estimasi yang lebih akurat sesuai kebutuhan dan kondisi lapangan, silakan hubungi kontak yang tersedia.</em></div>
    `;
  }
  
  function hitungLantaiBeton(luas) {
    // Biaya tetap
    const biayaPersiapan = 3800000;  // Mobilisasi, Bongkar, Kebersihan, dll
  
    // Rentang harga per m² atau unit
    const hargaBondeckMin = 250000;  // Harga min Bondeck per m²
    const hargaBondeckMax = 300000;  // Harga max Bondeck per m²
    const hargaKeramikLantaiMin = 250000;  // Harga min Keramik per m²
    const hargaKeramikLantaiMax = 300000;  // Harga max Keramik per m²
    const hargaStekD10Min = 30000;  // Harga min Stek D10 per kg
    const hargaStekD10Max = 40000;  // Harga max Stek D10 per kg
    const hargaWiremeshMin = 150000;  // Harga min Wiremesh per m²
    const hargaWiremeshMax = 200000;  // Harga max Wiremesh per m²
    const hargaCorBetonMin = 1200000;  // Harga min Cor Beton per m³
    const hargaCorBetonMax = 1400000;  // Harga max Cor Beton per m³
  
    // Menghitung biaya total berdasarkan luas bangunan
    const totalBondeckMin = luas * hargaBondeckMin;
    const totalBondeckMax = luas * hargaBondeckMax;
    const totalKeramikLantaiMin = luas * hargaKeramikLantaiMin;
    const totalKeramikLantaiMax = luas * hargaKeramikLantaiMax;
    const totalStekD10Min = 62.49 * hargaStekD10Min;  // Asumsi Stek 62.49 kg
    const totalStekD10Max = 62.49 * hargaStekD10Max;
    const totalWiremeshMin = luas * hargaWiremeshMin;
    const totalWiremeshMax = luas * hargaWiremeshMax;
    const totalCorBetonMin = 1.33 * hargaCorBetonMin;  // Asumsi 1.33 m³ beton
    const totalCorBetonMax = 1.33 * hargaCorBetonMax;
  
    // Menghitung total biaya
    const totalStrukturMin = totalBondeckMin + totalStekD10Min + totalWiremeshMin + totalCorBetonMin;
    const totalStrukturMax = totalBondeckMax + totalStekD10Max + totalWiremeshMax + totalCorBetonMax;
    const totalFinishingMin = totalKeramikLantaiMin;
    const totalFinishingMax = totalKeramikLantaiMax;
    const totalMin = biayaPersiapan + totalStrukturMin + totalFinishingMin;
    const totalMax = biayaPersiapan + totalStrukturMax + totalFinishingMax;
  
    return `
      <strong>Jenis: Renovasi Lantai Beton</strong><br>
      <p>Estimasi Biaya Renovasi Lantai: </p>
      <div class="total">${formatRupiah(Math.round(totalMin))} - ${formatRupiah(Math.round(totalMax))}</div>
      <div class="note"><em>*Perhitungan ini sudah termasuk biaya persiapan, struktur lantai (bondeck, stek, wiremesh, cor beton), dan finishing keramik. Angka-angka di atas hanyalah estimasi rentang harga. Untuk mengetahui estimasi yang lebih akurat sesuai kebutuhan dan kondisi lapangan, silakan hubungi kontak yang tersedia.</em></div>
    `;
  }
  
  function hitungToilet(luas) {
    // Ambil semua toggle yang aktif
    const komponen = Array.from(document.querySelectorAll('.toggle-switch input:checked')).map(el => el.value);
  
    // Biaya dasar untuk renovasi toilet DC
    let totalMin = 2500000;
    let totalMax = 2500000;
  
    if (komponen.includes('dinding')) {
      const luasKeramikDinding = luas * 3.63;
      const luasAcian = luas * 3.4;
      const sekoneng = 2.8;
      totalMin += (luasKeramikDinding * 260000) + (luasAcian * 22000) + (sekoneng * 70000);
      totalMax += (luasKeramikDinding * 300000) + (luasAcian * 28000) + (sekoneng * 80000);
    }
  
    if (komponen.includes('lantai')) {
      totalMin += luas * 250000;
      totalMax += luas * 280000;
    }
  
    if (komponen.includes('plafon')) {
      totalMin += luas * 200000;
      totalMax += luas * 250000;
    }
  
    if (komponen.includes('pintu')) {
      // Pintu PVC + ventilasi
      totalMin += 3000000;
      totalMax += 4000000;
    }
  
    if (komponen.includes('sanitasi')) {
      // Perlengkapan kamar mandi (kloset, wastafel, shower, dll)
      totalMin += 5000000;
      totalMax += 8000000;
    }
  
    if (komponen.includes('listrik')) {
      // Listrik, lampu LED, dan exhaust fan
      totalMin += 1500000;
      totalMax += 2500000;
    }
  
    return `
      <strong>Jenis: Renovasi Toilet DC</strong><br>
      <p>Estimasi Biaya Renovasi: </p>
      <div class="total">${formatRupiah(totalMin)} - ${formatRupiah(totalMax)}</div>
      <div class="note"><em>*Angka-angka di atas hanyalah estimasi rentang harga. Untuk mengetahui estimasi yang lebih akurat sesuai kebutuhan dan kondisi lapangan, silakan hubungi kontak yang tersedia.</em></div>
    `;
  }
  
  function hitung() {
    const jenis = document.getElementById('jenis').value;
    const tipeRenovasi = document.getElementById('tipeRenovasi') ? document.getElementById('tipeRenovasi').value : '';
    const luas = parseFloat(document.getElementById('luas').value);
    const hasil = document.getElementById('hasil');
  
    if (!jenis || isNaN(luas) || luas <= 0) {
      hasil.innerHTML = '<p class="error">⚠️ Mohon pilih jenis kalkulator dan masukkan luas bangunan yang valid.</p>';
      return;
    }
  
    let output = '';
  
    if (jenis === 'bangun') {
      const lowMin = luas * 3500000;
      const lowMax = luas * 4000000;
      const medMin = luas * 4100000;
      const medMax = luas * 5500000;
      const highMin = luas * 5600000;
  
      output = `
        <strong>Jenis: Bangun Rumah</strong><br>
        Rumah Sederhana: <span class="green">${formatRupiah(lowMin)} - ${formatRupiah(lowMax)}</span><br>
        Rumah Medium: <span class="green">${formatRupiah(medMin)} - ${formatRupiah(medMax)}</span><br>
        Rumah Mewah: <span class="green">mulai dari ${formatRupiah(highMin)}</span><br><br>
        <div class="note"><em>*Angka-angka di atas hanyalah estimasi rentang harga. Untuk mengetahui estimasi yang lebih akurat sesuai kebutuhan dan kondisi lapangan, silakan hubungi kontak yang tersedia.</em></div>
      `;
    } else if (jenis === 'renovasi') {
      if (tipeRenovasi === 'kanopi') {
        const mobilisasi = 1000000;
        const bongkar = 500000;
        const hargaRangka = 135000;
        const hargaAtap = 95000;
  
        const biayaRangka = luas * hargaRangka;
        const biayaAtap = luas * hargaAtap;
        const total = mobilisasi + bongkar + biayaRangka + biayaAtap;
  
        const estimasiMin = Math.round(total * 0.95);
        const estimasiMax = Math.round(total * 1.10);
  
        output = `
          <strong>Jenis: Renovasi Kanopi</strong><br>
          Estimasi Biaya: <span class="green">${formatRupiah(estimasiMin)} – ${formatRupiah(estimasiMax)}</span><br>
          <div class="note"><em>*Perhitungan ini sudah termasuk mobilisasi, pembongkaran, rangka dan atap. Angka-angka di atas hanyalah estimasi rentang harga. Untuk mengetahui estimasi yang lebih akurat sesuai kebutuhan dan kondisi lapangan, silakan hubungi kontak yang tersedia.</em></div>
        `;
      } else if (tipeRenovasi === 'lantai') {
        output = hitungLantaiBeton(luas);
      } else if (tipeRenovasi === 'toilet') {
        output = hitungToilet(luas);
      } else if (tipeRenovasi === 'atap') {
        output = hitungAtapPlafon(luas);
      }
    }
  
    hasil.innerHTML = output;
  }