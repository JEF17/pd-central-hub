# Çete Soruşturma Dosyası Formu

## Yapılacaklar
- GED/GIT sayfasına **Çete Soruşturma Dosyası Formu** kartını ekleyip yeni form ekranına bağlamak.
- Konu başlığını `ÇETE İSMİ / 26-000` biçiminde canlı üretmek ve tek tıkla kopyalanabilir yapmak.
- Yüklenen BBCode şablonundaki alanları forma aktarmak:
  - Dosya adı, tarih, dosya numarası ve dosya açıklaması
  - Eklenip kaldırılabilen müttefik ve düşman kayıtları
  - Eklenip kaldırılabilen dijital kayıtlar: tarih, adres, açıklama ve medya bağlantısı
  - Eklenip kaldırılabilen SanGang kayıtları: bağlantı, ad soyad, cinsiyet, yaş ve kayıt numarası
  - Personel, onaylayan supervisor, detail ve division bilgileri
- Aktif personel profilinden ad ve seri numarasını otomatik doldurmak; detail için GED/GIT seçimi, division için MISN varsayılanını kullanmak.
- Taslağı cihaz ve sunucu arasında mevcut sistemle otomatik kaydetmek; temizleme, rapor oluşturma ve BBCode kopyalama işlemlerini eklemek.
- Yeni sayfaya özgü başlık ve paylaşım bilgilerini tanımlamak.

## Teknik ayrıntılar
- Yeni rapor veri modeli ve BBCode üreticisi ayrı bir yardımcı dosyada tutulacak.
- Yeni TanStack rotası GED/GIT yetkisiyle korunacak.
- Tekrarlanan alanlar mevcut raporlardaki mobil uyumlu kart ve ekle/kaldır düzenini kullanacak.
- Şablon çıktısı, yüklenen dosyanın BBCode yapısını koruyacak; boş alanlarda anlaşılır yer tutucular kalacak.
- Sonuç tür kontrolü, geliştirme derlemesi ve masaüstü/mobil görünüm kontrolüyle doğrulanacak.
