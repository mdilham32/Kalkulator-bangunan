function formatRupiah(angka) {
  return "Rp" + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function updateTypeOptions() {
  const jenis = document.getElementById('jenis').value;
  document.getElementById('renovasiOptions').style.display = jenis === 'renovasi' ? 'block' : 'none';
  document.getElementById('renovasiToiletOptions').style.display = 'none';
}

function updateRenovasiOptions() {
  const tipeRenovasi = document.getElementById('tipeRenovasi').value;
  const toiletOptions = document.getElementById('renovasiToiletOptions');
  toiletOptions.style.display = tipeRenovasi === 'toilet' ? 'block' : 'none';

  if (tipeRenovasi === 'toilet') {
    document.querySelectorAll('.toggle-switch input').forEach(cb => {
      cb.addEventListener('change', function () {
        this.closest('.toggle-item').classList.toggle('active', this.checked);
      });
    });
  }
}

const calculatorFunctions = {
  bangun: (luas) => {
    const lowMin = luas * 3500000, lowMax = luas * 4000000;
    const medMin = luas * 4100000, medMax = luas * 5500000;
    const highMin = luas * 5600000;
    return `
      <strong>Jenis: Bangun Rumah</strong><br>
      Rumah Sederhana: <span class="green">${formatRupiah(lowMin)} - ${formatRupiah(lowMax)}</span><br>
      Rumah Medium: <span class="green">${formatRupiah(medMin)} - ${formatRupiah(medMax)}</span><br>
      Rumah Mewah: <span class="green">mulai dari ${formatRupiah(highMin)}</span><br><br>
      <div class="note"><em>*Angka-angka di atas hanyalah estimasi rentang harga.</em></div>
    `;
  },

  // kanopi
  kanopi: (luas) => {
    const mobilisasi = 1000000, bongkar = 500000;
    const biayaRangka = luas * 135000, biayaAtap = luas * 95000;
    const total = mobilisasi + bongkar + biayaRangka + biayaAtap;
    const min = Math.round(total * 0.95), max = Math.round(total * 1.10);
    return `
      <strong>Jenis: Renovasi Kanopi</strong><br>
      Estimasi Biaya: <span class="green">${formatRupiah(min)} – ${formatRupiah(max)}</span><br>
      <div class="note"><em>*Perhitungan ini sudah termasuk mobilisasi, pembongkaran, rangka dan atap.</em></div>
    `;
  },

  // lantai
  lantai: (luas) => {
    const biayaPersiapan = 3800000;
    const bondeckMin = luas * 250000, bondeckMax = luas * 300000;
    const keramikMin = luas * 250000, keramikMax = luas * 300000;
    const stekMin = 62.49 * 30000, stekMax = 62.49 * 40000;
    const wireMin = luas * 150000, wireMax = luas * 200000;
    const corMin = 1.33 * 1200000, corMax = 1.33 * 1400000;
    const min = biayaPersiapan + bondeckMin + stekMin + wireMin + corMin + keramikMin;
    const max = biayaPersiapan + bondeckMax + stekMax + wireMax + corMax + keramikMax;
    return `
      <strong>Jenis: Renovasi Lantai Beton</strong><br>
      <p>Estimasi Biaya Renovasi Lantai: </p>
      <div class="total">${formatRupiah(Math.round(min))} - ${formatRupiah(Math.round(max))}</div>
      <div class="note"><em>*Perhitungan ini sudah termasuk biaya persiapan, struktur lantai dan finishing keramik.</em></div>
    `;
  },

  // toilet
  toilet: (luas) => {
    const komponen = [...document.querySelectorAll('.toggle-switch input:checked')].map(el => el.value);
    let totalMin = 2500000, totalMax = 2500000;
    const components = {
      dinding: () => {
        const keramik = luas * 3.63, acian = luas * 3.4, sekoneng = 2.8;
        totalMin += (keramik * 260000) + (acian * 22000) + (sekoneng * 70000);
        totalMax += (keramik * 300000) + (acian * 28000) + (sekoneng * 80000);
      },
      lantai: () => { totalMin += luas * 250000; totalMax += luas * 280000; },
      plafon: () => { totalMin += luas * 200000; totalMax += luas * 250000; },
      pintu: () => { totalMin += 3000000; totalMax += 4000000; },
      sanitasi: () => { totalMin += 5000000; totalMax += 8000000; },
      listrik: () => { totalMin += 1500000; totalMax += 2500000; }
    };
    komponen.forEach(comp => components[comp]?.());
    return `
      <strong>Jenis: Renovasi Toilet DC</strong><br>
      <p>Estimasi Biaya Renovasi: </p>
      <div class="total">${formatRupiah(totalMin)} - ${formatRupiah(totalMax)}</div>
      <div class="note"><em>*Angka-angka di atas hanyalah estimasi rentang harga.</em></div>
    `;
  },

  // atap
  atap: (luas) => {
    const acuan = 60.48;
    const rasio = luas / acuan;
    const pekerjaan = [
      500000, // Mobilisasi & Demobilisasi
      1000000, // Bongkaran
      12096000 * rasio,
      6090000 * rasio,
      860800 * rasio,
      27652219.32 * rasio,
      8055936 * rasio,
      2661120 * rasio,
      2661120 * rasio,
      464000 * rasio,
      232000 * rasio
    ];

    const total = pekerjaan.reduce((sum, val) => sum + val, 0);
    const min = Math.round(total * 0.9);
    const max = Math.round(total * 1.1);

    return `
      <strong>Jenis: Renovasi Atap & Plafon</strong><br>
      <p>Estimasi rentang harga: </p>
      <div class="total">${formatRupiah(min)} - ${formatRupiah(max)}</div>
      <div class="note"><em>*Perhitungan ini sudah termasuk semua komponen renovasi atap dan plafon.</em></div>
    `;
  }
  };

function hitung() {
  const jenis = document.getElementById('jenis').value;
  const tipe = document.getElementById('tipeRenovasi')?.value || '';
  const luas = parseFloat(document.getElementById('luas').value);
  const hasil = document.getElementById('hasil');

  if (!jenis || isNaN(luas) || luas <= 0) {
    hasil.innerHTML = '<p class="error">⚠️ Mohon pilih jenis kalkulator dan masukkan luas bangunan yang valid.</p>';
    return;
  }

  hasil.innerHTML = jenis === 'renovasi'
    ? calculatorFunctions[tipe]?.(luas) || '<p class="error">⚠️ Jenis renovasi tidak valid</p>'
    : calculatorFunctions[jenis]?.(luas) || '<p class="error">⚠️ Jenis kalkulator tidak valid</p>';
}
