UCP OAuth + Onaylı Kullanıcı + Yönetim Paneli

## Hedef
Panelin tamamına erişim, UCP (`ucp-tr.gta.world`) OAuth ile açılacak. Sadece yönetici tarafından onaylanmış kullanıcılar içeri girebilecek. İlk yönetici, bize vereceği UCP kullanıcı adıyla otomatik admin olacak.

## Ön Gereksinimler
Aşağıdaki 3 bilgiye ihtiyacım var; UCP anahtarları güvenli şekilde saklanacak:
1. `UCP_CLIENT_ID`
2. `UCP_CLIENT_SECRET`
3. `UCP_ADMIN_USERNAME` (ilk admin yapılacak UCP kullanıcı adın)

## Teknik Yapı

### Veritabanı (migration)
- `portal_users`
  - `id` uuid PK
  - `ucp_id` text unique
  - `username` text unique
  - `email` text
  - `characters` jsonb (UCP'den dönen karakter listesi)
  - `status` enum: `pending`, `approved`, `rejected`
  - `created_at`, `updated_at`
- `portal_user_roles`
  - `id` uuid PK
  - `user_id` uuid → portal_users(id)
  - `role` enum: `user`, `admin`
  - unique(user_id, role)
- `portal_sessions`
  - `id` uuid PK
  - `token` text unique
  - `user_id` uuid → portal_users(id)
  - `expires_at` timestamptz
  - `created_at`
- `portal_login_logs`
  - `id` uuid PK
  - `user_id` uuid
  - `ip_address` text
  - `user_agent` text
  - `success` boolean
  - `error_message` text
  - `created_at`

### Sunucu fonksiyonları
- `startUcpOAuth` → UCP authorize URL'si oluşturur, `state` üretir.
- `completeUcpOAuth` → callback'te `code` ile token değiştirir, `/api/user` çeker, kullanıcı oluşturur/günceller.
- `getCurrentPortalUser` → session cookie'den giriş yapmış kullanıcıyı döner.
- `logoutPortalUser` → session'ı siler.
- `listPendingUsers`, `approveUser`, `rejectUser`, `listAdmins`, `toggleAdminRole` → admin işlemleri.

### Rotalar
- `/` → giriş kontrolü; giriş yoksa `/auth/giris`, varsa dashboard
- `/auth/giris` → UCP ile giriş butonu
- `/auth/ucp/callback` → OAuth callback
- `/auth/cikis` → çıkış
- `/onay-bekliyor` → onay bekleyen kullanıcı sayfası
- `/admin` → yönetim paneli (sadece admin)
- `/admin/kullanicilar` → kullanıcı onay/yönetim ekranı

### Güvenlik
- HTTP-only, SameSite=Lax, Secure cookie ile session.
- Her private server fn `requirePortalAuth` middleware ile korunur.
- Admin fonksiyonları `hasAdminRole` kontrolüyle korunur.
- RLS politikaları: `portal_*` tablolarına sadece `service_role` erişebilir; uygulama veritabanına sadece sunucu fonksiyonları üzerinden dokunur.

### UI
- Giriş sayfası: LSPD temasına uygun, "UCP ile Giriş Yap" butonu.
- Onay bekleyen sayfası: "Hesabınız yönetici onayında" mesajı.
- Admin panel: kullanıcı listesi, onay/reddet butonları, admin yetkisi ver/al.

## Sonraki Adım
Yukarıdaki 3 değeri (UCP_CLIENT_ID, UCP_CLIENT_SECRET, UCP_ADMIN_USERNAME) bana ilettiğinde hemen implementasyona başlarım.
