# GED/GIT Özel Alanı

## Yapılacaklar
- Sol menüye **Gang Enforcement Detail / Gang Impact Team** alanını eklemek.
- Alan için ayrı `ged_git` yetkisi tanımlamak; yalnızca bu yetkiye sahip personel ile Query/Faction Management erişebilecek.
- Yönetim panelindeki grup yetkileri listesine **GED/GIT** seçeneğini eklemek.
- `/gang-enforcement-detail` sayfasını oluşturmak; ilk aşamada şablon bekleyen grup alanı olarak göstermek.
- Sayfaya özgü başlık ve paylaşım açıklamalarını eklemek.

## Teknik Not
Mevcut grup-yetki tablosu serbest metin anahtarı kullandığı için yeni veritabanı tablosu veya şema değişikliği gerekmiyor; mevcut güvenli atama akışı kullanılacak.

## Doğrulama
- Yetkili/yetkisiz menü görünürlüğünü ve sayfa korumasını kontrol etmek.
- Masaüstü ve mobil menü bağlantısını kontrol etmek.
- Derleme ve tür kontrollerinin temiz geçtiğini doğrulamak.
