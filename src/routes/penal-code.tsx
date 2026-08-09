import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CrimeType = "F" | "M" | "I";
type FilterType = CrimeType | null;

type PenalCodeEntry = {
  number: string;
  title: string;
  types: CrimeType[];
  paragraphs: string[];
  classification: string;
};

const penalCodeEntries: PenalCodeEntry[] = [
  {
    number: "001",
    title: "İhanet",
    types: ["F"],
    paragraphs: [
      "Amerika Birleşik Devletleri'ne ve/veya ona bağlı olanlara karşı savaş açan ve düşmanlarının yanında bulunan kişi veya kuruluşlarla iş birliği içinde olan ve/veya Amerika Birleşik Devletleri içinde veya başka bir yerde onlara yardım ve yataklık sağlayan herhangi bir kişi.",
    ],
    classification:
      "A, B veya C Sınıfı felony kapsamında sorumlu tutulacaktır ve cezası mahkemenin takdirine göre belirlenecektir.",
  },
  {
    number: "002",
    title: "Casusluk",
    types: ["F"],
    paragraphs: [
      "Amerika Birleşik Devletleri'nin savunma bilgileri, sağlık tesisleri ve/veya iletişim istihbaratlarıyla ilgili herhangi bir gizli bilgiyi, Amerika Birleşik Devletleri'nin güvenliğine, çıkarlarına veya yabancı bir ülkeye zarar verecek şekilde başka bir kişiye bilerek ileten, iletmeye teşebbüs eden veya yetkisiz bir kişinin kullanımına sunan herhangi bir kişi.",
    ],
    classification:
      "A, B veya C Sınıfı felony kapsamında sorumlu tutulacaktır ve cezası mahkemenin takdirine göre belirlenecektir.",
  },
  {
    number: "003",
    title: "İç Terörizm",
    types: ["F"],
    paragraphs: [
      "a) Sivil nüfusu, hükümeti ve/veya hükümetin politika ve davranışını etkilemek ve zorlamak amacıyla büyük çaplı bedensel yaralanmalara veya ölümlere sebep verecek suç işleyen ve/veya teşebbüs eden herhangi bir kişi.",
      "b) Sivil nüfusu korkutmak veya zorlamak amacıyla herhangi bir kasıt olsun veya olmasın, büyük çaplı bedensel yaralanmalara ve/veya ölümlere yol açacak bir suç işlemekle yazılı veya sözlü tehdit eden herhangi bir kişi.",
    ],
    classification:
      "A, B veya C Sınıfı felony kapsamında sorumlu tutulacaktır ve cezası mahkemenin takdirine göre belirlenecektir.",
  },
  {
    number: "004",
    title: "İç Terörizm Tehdidi",
    types: ["F"],
    paragraphs: [
      "Sözlü veya yazılı olarak yapılan beyanın bir tehdit olarak algılanması için özel bir niyetle sivil bir nüfusu korkutmak veya baskılamak için başka bir kişiye ağır fiziksel yaralanma veya ölümle sonuçlanacak bir suç işlemekle kasten tehdit eden herhangi bir kişi.",
    ],
    classification:
      "A, B veya C Sınıfı felony kapsamında sorumlu tutulacaktır ve cezası mahkemenin takdirine göre belirlenecektir.",
  },
  {
    number: "101",
    title: "Vergi Kaçakçılığı",
    types: ["F"],
    paragraphs: [
      "a) Yasaların gerektirdiği süre içerisinde bilerek eyalete, şehre, alt kurumlara veya kamu dairelerine herhangi bir beyanname vermeyen, imzalayan, düzeltmeyen veya dosyalamayan herhangi bir kişi.",
      "b) Vergiden kaçınma niyetiyle herhangi bir yanlış veya hileli beyanda bulunan, veren, imzalayan veya doğrulayan ya da eyalete, şehre, alt kurumlara veya kamu dairelerine yanlış veya hileli bilgi sağlayan herhangi bir kişi.",
      "c) Lisans gerektiren bir faaliyeti geçerli bir lisans olmadan gerçekleştiren ve bunu takip eden işlemlerinde eyalete, şehre, alt kurumlara veya kamu dairelerine vergi vermeyi reddeden herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $5,000 para cezası\n2. $10,000 para cezası\n3. $15,000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
  },
  {
    number: "102",
    title: "Seçimde Sahtekarlık",
    types: ["F"],
    paragraphs: [
      "Oy eklemeye, çıkarmaya veya silmeye çalışan veya bir seçimin sonuçlarını tahrif etmeye çalışan veya baskı, ikna, vaat, rüşvet, tehdit, dolandırıclık veya hile yoluyla seçim sonuçlarını etkilemeye çalışan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
  },
  {
    number: "103",
    title: "Kamu Görevinde Yolsuzluk",
    types: ["F"],
    paragraphs: [
      "Belediye, bölge veya eyalet düzeyindeki bir kurumda istihdam edildiği sırada veya bir kamu görevlisiyle uyum içinde hareket eden bir kişinin, mülk, fiili hizmet ve kaynak elde etmek amacıyla hükümeti veya herhangi bir kesimini dolandırma niyetiyle yanlış veya hileli iddialarda ve vaatlerde bulunması.",
    ],
    classification:
      "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 7 günden fazla olmayacaktır.",
  },
  {
    number: "104",
    title: "Kamu Görevini İhmal",
    types: ["F"],
    paragraphs: [
      "Belediye, bölge veya eyalet düzeyindeki bir kurumda istihdam edildiği sırada yasanın kendisine yüklediği veya açıkça görevinin doğasında bulunan bir görevi yerine getirmekten kasten veya ihmalkar olarak kaçınarak kamu güvenliğinin bozulmasına, fiziksel zarar riskine, fiziksel zarara veya bu kanunun ihlaline sebebiyet veren herhangi bir kişi.",
    ],
    classification:
      "B Sınıfı (3) veya C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 6 günden fazla olmayacaktır.",
  },
  {
    number: "105",
    title: "Kamu Görevlisine Rüşvet",
    types: ["F"],
    paragraphs: [
      "Bir kamu çalışanının resmi eylemini, görüşünü, muhakemesini, kararını veya takdir yetkisini kullanmasını kendi amaçları doğrultusunda etkilemek için söz konusu kamu çalışanına para, mal, hizmet, menfaat veya değerli herhangi bir şeyi uygunsuz bir şekilde vermeyi teklif eden herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 5 günden fazla olmayacaktır.",
  },
  {
    number: "106",
    title: "İsyana Teşvik",
    types: ["F"],
    paragraphs: [
      "İsyana neden olma niyetiyle, isyana teşvik eden şiddetli davranışlarda bulunan, başkalarını şiddet veya mülke zarar verme eylemleri yapmaya teşvik eden herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 2 günden fazla olmayacaktır.",
  },
  {
    number: "107",
    title: "Yasa Dışı Toplanma",
    types: ["M"],
    paragraphs: [
      "a) Geçerli bir izne sahip olmadan kamu tesisi veya alanından dağılmayı, terk etmeyi reddedilen veya kolluk kuvvetleri tarafından terk etmesi emredilen herhangi bir kişi.",
      "b) Halkı muhtemel şiddetli ve/veya gürültülü davranışlarda bulunmaya teşvik eden veya bu davranışlarda bulunmaya hazırlanmak için iki veya daha fazla kişiyle bir araya gelen herhangi bir kişi.",
      "c) Yasal protesto, ifade özgürlüğünün ifadesi veya geçerli bir izinle yapılan barışçıl toplantılar hariç olmak üzere, herhangi bir ceza kanununu ihlal edecek bir davranışta bulunmak amacıyla bilerek iki veya daha fazla kişiyle bir araya gelen veya pervasızca kamusal alarm, rahatsızlık veya sıkıntı riski yaratan bir davranışta bulunan herhangi bir kişi. ",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 1 günden fazla olmayacaktır.",
  },
  {
    number: "108",
    title: "Delillerle Oynama",
    types: ["F"],
    paragraphs: [
      "Hukuki süreci engellemek, yanıltmak veya başka bir şekilde aldatıcı bir etki yaratmak amacıyla delil olarak kullanılan herhangi bir şeyi bilerek değiştiren, üreten, yerleştiren, yok eden, zarar veren, gizleyen veya hareket ettiren herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 saatten az 4 günden fazla olmayacaktır.",
  },
  {
    number: "109",
    title: "Tanık veya Mağdura Tehdit ",
    types: ["F"],
    paragraphs: [
      "Bir tanığı veya mağduru herhangi bir hukuki sürece veya soruşturmaya katılmasını, ifade vermesini veya cezai işlem yapılmasına yol açabilecek bir rapor hazırlamasını engellemek amacıyla onu caydıran, kötü niyetle engelleyen veya engellemeye ve caydırmaya teşebbüs eden herhangi bir kişi.",
    ],
    classification:
      "B Sınıfı (5) veya C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 7 günden fazla olmayacaktır.",
  },
  {
    number: "110",
    title: "Mahkemeye Saygısızlık",
    types: ["M"],
    paragraphs: [
      "a) Bir mahkemenin oturumu sırasında göz önünde ve yargıcın huzurunda işlenen, doğrudan yargılama sürecini kesintiye uğratmaya veya yargıya bağlı olan saygıyı zedeleme eğiliminde işlenen düzensiz, aşağılayıcı ve küstah davranışları gerçekleştiren herhangi bir kişi.",
      "b) Mahkemenin işlemlerini kesintiye uğratma amacıyla huzuru bozan, gürültü çıkaran veya huzuru bozma amacıyla diğer eylemleri gerçekleştiren herhangi bir kişi.",
      "c) Mahkemenin yasal sürecine veya diğer yetkilerine kasten itaatsizlik eden veya direnen herhangi bir kişi. Bu aynı zamanda mahkeme celbine itaatsizlik, şartlı tahliye ihlalleri ve mahkeme kararlarının ihlallerini de kapsamaktadır.",
      "d) Mahkemenin işlemleri hakkında bilerek yanlış veya büyük ölçüde yanlış bir rapor yayınlayan herhangi bir kişi.",
      "e) Adli para cezalarını ödemeyi reddeden veya söz konusu adli para cezaları için bir ödeme planı sağlandıktan sonra 7 gün içinde ödemeyen kişi.",
      "f) Trafik radar cezalarını ödemeyi reddeden veya söz konusu trafik radar cezaları için bir ödeme planı sağlandıktan sonra 14 gün içinde ödemeyen herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden fazla olmayacaktır ve/ya da para cezası  $20.000'dan fazla olmayacaktır. Duruma göre sadece hapis ya da para cezası veya her ikisi de ilgili kişiye karşı uygulanabilir.\n(( Bu suç sadece kefalet ihlallerinin olması durumunda zorunlu olarak mahkemeye gidecektir. ))",
  },
  {
    number: "111",
    title: "Yalancı Şahitlik",
    types: ["F"],
    paragraphs: [
      "a) Herhangi bir yetkili mahkeme, memur veya bir mahkeme oturumunda tanıklık edeceğine, beyan edeceğine, ifade vereceğine veya doğru olduğunu tasdik edeceğine dair yemin ettikten sonra, kasten ve yeminine aykırı olacak şekilde yanlış bildiği önemli bir bilgiyi, yanıltıcı bir şekilde doğru olarak sunan herhangi bir kişi.",
      "b) Herhangi bir mahkeme prosedürünü yanıltmak veya geciktirmek amacıyla, yazılı veya sözlü beyan yoluyla kasıtlı olarak yanlış veya eksik bilgi sağlayan herhangi bir kişi.",
      "c) Yalan beyanın yalnızca sanık dışında tek bir kişinin tanıklığına dayandırıldığı durumlarda, hiç kimse yalancı şahitlikten mahkum edilemez.",
    ],
    classification:
      "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 5 saatten az 3 günden fazla olmayacaktır.",
  },
  {
    number: "112",
    title: " Kamu Görevini Engellemek",
    types: ["F", "M"],
    paragraphs: [
      "(a) Meşru bir mazereti olmaksızın baskı veya şiddet kullanma yoluyla kamu adaletinin uygulanmasını engelleme veya geciktirme amacıyla bir tanık veya bir kamu görevlisine karşı ağır bedensel zarar verme ya da ölümüne neden olma niyetinde olan herhangi bir kişi.",
      "(b) Meşru bir mazereti olmaksızın baskı veya şiddet kullanma yoluyla kamu adaletinin uygulanmasını engelleme veya geciktirme amacıyla bir tanık veya bir kamu görevlisine karşı $50,000 maddi değeri aşan ciddi bir mal zararına neden olan, $100,000 maddi değeri aşan ciddi bir kayba neden olan ya da bir başkasına hafif fiziksel zarar vermek niyetinde olan herhangi bir kişi.",
      "(c) Meşru bir mazereti olmaksızın baskı veya şiddet kullanma yoluyla kamu adaletinin uygulanmasını engelleme veya geciktirme amacıyla bir tanık veya bir kamu görevlisine karşı:",
      "(i) en fazla $50,000 maddi zarara neden olan,",
      "(ii) kamu düzenini bozan veya bir başkasının kamu düzenini bozmasına neden olan herhangi bir kişi.",
    ],
    classification:
      "Madde (a) ihlalinde A Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.\nMadde (b) ihlalinde B Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 2 günden fazla olmayacaktır.\nMadde (c) ihlalinde C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 12 saatten fazla olmayacaktır.",
  },
  {
    number: "113",
    title: "Kolluk Kuvvetlerinde Görevli Hayvanı Engellemek",
    types: ["M", "F"],
    paragraphs: [
      "a) Kolluk kuvveti personelinin görev yaparken kullandığı herhangi bir hayvanı kasten ve kötü niyetle ve hiçbir yasal gerekçe olmaksızın, korkutarak, alay ederek, ajite ederek veya taciz ederek hayvana müdahale eden, engelleyen veya görevinin ifasına teşebbüs eden kişi.",
      "b) Hukuki bir gerekçesi olmaksızın kasten kolluk kuvveti personelinin gözetiminde görev yapan hayvana vuran, döven, tekmeleyen, kesen, bıçaklayan, ateş eden, zehirleyen veya başka bir şekilde yaralayan herhangi bir kişi.",
      "c) (a) ve (b) hükümlerini ihlal ederek, yaralamaya veya ölüme neden olma niyetiyle ölüm, herhangi bir vücut uzvunun kaybı veya işlev bozukluğu dahil ciddi fiziksel yaralanmaya veya ciddi sakatlığa neden olan herhangi bir kişi.",
    ],
    classification:
      "Madde (a) ihlalinde B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 12 saatten az 2 günden fazla olmayacaktır.\n Madde (b) ihlalinde B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.\nMadde (c) ihlalinde A Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 8 günden fazla olmayacaktır.",
  },
  {
    number: "114",
    title: "Yasal Gözaltından Kaçmak",
    types: ["F"],
    paragraphs: [
      "Tutuklanan, suçla itham edilen veya bir suçtan hüküm giyen ve daha sonra bir bölge veya şehir hapishanesinden, gözaltı tesisinden, toplum hizmetinden veya kendisinden sorumlu bir ıslah memurunun gözetiminden kaçan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 7 günden az 9 günden fazla olmayacaktır.",
  },
  {
    number: "115",
    title: "Kolluk Kuvvetlerinden Kaçmak",
    types: ["F"],
    paragraphs: [
      "a) Motorlu taşıt veya bisiklet kullanırken veya bindikten sonra kaçma niyetiyle kasten kaçan veya onu takip eden bir kolluk kuvveti personelinden kaçmaya çalışan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 5 günden fazla olmayacaktır. Ayrıca sürücü lisansına 7 günlüğüne el koyulacaktır. Aracın çekilmesine ve para cezasına ilişkin cezalar ise aşağıdaki gibidir:\n1. 7 günlüğüne araca el koyulacaktır ve $5.000 para cezası\n2. 14 günlüğüne araca el koyulacaktır ve $10.000 para cezası\n3. 14 günlüğüne araca el koyulacaktır ve $20.000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.\n\nNot: Bu suç kişiye karşıdır ve araca karşı değildir. Bu nedenle kovalama farklı bir araçta başladıysa ve kaçan kişi farklı bir araca geçerse son kullandığı araç çekilebilir. Eğer araç başka birisine aitse ve çalındığını kanıtlayabilirse aracı teslim alabilir. Eğer aracın plaka kaydı yoksa araç parçalatılacaktır.",
  },
  {
    number: "116",
    title: "Tutuklamaya Direnmek",
    types: ["M"],
    paragraphs: [
      "Kolluk kuvveti personelinin, kendisinin veya bir başkasının tutuklanmasını ya da görevini ifa etmesini veya görevini ifaya teşebbüsünü etkileyen, kasten geciktiren, önleyen, engelleyen veya engellemeye teşebbüs eden herhangi bir kişiyi temsil eder. Yaya olarak bir kolluk kuvveti personelin yasal emrini dinlemeksizin kaçmak, kaçmaya teşebbüs etmek bu durum kapsamında değerlendirilir. Bu aynı zamanda kolluk kuvveti personeline yalan söylemeyi de kapsamaktadır.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.",
  },
  {
    number: "117",
    title: "Hükümet Görevlilerine Yalan Söylemek",
    types: ["M"],
    paragraphs: [
      "Amerika Birleşik Devletleri'nin yürütme, yasama veya yargı organının yargı yetkisi dahilindeki herhangi bir konuda bilerek ve isteyerek yanlış, hayali veya hileli beyanda bulunan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 8 saatten az 4 günden fazla olmayacaktır, para cezası ise $10.000 olacaktır.",
  },
  {
    number: "118",
    title: "Acil Yardım Hatlarının Kötüye Kullanımı",
    types: ["M"],
    paragraphs: [
      "Hükümet yardım hattını acil ya da acil olmayan yardım amacıyla, meşru bir endişeyle hükümet birimleriyle iletişime geçmek dışında telefon şakası yapmak veya dikkat dağıtmak gibi amaçlarla kullanan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır, para cezası ise $5.000 olacaktır.",
  },
  {
    number: "119",
    title: "Kimlik Hırsızlığı",
    types: ["M"],
    paragraphs: [
      "a) Kasten kendini bir başkası olarak tanıtan, bir kişi ya da kuruluşun temsilcisi gibi davranan, internet sitesi veya diğer elektronik yollarla iletişim kurarak bir başkasını taklit eden ve bunun gibi sıfatlarla menfaat elde etmek, bir başkasını yaralamak veya dolandırmak amacıyla hareket eden herhangi bir kişi.",
      "b) Kasten kamu görevlisi gibi davranan, kamu görevlisini yasal olarak ayırt eden herhangi bir üniforma, rozet veya amblemi yetkisiz olarak giyen veya sergileyen, söz ve eylemleriyle kamu görevlisi olduğunu ifade eden ve bu amaçla bir başkasını \"sözde\" resmi otoriteye boyun eğmeye zorlayan herhangi bir kişi.",
      "c) Başka bir kişiyi kolluk görevlisi olduğuna inanması ve yetkilerine boyun eğmesi için kandırmak amacıyla, üniforma, rozet veya yaygın olarak bu tür bir görevliyle ilişkilendirilen diğer nişanları takarak veya sergileyerek ya da sözlü olarak veya eylemleriyle kolluk görevlisi olduğunu belirterek kendisini yanlış bir şekilde kolluk görevlisi olarak tanıtan kişi(ler).",
    ],
    classification:
      "Madde (a) ihlalinde C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 4 saatten az 1 günden fazla olmayacaktır.\nMadde (b) ihlalinde C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 4 günden fazla olmayacaktır, para cezası ise $10.000 olacaktır.",
  },
  {
    number: "120",
    title: "Bir Kamu Çalışanına Saldırı Tehdidi veya Darp",
    types: ["F"],
    paragraphs: [
      "a) Bir kamu çalışanına karşı kasıtlı ve hukuka aykırı olarak fiziksel güç kullanan herhangi bir kişi.",
      "b) Yasalara aykırı olarak bir kamu çalışanını yaralamaya teşebbüs eden veya huzurunda bulunduğu bir kamu çalışanını makul bir fiziksel yaralanma korkusu içine sokmaya çalışan herhangi bir kişi.",
    ],
    classification:
      "A Sınıfı (5) veya B Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 6 günden fazla olmayacaktır.",
  },
  {
    number: "121",
    title: "Sahtecilik",
    types: ["M"],
    paragraphs: [
      "Bir başkasını dolandırmak, aldatmak veya yaralamak amacıyla yazılı bir belgeyi bilerek oluşturan, tamamlayan veya değiştiren herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 3 günden fazla olmayacaktır.",
  },
  {
    number: "122",
    title: "Dolandırıcılık",
    types: ["M", "F"],
    paragraphs: [
      "a) Sözlerle, davranışlarla, yanıltıcı iddialarda bulunarak veya gerçekleri veya yazılı belgeleri bilerek gizleyerek herhangi bir şekilde başka bir kişinin parasını, emeğini, veya gerçek veya kişisel malını dolandırmaya çalışan herhangi bir kişi. (M)",
      "b) Parasal değeri $15,000.00 veya daha fazla kayıpla sonuçlanırsa dolandırıcılık felony olarak değerlendirilecektir. (F)",
      "c) Kendisine ait olan bir aracı adına kayıtlı plakayı yine kendisine ait olan farklı bir aracında sergileyen herhangi bir kişi. (F)",
    ],
    classification:
      "Madde (a) ihlalinde C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 2 günden fazla olmayacaktır.\nMadde (b) veya (c) ihlalinde C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.",
  },
  {
    number: "123",
    title: "Para Aklamak",
    types: ["F"],
    paragraphs: [
      "Suçlarını gizleyebilmek veya suç gelirlerine yasal görüntü kazandırmak amacıyla, suçtan elde ettikleri malvarlığı değerlerinin niteliğini, kaynağını, yerini, durumunu, hareketini ve kime ait olduğunu saklama, örtme veya olduğundan farklı göstermelerine yönelik işlem ve faaliyetler gerçekleştiren veya suçtan elde edilen malvarlığı değerlerinin yasal olmayan kaynağının gizlenmesi amacıyla meşru bir kaynaktan elde edilmiş gelir gibi gösterilmesi yönündeki işlem ve eylemleri gerçekleştiren herhangi bir kişi.",
    ],
    classification:
      "Toplam değer $10,000 aşmıyorsa C Sınıfı (2) felony. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.\nToplam değer $10,000 aşıyorsa C Sınıfı (3) felony. Hapis cezası 3 günden az 5 günden fazla olmayacaktır.\nToplam değer $100,000 aşıyorsa C Sınıfı (4) felony. Hapis cezası 3 günden az 6 günden fazla olmayacaktır.\nToplam değer $500,000 aşıyorsa C Sınıfı (5) felony. Hapis cezası 5 günden az 8 günden fazla olmayacaktır.\nToplam değer $1,000,000 aşıyorsa C Sınıfı (6) felony. Hapis cezası 6 günden az 9 günden fazla olmayacaktır.",
  },
  {
    number: "124",
    title: "ABD Para Birimine Zarar Vermek",
    types: ["M"],
    paragraphs: [
      "Herhangi bir banka senedini veya senedi kullanılamaz hale getirmek amacıyla parçalayan, kesen, tahrif eden, şeklini bozan veya delen herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 2 günden fazla olmayacaktır.",
  },
  {
    number: "125",
    title: "Huzuru Bozmak",
    types: ["M"],
    paragraphs: [
      "Kamu ahlakına bakılmaksızın, yüksek sesli müzikle, saldırgan veya kaba sözlerle veya topluluk faaliyetlerini ve sükunetini bozacak davranışlarla ortamın huzurunun bozulmasına neden olan herhangi bir kişi.",
      "Kapsam: Kavga, şiddet, kargaşa veya tehdit edici davranış, makul olmayan gürültü, kamusal alanda küfürlü veya müstehcen dil/jestler.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır, para cezası ise $2.500 olacaktır.",
  },
  {
    number: "126",
    title: "Haraç Kesmek",
    types: ["F"],
    paragraphs: [
      "(a) Haraççılık faaliyetine bilerek dahil olan, bunlara katılan, bu tür bir faaliyete katılan veya yasa dışı bir borcun tahsilatında bulunan, teşebbüs eden, ortaklık eden herhangi bir kişi, grup veya kuruluş.",
      "(b) Suç teşkil eden şantaj yoluyla veya kanuna aykırı bir borç tahsili yoluyla ticari bir işletmeyi ya da ticari aktiviteyi kendi menfaatleri amacıyla doğrudan veya dolaylı olarak kontrol etmeyi hedefleyen herhangi bir kişi.",
    ],
    classification:
      "A Sınıfı (6), B Sınıfı (5) veya C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
  },
  {
    number: "127",
    title: "EFCE Yasasının İhlali - Sinyal Bozucu",
    types: ["F"],
    paragraphs: [
      "a) EFCE Kanun hükümlerine aykırı olarak, bilerek ve isteyerek —yasal izin olmaksızın— sinyal bozucu üreten, imal eden, işleyen veya hazırlayan herhangi bir kişi.",
      "b) EFCE Kanun hükümlerine aykırı olarak bilerek ve isteyerek —yasal izin olmaksızın— sinyal bozucu bulunduran, satan, dağıtan, reklam yapan veya pazarlayan herhangi bir kişi.",
      "c) EFCE Kanun hükümlerine aykırı olarak —yasal izin olmaksızın— sinyal bozucu aracılığıyla herhangi bir iletişim cihazının veya alarm sisteminin çalışmasını bilerek engelleyen, manipüle eden, bozan herhangi bir kişi.",
    ],
    classification:
      "Madde (a) ihlalinde C Sınıfı (6) felony. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.\nMadde (b) ihlalinde C Sınıfı (4) felony. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.\nMadde (c) ihlalinde C Sınıfı (4) felony. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.",
  },
  {
    number: "128",
    title: "EFCE Yasasının İhlali - Kart Kopyalama",
    types: ["F"],
    paragraphs: [
      "a) EFCE Kanun hükümlerine aykırı olarak, bilerek ve isteyerek —yasal izin olmaksızın— kart kopyalama cihazı üreten, imal eden, işleyen veya hazırlayan herhangi bir kişi.",
      "b) EFCE Kanun hükümlerine aykırı olarak bilerek ve isteyerek —yasal izin olmaksızın— kart kopyalama cihazını satan, dağıtan, reklam yapan veya pazarlayan herhangi bir kişi.",
      "c) EFCE Kanun hükümlerine aykırı olarak, bilerek ve isteyerek —yasal izin olmaksızın— başkalarının bilgisi veya izni olmadan finansal bilgi elde etmek amacıyla kart kopyalama cihazı bulunduran veya kullanan herhangi bir kişi.",
    ],
    classification:
      "Madde (a) ihlalinde C Sınıfı (6) felony. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.\nMadde (b) ihlalinde C Sınıfı (4) felony. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.\nMadde (c) ihlalinde C Sınıfı (4) felony. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.",
  },
  {
    number: "129",
    title: "EFCE Yasasının İhlali - Araç Takibi",
    types: ["F"],
    paragraphs: [
      "a) EFCE Yasası hükümlerini ihlal edecek şekilde herhangi bir araca veya eşyaya elektronik takip cihazı kuran veya yerleştiren herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı (6) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.",
  },
  {
    number: "130",
    title: "Bir Mahkumu Kaçırmak",
    types: ["F"],
    paragraphs: [
      "a) San Andreas Eyaleti'nde bulunan tüm hapishaneler veya yasal olarak gözaltında tutan herhangi bir Barış Memuru kategorisindeki kişiler tarafından tutulan bireyleri kurtaran, kurtarmaya teşebbüs eden ya da başka bir kişinin kurtarmasına veya kurtarmaya teşebbüs etmesine yardımcı olan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 7 günden az 9 günden fazla olmayacaktır.",
  },
  {
    number: "131",
    title: "Hapishane İçerisinde Uyuşturucu Madde Bulundurmak",
    types: ["F"],
    paragraphs: [
      "a) Herhangi bir eyalet hapishanesine ya da yetkisi altındaki başka bir kuruma, ilçe hapishanesine, şehir hapishanesine veya mahkumların gözetim altında tutulduğu başka bir yere, bilerek DEPA kapsamında tanımlanan kontrol altındaki maddeleri getiren kişi(ler) veya bu maddeleri enjekte etmek ya da tüketmek için kullanılan herhangi bir cihaz, düzenek, alet veya teçhizatı izinsiz bulunduran kişi(ler).",
      "Bulundurulan en yüksek kategori genel cezayı belirler.",
    ],
    classification:
      "C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Ceza yönergeleri:\nA — $45.000'a kadar para cezası ve 7 günden fazla olmamak üzere hapis cezası.\nB — $37.500'a kadar para cezası ve 6 günden fazla olmamak üzere hapis cezası.\nC — $30.000'a kadar para cezası ve 5 günden fazla olmamak üzere hapis cezası.\nD — $22.500'a kadar para cezası ve 4 günden fazla olmamak üzere hapis cezası.\nT — $8.000'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası.",
  },
  {
    number: "132",
    title: "Hapishane İçerisinde İletişim Aleti Bulundurmak",
    types: ["M"],
    paragraphs: [
      "(a) Yerel bir ıslahevinde cep telefonu, çağrı cihazı veya kablosuz internet cihazı dahil ancak bunlarla sınırlı olmamak üzere kablosuz iletişim cihazı bulunduran ve bulundurma yetkisi olmayan herhangi bir kişi.",
      "(b) Bu bölüm uyarınca toplanan para mahkum refah fonuna yatırılacaktır.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır ve en fazla bin dolar ($1.000) para cezası ile cezalandırılacaktır.",
  },
  {
    number: "133",
    title: "Hapishane İçerisinde Tütün Bulundurmak",
    types: ["I"],
    paragraphs: [
      "(a) Enfiye ürünleri, sigara içme gereçleri, tütün tüketmek için kullanılan herhangi bir cihaz veya bu ürünler için kullanılan herhangi bir kap dahil olmak üzere herhangi bir şekilde tütün ürünü bulunduran, yerel bir ıslah tesisinde bulunan herhangi bir kişi.",
      "(b) (a) alt maddesi yalnızca belediye meclisi veya ilçe komisyonunun bir yönetmelik kabul ettiği ıslah tesislerinde (county jail) geçerlidir.",
      "(c) Bu bölüm uyarınca toplanan para mahkum refah fonuna yatırılacaktır.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır. Bin dolardan ($1.000) fazla olmamak kaydıyla para cezası ile cezalandırılacaktır.",
  },
  {
    number: "134",
    title: "Hapishane İçerisinde Yetkisiz Anahtar Bulundurmak",
    types: ["M"],
    paragraphs: [
      "Yerel bir ıslahevinde tutulan ve kelepçe anahtarı bulundurma yetkisi olmayan herhangi bir kişi. \"Kelepçe anahtarı\", bir kelepçeyi açmak veya mandalını açmak için tasarlanmış veya amaçlanmış herhangi bir cihaz anlamına gelir.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır, para cezası ise $2.500 olacaktır.",
  },
  {
    number: "135",
    title: "Barış Görevlisi Köpeğini Öldürmek",
    types: ["F"],
    paragraphs: [
      "(a) Yasal bir neden veya gerekçe olmaksızın, kasıtlı veya bilerek, bir barış görevlisi köpeğinin ölümüne neden olan kişi(ler).",
    ],
    classification:
      "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 5 günden az 6 günden fazla olmayacaktır.",
  },
  {
    number: "136",
    title: "Barış Görevlisi Köpeğini Ağır Yaralamak",
    types: ["F"],
    paragraphs: [
      "(a) Yasal bir neden veya gerekçe olmaksızın, kasten veya bilerek, ölümcül bir silahla veya silahsız olarak bir barış görevlisi köpeği üzerinde büyük bedensel hasara veya kalıcı sakatlığa neden olan kişi(ler).",
    ],
    classification:
      "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 3 günden fazla olmayacaktır.",
  },
  {
    number: "137",
    title: "Barış Görevlisi Köpeğine Saldırmak",
    types: ["M"],
    paragraphs: [
      "(a) Kasıtlı olarak veya bilerek kötü niyetle bir barış görevlisi köpeğine dokunan, vuran veya bedensel zarar veren kişi(ler).",
    ],
    classification:
      "B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır, para cezası ise $2.500 olacaktır.",
  },
  {
    number: "138",
    title: "Barış Görevlisi Köpeğini Engelleme",
    types: ["M"],
    paragraphs: [
      "(a) Barış görevlisi köpeğini görevini yerine getirirken kasıtlı olarak veya bilerek kötü niyetle taciz eden, onunla alay eden, ona müdahale eden veya dikkatini dağıtan kişi(ler).",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 50 dakikadan az 6 saatten fazla olmayacaktır, para cezası ise $2.500 olacaktır.",
  },
  {
    number: "139",
    title: "Mobil Veri Bilgisayarının Kötüye Kullanımı",
    types: ["F"],
    paragraphs: [
      "a) Mobil Veri Bilgisayarı (MDC) sisteminin, ağının veya verilerinin herhangi bir işlevine, yasal işlemleri engellemek veya sekteye uğratmak ya da MDC'yi kişisel, resmi olmayan veya suç teşkil eden faaliyetler için kullanmak amacıyla erişen, kullanan, değiştiren, zarar veren, silen veya bozan kişi(ler).",
      "b) Dolandırıcılık, hırsızlık veya kişisel ya da hassas bilgilerin yetkisiz yayılması dahil olmak üzere herhangi bir suçun işlenmesini kolaylaştırmak için MDC sistemini veya ağını kullanan kişi(ler).",
    ],
    classification:
      "C Sınıfı (2) ve B Sınıfı (3) olarak felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 6 günden fazla olmayacaktır.",
  },
  {
    number: "140",
    title: "Mobil Veri Bilgisayarından Yetkisiz Bilgi Paylaşımı",
    types: ["F"],
    paragraphs: [
      "a) İstihdam kapsamı dışında, MDC sisteminden, ağından veya verilerinden, kamuya açık veya kişisel kullanım için tasarlanmamış herhangi bir bilgiyi paylaşan, dağıtan veya yayınlayan kişi(ler).",
      "b) MDC'den kamu güvenliğini, soruşturmaların bütünlüğünü veya MDC sisteminin güvenliğini tehlikeye atan herhangi bir bilgiyi ihmal veya kasıtla paylaşan, yayan veya yayınlayan kişi(ler).",
    ],
    classification:
      "C Sınıfı (3) ve B Sınıfı (2) olarak felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
  },
  {
    number: "141",
    title: "Mahkumla Yasa Dışı İletişim Kurmak",
    types: ["M"],
    paragraphs: [
      "Herhangi bir ceza infaz kurumunun müdürünün veya diğer sorumlu personelinin izni olmaksızın herhangi bir mahkumla veya alıkoyulan kişiyle iletişim kuran; herhangi bir mektup, yazı, literatür veya okuma materyali veren ya da alan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 18 saatten az 3 günden fazla olmayacaktır.",
  },
  {
    number: "142",
    title: "Mahkemeye Katılmamak",
    types: ["M", "F"],
    paragraphs: [
      "a) Bir misdemeanor suçu işlemekle suçlanan ya da bu suçtan hüküm giyen ve kefaletle serbest bırakılan herhangi bir kişinin mahkeme sürecinden kaçmak amacıyla mahkemeye katılmaması.",
      "b) Bir felony suçu işlemekle suçlanan ya da bu suçtan hüküm giyen ve kefaletle serbest bırakılan herhangi bir kişinin mahkeme sürecinden kaçmak amacıyla mahkemeye katılmaması.",
    ],
    classification:
      "Misdemeanor ile suçlanmış ya da hüküm giymişse C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden fazla olmayacaktır.\nFelony ile suçlanmış ya da hüküm giymişse C Sınıfı felony kapsamında sorumlu tutulacaktır. Hapis cezası 6 günden fazla olmayacaktır.",
  },
  {
    number: "201",
    title: "Cinayet",
    types: ["F"],
    paragraphs: [
      "a) Bir polis memuru, itfaiyeci, sağlık görevlisi, savcı, yargıç, jüri üyesi veya diğer seçilmiş bir memuru görevini yaparken veya bir ceza davası sırasında herhangi bir tanığı kasten öldüren herhangi bir kişi.",
      "b) Birinci derece, ikinci derece veya kontratlı bir şekilde cinayet işlerken istisnai şekilde ahlaksızlık sergileyen, özellikle iğrenç, gaddar veya zalimce eylemlerde bulunan herhangi bir kişi.",
      "c) Aynı plan veya davranış biçiminde kasten birden fazla kişiyi öldüren herhangi bir kişi.",
      "d) Ömür boyu hapis cezasını çekerken, kasıtlı eylemlerle başka bir insanın ölümüne neden olan herhangi bir hapsedilmiş kişi.",
    ],
    classification:
      "A Sınıfı (18) felony kapsamında sorumlu tutulacaktır. Hapis cezası 20 günden az olmayacaktır.",
  },
  {
    number: "202",
    title: "Birinci Derece Cinayet",
    types: ["F"],
    paragraphs: [
      "Önceden kötü niyetle tasarlanmış eylemler yoluyla başka bir insanın ölümüne neden olan herhangi bir kişi.",
    ],
    classification:
      "A Sınıfı (15) felony kapsamında sorumlu tutulacaktır. Hapis cezası 18 günden az olmayacaktır.",
  },
  {
    number: "203",
    title: "İkinci Derece Cinayet",
    types: ["F"],
    paragraphs: [
      "Önceden düşünülmemiş, kötü niyetle planlanmamış eylemler yoluyla başka bir insanın ölümüne neden olan herhangi bir kişi.",
    ],
    classification:
      "A Sınıfı (10) felony kapsamında sorumlu tutulacaktır. Hapis cezası 15 günden az olmayacaktır.",
  },
  {
    number: "204",
    title: "Kasten Adam Öldürme",
    types: ["F"],
    paragraphs: [
      "Kötü niyet olmaksızın bir insanı kasıtsız olarak öldüren herhangi bir kişi veya ölümcül gücün gerekli olduğuna dair mantıksız bir inançla başka bir insanın ölümüne (kusurlu kendini savunma) neden olan herhangi bir kişi.",
    ],
    classification:
      "A Sınıfı (7) felony kapsamında sorumlu tutulacaktır. Hapis cezası 5 günden az 10 günden fazla olmayacaktır.",
  },
  {
    number: "205",
    title: "Kasıtsız Adam Öldürme",
    types: ["F"],
    paragraphs: [
      "Kasıt olmaksızın ihmalkarca gerçekleştirilen veya gerçekleştirilmeyen bir eylem sonucunda herhangi bir kişinin ölümüyle sonuçlanan ya da suç sayılmayan yasadışı eylem sonucu bir kişinin ölümüne kasıtsız bir şekilde sebebiyet veren herhangi bir kişi.",
    ],
    classification:
      "A Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 8 günden fazla olmayacaktır.",
  },
  {
    number: "206",
    title: "Saldırı",
    types: ["M"],
    paragraphs: [
      "Bir başkasının şahsına kanuna aykırı olarak şiddetli bir şekilde zarar vermeye teşebbüs eden veya başka bir kişiyi makul bir fiziksel yaralanma korkusu içine sokmaya çalışan herhangi bir kişi.",
    ],
    classification:
      "B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 2 günden fazla olmayacaktır.",
  },
  {
    number: "207",
    title: "Ölümcül Silahla Saldırı",
    types: ["F"],
    paragraphs: [
      "a) Ateşli bir silah haricinde herhangi bir ölümcül silahla, ölümcül bir aletle veya motorlu bir taşıtla yasa dışı bir şekilde ve kasıtlı olarak başka birini yaralamaya teşebbüs eden herhangi bir kişi.",
      "b) Ateşli silah bulundururken yasa dışı bir şekilde ve kasıtlı olarak başka birini şiddetli bir şekilde yaralamaya teşebbüs eden herhangi bir kişi.",
    ],
    classification:
      "Madde (a) ihlalinde B Sınıfı (3) felony. Hapis cezası 3 günden az 5 günden fazla olmayacaktır.\nMadde (b) ihlalinde B Sınıfı (4) felony. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
  },
  {
    number: "208",
    title: "Darp",
    types: ["M"],
    paragraphs: [
      "Başka bir kişiye karşı kasıtlı ve yasa dışı fiziksel güç kullanan herhangi bir kişi.",
    ],
    classification:
      "B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 7 saatten az 3 günden fazla olmayacaktır.",
  },
  {
    number: "209",
    title: "Ağırlaştırılmış Darp",
    types: ["F"],
    paragraphs: [
      "a) Ateşli silah dışında herhangi bir nesneyi silah olarak kullanarak başka bir kişiye kasten ve yasa dışı bir şekilde fiziksel güç uygulayan veya uyguladığı güç sonucunda ciddi bedensel yaralanmaya yol açan herhangi bir kişi.",
      "b) Bir ateşli silahı kullanırken veya bu silahın bulundurulduğu sırada, başka bir kişiye kasten ve yasa dışı biçimde fiziksel güç uygulayan herhangi bir kişi.",
    ],
    classification:
      "Madde (a) ihlalinde B Sınıfı (6) felony. Hapis cezası 4 günden az 6 günden fazla olmayacaktır.\nMadde (b) ihlalinde B Sınıfı (8) felony. Hapis cezası 5 günden az 9 günden fazla olmayacaktır.",
  },
  {
    number: "210",
    title: "Kaçırma",
    types: ["F"],
    paragraphs: [
      "Zor kullanarak veya başka bir yolla korku uyandırarak, herhangi bir kişiyi başka bir ülkeye, eyalete, ilçeye veya ülkenin başka bir yerine taşımak amacıyla kaçıran, tutan, alıkoyan veya yasa dışı bir şekilde tutuklayan herhangi bir kişi.",
    ],
    classification:
      "B Sınıfı (7) felony kapsamında sorumlu tutulacaktır. Hapis cezası 5 günden az olmayacaktır.",
  },
  {
    number: "211",
    title: "İnsan Kaçakçılığı",
    types: ["F"],
    paragraphs: [
      "Zorlama, şiddet veya diğer yasa dışı yollarla zorla çalıştırma veya hizmet elde etme niyetiyle ya da San Andreas'ın para karşılığı cinsel ilişki için seks işçisi sağlama yasasını ihlal etme niyetiyle birini kişisel özgürlüğünden mahrum eden herhangi bir kişi.",
    ],
    classification:
      "A Sınıfı (9) felony kapsamında sorumlu tutulacaktır. Hapis cezası 6 günden az olmayacaktır.",
  },
  {
    number: "212",
    title: "Yasa Dışı Hapis",
    types: ["M"],
    paragraphs: [
      "Zorla, korkuyla veya başka bir yolla bir kişiyi tutan, alıkoyan, zapt eden veya yasa dışı bir şekilde tutuklayan herhangi bir kişi.",
    ],
    classification:
      "B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
  },
  {
    number: "213",
    title: "İşkence",
    types: ["F"],
    paragraphs: [
      "İntikam, gasp, ikna veya herhangi bir sadist amaç için acımasız veya aşırı acı ve ıstıraba neden olma niyetiyle bir başkasına büyük bedensel zarar veren herhangi bir kişi.",
    ],
    classification:
      "A Sınıfı (10) felony kapsamında sorumlu tutulacaktır. Hapis cezası 6 günden az olmayacaktır.",
  },
  {
    number: "214",
    title: "Tehdit Suçu",
    types: ["M"],
    paragraphs: [
      "Başka bir kişinin ölümü veya ağır fiziksel yaralanmasıyla sonuçlanacağına makul olarak inanılacak bir suçu işlemekle kasten tehdit eden ve söz konusu kişinin fiziksel olarak bulunmadığı durumlarda da sözlü, yazılı veya elektronik bir iletişim cihazı aracılığıyla tehditlerde bulunan herhangi bir kişi.",
    ],
    classification:
      "B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 1 günden fazla olmayacaktır.",
  },
  {
    number: "215",
    title: "Soygun",
    types: ["F"],
    paragraphs: [
      "Bir başkasının mülkiyetinde bulunan, şahsından veya yakın mevcudiyetinden, iradesine karşı güç veya korku yoluyla kanuna aykırı olarak kişisel bir mülkün alınmasına karışan herhangi bir kişi.",
    ],
    classification:
      "B Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.",
  },
  {
    number: "216",
    title: "Silahlı Soygun",
    types: ["F"],
    paragraphs: [
      "Doğaçlama olsun ya da olmasın, herhangi bir türde tehlikeli bir alet ya da silah kullanarak, güç kullanarak veya korkuyla bir başkasının malını yasa dışı bir şekilde şahsından ya da doğrudan mülkiyetinden alan herhangi bir kişi.",
    ],
    classification:
      "B Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
  },
  {
    number: "217",
    title: "Tecavüz",
    types: ["F"],
    paragraphs: [
      "18 yaşın altında reşit olmayan bir kişiyle gerçekleştirilen rızaya dayalı bir cinsel ilişki eyleminde bulunan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
  },
  {
    number: "218",
    title: "Çocuk Bireyle İlişkiye Girme",
    types: ["F"],
    paragraphs: [
      "18 yaşından küçük bir bireyle karşılıklı rızaya dayalı olarak cinsel ilişkiye giren herhangi bir kişi.",
    ],
    classification:
      "A Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az olmayacaktır.",
  },
  {
    number: "219",
    title: "Cinsel Saldırı",
    types: ["F"],
    paragraphs: [
      "Cinsel uyarılma, tatmin veya taciz amacıyla başka bir kişinin mahrem yerine, o kişinin iradesi dışında dokunan herhangi bir kişi.",
    ],
    classification:
      "B Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 8 günden fazla olmayacaktır.",
  },
  {
    number: "220",
    title: "Taciz",
    types: ["M"],
    paragraphs: [
      "Belirli bir kişiye yönelik, kişiyi endişelendiren veya ciddi şekilde endişelendiren ve durdurmak için sözlü veya yazılı bildirim aldıktan sonra meşru amaca hizmet etmeyen bir davranış biçimine giren veya tekrar eden eylemlerde bulunan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 2 günden fazla olmayacaktır.",
  },
  {
    number: "221",
    title: "Aile İçi Şiddet",
    types: ["M"],
    paragraphs: [
      "Belirli bir kişiye yönelik, kişiyi endişelendiren veya ciddi şekilde endişelendiren ve durdurmak için sözlü veya yazılı bildirim aldıktan sonra meşru amaca hizmet etmeyen bir davranış biçimine giren veya tekrar eden eylemlerde bulunan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 2 günden fazla olmayacaktır.",
  },
  {
    number: "222",
    title: "Yakıcı Kimyasal Maddelerle Saldırı",
    types: ["F"],
    paragraphs: [
      "Herhangi bir kişinin bedenine zarar vermek veya vücudunun şeklini bozmak amacıyla, kasıtlı ve kötü niyetli olarak bir başkasının üzerine sülfürik asit, aşındırıcı asit, yanıcı madde veya her türlü yakıcı/yanıcı kimyasal madde döken, atan ya da buna neden olan herhangi bir kişi.",
    ],
    classification:
      "B Sınıfı (6) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
  },
  {
    number: "301",
    title: "Kundakçılık",
    types: ["F"],
    paragraphs: [
      "Herhangi bir yapı, orman arazisi veya mülkü kasten ve kötü niyetle ateşe veren, yakan veya yakılmasına sebep olan veya yakılmasına yardım eden veya tavsiyede bulunan herhangi bir kişi.",
    ],
    classification:
      "A Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 7 günden az olmayacaktır.",
  },
  {
    number: "302",
    title: "Hırsızlık",
    types: ["F"],
    paragraphs: [
      "Kamuya veya özel sektöre ait kullanılmayan ticari veya meskun yapılara, yasa dışı yollardan eşya temin etmek veya oraya suç işlemek maksadıyla giren veya bu yerlerde hukuka aykırı olarak bulunan kişi.",
    ],
    classification:
      "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.",
  },
  {
    number: "303",
    title: "Haneye Tecavüz",
    types: ["F"],
    paragraphs: [
      "Yasa dışı yollardan eşya temin etmek veya orada suç işlemek amacıyla herhangi bir yerleşim yerini, eylemin gerçekleştiği sırada mülkte insan olup olmadığını bilerek veya bilmeden işgal eden herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
  },
  {
    number: "304",
    title: "Büyük Çaplı Hırsızlık",
    types: ["F"],
    paragraphs: [
      "Başka bir kişinin veya kuruluşun değeri $5,501 veya daha fazlası olan kişisel malını çalan, alan, taşıyan, yönlendiren veya uzaklaştıran herhangi bir kişi. Ayrıca $5,501 veya daha fazla değerde sunulan hizmetler için kasıtlı olarak ödeme yapılmaması da bu kapsamdadır.",
    ],
    classification:
      "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 saatten az 2 günden fazla olmayacaktır.",
  },
  {
    number: "305",
    title: "Küçük Çaplı Hırsızlık",
    types: ["M"],
    paragraphs: [
      "Başka bir kişinin veya kuruluşun değeri $5,501 veya daha az olan kişisel malını çalan, alan, taşıyan, yönlendiren veya uzaklaştıran herhangi bir kişi. Ayrıca $5,501 veya daha az değerde sunulan hizmetler için kasıtlı olarak ödeme yapılmaması da bu kapsamdadır.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 saatten az 1 günden fazla olmayacaktır.",
  },
  {
    number: "306",
    title: "Araç Hırsızlığı",
    types: ["F"],
    paragraphs: [
      "İzinsiz olarak başka bir kişinin aracını çalan veya çalmaya teşebbüs eden veya başka bir kişinin aracını alan, süren veya uzaklaştıran herhangi bir kişi. Ayrıca park halindeki bir araca zorla girmek de bu kapsamdadır.",
    ],
    classification:
      "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 6 günden fazla olmayacaktır.",
  },
  {
    number: "307",
    title: "Ateşli Silah Hırsızlığı",
    types: ["F"],
    paragraphs: [
      "Değeri ne olursa olsun, kayıtlı olan herhangi bir ateşli silahı çalan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
  },
  {
    number: "308",
    title: "Hırsızlık Aletlerinin Bulundurulması",
    types: ["M"],
    paragraphs: [
      "Gerekli bir lisansa sahip olmadan bir kilidi kırma ya da hırsızlık yapma niyetiyle üzerinde maymuncuk, anahtar ucu, levye, tornavida, gerdirme çubuğu, maymuncuk tabancası, ana anahtar veya başka bir aleti bulunduran herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır.",
  },
  {
    number: "309",
    title: "Çalınan Mal Varlığının Alınması",
    types: ["M"],
    paragraphs: [
      "Çalınan veya hırsızlık ya da gasp teşkil eden herhangi bir yöntemle elde edilmiş herhangi bir mal varlığını, statüsünü bilerek satın alan veya teslim alan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 2 günden fazla olmayacaktır.",
  },
  {
    number: "310",
    title: "İzinsiz Giriş",
    types: ["M"],
    paragraphs: [
      "Herhangi bir kişinin mülküne, orada yürütülen iş faaliyetlerine müdahale etmek veya engellemek amacıyla giren veya herhangi bir kişinin mülkünü izinsiz girip işgal eden veya bir mülk sahibi, yönetici ya da çalışan tarafından istenilmesine rağmen özel mülkten ayrılmayı reddeden herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 2 günden fazla olmayacaktır.",
  },
  {
    number: "311",
    title: "Vandalizm",
    types: ["M"],
    paragraphs: [
      "Kendisine ait olmayan bir mülkü tahrif eden, zarar veren veya yok eden herhangi bir kişi. Yakılmasını içermez.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 2 günden fazla olmayacaktır, para cezası ise $2,500 olacaktır.",
  },
  {
    number: "312",
    title: "Zimmetine Geçirme",
    types: ["M", "F"],
    paragraphs: [
      "a) Güven ilişkisi bulunan kurum veya kuruluştaki mal varlıklarını hukuka aykırı olarak mülkiyetine veya denetimi altına alması.",
      "b) Mal varlığının hileli bir şekilde kendi kullanımına tahsis edilmesi durumunu oluşturacak yasa dışı sistematik bir davranış biçimine dahil olması.",
      "c) Mal varlığının asıl sahibini, bu malın kullanımından mahrum bırakma kastı ile hareket etmesi.",
    ],
    classification:
      "Toplam değer $30.000'ı aşmıyorsa C Sınıfı misdemeanor. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.\nToplam değer $30.000'ı aşıyorsa C Sınıfı (2) felony. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.",
  },
  {
    number: "313",
    title: "Taşıt Tescil Hırsızlığı",
    types: ["M", "F"],
    paragraphs: [
      "a) Başka bir kişinin taşıt plakasını çalan, çalmaya teşebbüs eden veya alan herhangi bir kişi.",
      "b) Motorlu taşıtına başka birisinin taşıtına ait plaka takmış olan ya da bu plakayı aktif olarak kullanan herhangi bir kişi.",
      "c) Bu suçun (b) maddesinin ihlal edilmesine istinaden takip eden bir kolluk kuvveti personelinden kasten kaçan veya kaçmaya teşebbüs eden herhangi bir kişi.",
    ],
    classification:
      "Madde (a) ihlalinde C Sınıfı misdemeanor. Hapis cezası 3 saatten az 1 günden fazla olmayacaktır.\nMadde (b) ihlalinde C Sınıfı misdemeanor. Hapis cezası 12 saatten az 2 günden fazla olmayacaktır.\nMadde (c) ihlalinde C Sınıfı (3) felony. Hapis cezası 1 günden az 3 günden fazla olmayacaktır. Kaçış motorlu bir taşıt veya bisiklet ile yapıldığı takdirde 115. madde ek suçlama olarak eklenir.",
  },
  {
    number: "314",
    title: "Hapishane Mülküne Zarar Verme",
    types: ["M", "F"],
    paragraphs: [
      "Herhangi bir eyalet hapishanesini, Department of Corrections yetkisi altındaki herhangi bir tesisi, ilçe hapishanesini, şehir hapishanesini veya mahkum ve tutukluların bulunduğu bir tesisi ya da bu tesise ait bir mülkü tahrif eden, zarar veren veya yok eden herhangi bir kişi.",
    ],
    classification:
      "Hasarın toplam maliyeti $950'ı aşmıyorsa C Sınıfı misdemeanor. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.\nHasarın toplam maliyeti $950'ı aşıyorsa C Sınıfı (2) felony. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.",
  },
  {
    number: "401",
    title: "Geçerli Bir Sürücü Lisansı Olmadan Araç Kullanma",
    types: ["M"],
    paragraphs: [
      "Geçerlilik süresi dolmuş bir sürücü lisansıyla veya geçerli bir San Andreas Sürücü Lisansı olmadan motorlu taşıt kullanan kişiler bu suçu işlemiş sayılır. Bu madde 16 yaşından küçük kişilerin sürücü lisansı gerektiren bir motorlu taşıt kullanmasını da kapsar.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 30 dakikadan az 1 günden fazla olmayacaktır. Para cezası ise $2.500 olacaktır ve araç 1 günlüğüne bağlanacaktır.\n\nNot: Havalimanı araç kiralama acentesinden kiralanan araçlar sürücü lisansı gerekliliklerinden muaftır. Lisansı askıya alınmış veya el koyulmuş kişiler bu muafiyetten yararlanamaz.",
  },
  {
    number: "402",
    title: "Askıya Alınmış Bir Sürücü Lisansıyla Araç Kullanma",
    types: ["M"],
    paragraphs: [
      "Araç sürme ayrıcalıkları askıya alınmış veya iptal edilmişken araç kullanan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 45 dakikadan az 1 günden fazla olmayacaktır. Para cezası ise $5.000 olacaktır ve araç 2 günlüğüne bağlanacaktır.",
  },
  {
    number: "403",
    title: "Sürücü Lisansı İbraz Etmemek",
    types: ["I"],
    paragraphs: [
      "Kamuya açık bir yolda motorlu taşıt kullanırken, kolluk kuvvetleri personeli tarafından yasalar çerçevesinde talep edilen geçerli sürücü lisansını ibraz edemeyen veya etmeyi reddeden herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.000 para cezası ile cezalandırılacaktır.",
  },
  {
    number: "404",
    title: "Taşıt Tescil Belgesi İbraz Etmemek",
    types: ["I"],
    paragraphs: [
      "Kamuya açık bir yolda motorlu taşıt kullanırken, kolluk kuvvetleri personeli tarafından yasalar çerçevesinde talep edilen geçerli taşıt tescil belgesini ibraz edemeyen veya etmeyi reddeden herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.000 para cezası ile cezalandırılacaktır.",
  },
  {
    number: "405",
    title: "Taşıt Sigorta Belgesi İbraz Etmemek",
    types: ["I"],
    paragraphs: [
      "Kamuya açık bir yolda motorlu taşıt kullanırken, kolluk kuvvetleri personeli tarafından yasalar çerçevesinde talep edilen geçerli taşıt sigorta belgesini ibraz edemeyen veya etmeyi reddeden herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.000 para cezası ile cezalandırılacaktır.",
  },
  {
    number: "406",
    title: "Kayıtsız Taşıt",
    types: ["I"],
    paragraphs: [
      "Geçerli bir taşıt tescil kaydı veya geçerli bir plakası bulunmayan herhangi bir motorlu taşıtı ya da römorku,",
      "(a) kamuya açık bir yolda kullanan; veya",
      "(b) kamuya açık bir yola park eden herhangi bir kişi.",
    ],
    classification:
      "Madde (a) ihlalinde C Sınıfı infraction. $5.000 para cezası, taşıta 1 gün el koyulacak, lisans 3 gün askıya alınacaktır.\nMadde (b) ihlalinde C Sınıfı infraction. $5.000 para cezası ve taşıta 1 gün el koyulacaktır.",
  },
  {
    number: "407",
    title: "Sigortasız Taşıt",
    types: ["I"],
    paragraphs: [
      "Geçerli bir taşıt sigortası bulunmayan herhangi bir motorlu taşıtı,",
      "(a) kamuya açık bir yolda kullanan; veya",
      "(b) kamuya açık bir yola park eden herhangi bir kişi.",
    ],
    classification:
      "Madde (a) ihlalinde C Sınıfı infraction. $5.000 para cezası, taşıta 1 gün el koyulacak, lisans 3 gün askıya alınacaktır.\nMadde (b) ihlalinde C Sınıfı infraction. $5.000 para cezası ve taşıta 1 gün el koyulacaktır.",
  },
  {
    number: "408",
    title: "Vur Kaç",
    types: ["F", "M"],
    paragraphs: [
      "(a) Motorlu taşıt kullanırken, bir mala veya taşıta karşı maddi zarara neden olan bir kazaya karıştıktan sonra bilgi alışverişi yapılana veya kolluk kuvvetleri soruşturmasını tamamlayana kadar olay yerinde durmayan herhangi bir kişi. (M)",
      "(b) Motorlu taşıt kullanırken, bir yaralanmaya veya ölüme neden olan bir kazaya karıştıktan sonra bilgi alışverişi yapılana veya kolluk kuvvetleri soruşturmasını tamamlayana kadar olay yerinde durmayan herhangi bir kişi. (F)",
    ],
    classification:
      "Madde (a) ihlalinde C Sınıfı misdemeanor. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.\nMadde (b) ihlalinde A Sınıfı (4) veya B Sınıfı (3) felony. Hapis cezası 12 saatten az 3 günden fazla olmayacaktır.",
  },
  {
    number: "409",
    title: "Bir Arazi veya Deniz Aracının Dikkatsiz Kullanımı",
    types: ["M"],
    paragraphs: [
      "Eyalet içerisinde sokak, cadde ya da kavşak olarak nitelendirilen, araç trafiğine uygun alanlarda, trafiğe çıkması uygun olmayan bir aracı kasıtlı veya kasıtsız olarak dikkatsiz bir şekilde kullanan kişileri kapsar. ATV'ler, golf arabaları, tarım araçları; botlar ve diğer deniz taşıtları bu kapsamdadır.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 7 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $15.000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür. Bu suç için ceza artırımlarına izin verilmektedir.",
  },
  {
    number: "410",
    title: "Hız İhlali",
    types: ["I"],
    paragraphs: [
      "(a) Otoyollar - 100 MPH;",
      "(b) County yolları - 75 MPH;",
      "(c) County veya city bölgesindeki yerleşim yerleri (otoyollar hariç) - 60 MPH;",
      "(d) Ulusal park sınırları, avlanma bölgeleri, okul veya üniversite bölgeleri - 45 MPH.",
      "Yol türlerine göre belirlenen azami hız sınırlarını 1 ila 29 MPH arasında aşarak motorlu bir taşıt kullanan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $8.000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
  },
  {
    number: "411",
    title: "Aşırı Hız İhlali",
    types: ["I"],
    paragraphs: [
      "410. Hız İhlali maddesinde belirtilen azami hız sınırlarından 30 MPH veya daha yüksek hızda seyreden herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $8.000 para cezası\n2. 1 günlüğüne taşıta el koyulacaktır, 2 günlüğüne lisans askıya alınacaktır ve $8.000 para cezası\n3. 3 günlüğüne taşıta el koyulacaktır, 4 günlüğüne lisans askıya alınacaktır ve $12.000 para cezası\n4. 7 günlüğüne taşıta el koyulacaktır, 7 günlüğüne lisans askıya alınacaktır ve $15.000 para cezası\n5. 10 günlüğüne taşıta el koyulacaktır, 10 günlüğüne lisans askıya alınacaktır ve $20.000 para cezası",
  },
  {
    number: "412",
    title: "Trafik Kontrol Araçlarına Uymama",
    types: ["I"],
    paragraphs: [
      "(a) Dur levhaları, yol ver levhaları ve diğer yönlendirici trafik işaretleri;",
      "(b) Yol çalışması, şerit kapatma veya tehlike riski uyarısı amacıyla kullanılan koniler, bariyerler, reflektörlü ışıklar ve diğer geçici trafik kontrol araçları;",
      "(c) Trafiği yönlendiren kolluk kuvvetleri personeli, yol çalışması personelleri veya diğer yetkili personeller.",
      "Belirtilen trafik kontrol araçlarına veya yetkili personelin talimatlarına uymayan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
  },
  {
    number: "413",
    title: "Kavşakta Yol Vermeme",
    types: ["I"],
    paragraphs: [
      "(a) Kavşağa halihazırda girmiş ya da kavşaktan geçme önceliği olan herhangi bir taşıta; veya",
      "(b) Başka bir yönden yaklaşan ve acil durum bildiren herhangi bir taşıta yol vermeyen herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
  },
  {
    number: "414",
    title: "Trafiğe Girişte Yol Vermeme",
    types: ["I"],
    paragraphs: [
      "Özel mülke ait bir yoldan, garaj girişinden, bağlantı yollarından veya yol dışı bir alandan kamuya açık bir yola girerken trafikteki araçlara yol vermeyen herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
  },
  {
    number: "415",
    title: "Yaya Geçidinde Yol Vermeme",
    types: ["I"],
    paragraphs: [
      "Yaya geçidinde bulunan veya yaya geçidine giren yayalara yol vermeyen herhangi bir kişi. Sürücü yayaların güvenli bir şekilde geçebilmesini sağlamak için gerektiğinde durmalı veya yavaşlamalıdır.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
  },
  {
    number: "416",
    title: "Acil Durum Araçlarına Yol Vermeme",
    types: ["I"],
    paragraphs: [
      "(a) Tepe lambası yanıp sönen durumda olan bir acil durum aracı yaklaştığında, sürücü kavşak dışında, kaldırımda veya yol kenarına paralel bir konumda durmalı ve acil durum aracı geçene kadar hareketsiz kalmalıdır; veya",
      "(b) Tepe lambası yanıp sönen durumda olan bir acil durum aracı yolda duruyorsa, alana yaklaşan sürücüler mümkün olan en uzak şeride veya yol kenarına yönelmeli, hızını düşürmeli ve dikkatli bir şekilde ilerlemelidir.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
  },
  {
    number: "417",
    title: "Dönüşte Hatalı Şeride Girme",
    types: ["I"],
    paragraphs: [
      "Bir kavşakta ya da yol ağzında sola veya sağa dönüş için ayrılmış manevra şeritlerine emniyetli ve trafik düzenini sağlayacak şekilde girmeden dönüş yapan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
  },
  {
    number: "418",
    title: "Hatalı Park",
    types: ["I"],
    paragraphs: [
      "2023 Park Tanımlamaları Kanunu'na göre kural dışı park edilmiş taşıtları kapsar. Kural dışı park tanımına dahil olan noktalar:",
      "Şeritlere, garaj girişlerine, ara sokaklara, otoparklara veya tren raylarına; yaya geçidine, kaldırıma, refüje, tünele, köprüye veya ters yöne; kırmızı renkli kaldırımların önüne; otoyollardaki emniyet şeridine; bir yangın musluğuna 5 feet mesafeden daha yakına; bir helipad veya hava taşıtı alanına; birden fazla park alanını kaplayacak şekilde; engelli park yerine; EV şarj alanına elektrikli olmayan bir aracı park ederek; tabelayla işaretlenmiş otobüs veya taksi duraklarına ve 15 feet çevrelerine.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $1.000 para cezası\n2. $2.500 para cezası\n3. $5.000 para cezası\nNot: Trafik akışını engelleyen veya halk için risk oluşturan araçlara 1 gün süreyle el koyulabilir.",
  },
  {
    number: "419",
    title: "Dikkatsiz Sürüş",
    types: ["M"],
    paragraphs: [
      "Motorlu taşıtını kasıtlı olarak pervasızca ya da dikkatsizce kullanarak kişilerin veya malların emniyetini hiçe sayan; düşük maddi zarar ve hafif bedensel yaralanma riski yaratan ancak yüksek maddi zarara, ağır bedensel yaralanmaya veya ölüme yol açmamış olan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır. Para cezası ise $5.000 olacak, taşıt 3 gün bağlanacak ve lisans 3 gün askıya alınacaktır.",
  },
  {
    number: "420",
    title: "Araç Tehlikesi",
    types: ["F"],
    paragraphs: [
      "Motorlu taşıtını kasıtlı olarak pervasızca ya da dikkatsizce kullanarak kişilerin veya malların emniyetini hiçe sayan ve bunun sonucunda yüksek maddi zarara, ağır bedensel yaralanmaya veya ölüme yol açmış olan herhangi bir kişi.",
    ],
    classification:
      "A Sınıfı (4), B Sınıfı (3) veya C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 5 günden fazla olmayacaktır. Para cezası ise $10.000 olacaktır.",
  },
  {
    number: "421",
    title: "Farları Çalıştırmamak",
    types: ["I"],
    paragraphs: [
      "20:30 (8:30 PM) ile 06:30 (06:30 AM) saatleri arasında ya da hava, yol koşulları veya diğer faktörler nedeniyle görüş mesafesinin azaldığı herhangi bir zamanda taşıtının farlarını çalıştırmadan kullanan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $2.500 para cezası ile cezalandırılacaktır.",
  },
  {
    number: "422",
    title: "Emniyetsiz Geri Manevra",
    types: ["I"],
    paragraphs: [
      "(a) Akan trafiğe doğru geri gitmek,",
      "(b) Yeterli görüş ve kontrol sağlamadan geriye doğru gitmek,",
      "(c) Geriye doğru giderken araçlara ve yayalara yol vermemek.",
      "Belirtilen alt maddeler de dahil olmak üzere, geri manevra esnasında trafikteki diğer sürücülere ve yayalara tehlike oluşturan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
  },
  {
    number: "423",
    title: "Trafiği Engelleme",
    types: ["I"],
    paragraphs: [
      "Yasal bir zorunluluk olmadıkça veya bir kolluk kuvvetleri personeli tarafından yönlendirilmedikçe aracını trafiği engelleyecek şekilde yolda durduran herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
  },
  {
    number: "424",
    title: "Ters Yönde Sürüş",
    types: ["I"],
    paragraphs: [
      "Bir kolluk kuvvetleri personeli veya yetkili bir trafik kontrol personeli tarafından yönlendirilmedikçe taşıtını belirtilen yönün ters istikametinde kullanan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
  },
  {
    number: "425",
    title: "Emniyetsiz Sürüş",
    types: ["I"],
    paragraphs: [
      "(a) Yol, hava durumu, görüş mesafesi ve trafik koşullarına göre sürüş davranışını ayarlayamamak,",
      "(b) Yemek yeme, nesnelere uzanma, yolcularla dikkat dağıtacak fiziksel etkileşime girme, kişisel bakım yapma gibi taşıtın kontrolünü sağlama yeteneğini etkileyen davranışlarda bulunma.",
      "Belirtilen alt maddeler de dahil olmak üzere, emniyetli sürüşü etkileyen faktörleri dikkate almadan taşıt kullanan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
  },
  {
    number: "426",
    title: "Sürüş Sırasında Elektronik Cihaz Kullanma",
    types: ["I"],
    paragraphs: [
      "Taşıt kullanırken acil bir durum ya da fiziksel temas gerektirmeyen; serbest eller modu dışında elektronik cihaz kullanan, elle müdahale eden, tutan veya etkileşimde bulunan herhangi bir kişi.",
    ],
    classification:
      "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
  },
];

const filterOptions: Array<{ value: CrimeType; label: string; description: string }> = [
  { value: "F", label: "Felony", description: "Ağır suçlar" },
  { value: "M", label: "Misdemeanor", description: "Kabahatler" },
  { value: "I", label: "Infraction", description: "İhlaller" },
];

const typeStyles: Record<CrimeType, { badge: string; label: string; accent: string }> = {
  F: {
    badge: "border-destructive/30 bg-destructive/10 text-destructive",
    label: "Felony",
    accent: "border-l-destructive",
  },
  M: {
    badge: "border-warning/30 bg-warning/10 text-warning",
    label: "Misdemeanor",
    accent: "border-l-warning",
  },
  I: {
    badge: "border-success/30 bg-success/10 text-success",
    label: "Infraction",
    accent: "border-l-success",
  },
};

export const Route = createFileRoute("/penal-code")({
  head: () => ({
    meta: [
      { title: "Ceza Kanunları — LSPD Portal" },
      {
        name: "description",
        content: "GTA:W TR Roleplay için San Andreas ceza kanunlarını arayın ve filtreleyin.",
      },
      { property: "og:title", content: "Ceza Kanunları — LSPD Portal" },
      {
        property: "og:description",
        content: "San Andreas ceza kanunlarını suç türüne göre arayın ve filtreleyin.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PenalCodePage,
});

function PenalCodePage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");

    return penalCodeEntries.filter((entry) => {
      const matchesType = activeFilter === null || entry.types.includes(activeFilter);
      const searchableText = [
        entry.number,
        entry.title,
        ...entry.types,
        ...entry.types.map((type) => typeStyles[type].label),
        ...entry.paragraphs,
        entry.classification,
      ]
        .join(" ")
        .toLocaleLowerCase("tr-TR");

      return matchesType && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [activeFilter, query]);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 py-8 sm:py-10">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">LSPD Hukuk Birimi</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Ceza Kanunları</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Suç ve kanun maddelerini arayın, suç türüne göre listeyi daraltın.
          </p>
        </header>

        <section className="mt-8 space-y-4" aria-label="Ceza kanunları arama ve filtreleme">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Kanun maddelerinde ara..."
              aria-label="Kanun maddelerinde ara"
              className="h-11 border-border bg-card pl-10"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {filterOptions.map((option) => {
              const active = activeFilter === option.value;
              const style = typeStyles[option.value];

              return (
                <Button
                  key={option.value}
                  type="button"
                  variant="outline"
                  onClick={() => setActiveFilter(active ? null : option.value)}
                  aria-pressed={active}
                  className={cn(
                    "h-auto justify-start border-border bg-card px-4 py-3 text-left hover:bg-accent",
                    active && "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-md border text-sm font-bold",
                      style.badge,
                    )}
                  >
                    ({option.value})
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{option.label}</span>
                    <span className="block text-xs font-normal text-muted-foreground">{option.description}</span>
                  </span>
                </Button>
              );
            })}
          </div>
        </section>

        <div className="mt-8 flex items-center justify-between gap-4 border-b border-border pb-3">
          <p className="text-sm text-muted-foreground">
            {query
              ? `“${query}” için sonuçlar`
              : activeFilter === null
                ? "Tüm ceza kanunları"
                : `${typeStyles[activeFilter].label} maddeleri`}
          </p>
          <span className="text-xs font-medium text-muted-foreground">{filteredEntries.length} madde</span>
        </div>

        <section className="mt-4 space-y-3" aria-live="polite" aria-label="Ceza kanunu sonuçları">
          {filteredEntries.map((entry) => {
            const style = typeStyles[entry.types[0] ?? "F"];

            return (
              <article
                key={entry.number}
                className={cn(
                  "border border-border border-l-4 bg-card px-5 py-5 shadow-sm transition-colors hover:bg-card sm:px-6",
                  style.accent,
                )}
              >
                <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
                  <span className="font-mono text-base font-semibold text-foreground">{entry.number}.</span>
                  <h2 className="text-base font-semibold text-foreground">{entry.title}</h2>
                  {entry.types.map((type) => (
                    <span
                      key={type}
                      className={cn("rounded border px-2 py-0.5 text-xs font-bold", typeStyles[type].badge)}
                    >
                      ({type}) {typeStyles[type].label}
                    </span>
                  ))}
                </div>

                <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                  {entry.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <p className="mt-4 whitespace-pre-line border-t border-border pt-3 text-sm font-medium leading-6 text-foreground/80">
                  {entry.classification}
                </p>
              </article>
            );
          })}

          {filteredEntries.length === 0 && (
            <div className="border border-dashed border-border bg-card/40 px-6 py-12 text-center">
              <p className="text-sm font-medium text-foreground">Sonuç bulunamadı</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Arama metnini veya suç türü filtresini değiştirerek tekrar deneyin.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
