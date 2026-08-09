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
