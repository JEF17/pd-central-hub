export type Jurisdiction = "US" | "SA";

export type CaseEntry = {
  title: string;
  court: string;
  jurisdiction: Jurisdiction;
  summary: string;
  implication: string;
  source: string;
};

export const mirandaRights = [
  "Sessiz kalma hakkına sahipsiniz.",
  "Söyleyeceğiniz her şey mahkemede aleyhinize delil olarak kullanılabilir.",
  "Bir avukat bulundurma ve sorgulama sırasında avukatınızın yanınızda olmasını isteme hakkına sahipsiniz.",
  "Avukat tutacak maddi gücünüz yoksa, siz talep ettiğiniz takdirde size bir avukat atanacaktır.",
  "Bu hakları anladınız mı?",
];

export const legalResources = [
  {
    title: "San Andreas Ceza Kanunu",
    description: "Resmî San Andreas ceza kanununa erişin.",
    href: "https://forum-tr.gta.world/index.php?/topic/77-san-andreas-ceza-kanunu/",
  },
  {
    title: "Kefalet Cetveli",
    description: "Resmî kefalet ve teminat cetvelini görüntüleyin.",
    href: "https://docs.google.com/spreadsheets/d/1Gx7QAujLMvwc7TvFjovNdZ5UwUmhu7TXuJS40ZqKafw/edit?usp=sharing",
  },
  {
    title: "2023 Uyuşturucuyla Mücadele ve Önleme Yasası (DEPA)",
    description: "2023 tarihli Uyuşturucuyla Mücadele ve Önleme Yasasını görüntüleyin.",
    href: "https://forum-tr.gta.world/index.php?/topic/7076-2023-uyu%C5%9Fturucuyla-m%C3%BCcadele-ve-%C3%B6nleme-yasas%C4%B1-depa/",
  },
];

export const cctvStandards = [
  {
    label: "Şehir İçi",
    href: "https://drive.google.com/file/d/1e5HqS3F9HbLFHEUMpJ9iFBPBBygNuF4P/view",
  },
  {
    label: "Şehir Dışı",
    href: "https://drive.google.com/file/d/1TItxWybbhL71mufxOx_8XKZUYH4kyE3l/view",
  },
];

export const caseEntries: CaseEntry[] = [
  {
    title: "Terry v. Ohio (1968)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Bu dava, 'Terry araması' (dur ve üst yokla) uygulamasını kurmuştur. Bir kişinin suç işlediğine, işlemekte olduğuna veya işlemek üzere olduğuna dair makul şüphe varsa polis o kişiyi kısa süreliğine durdurup sorgulayabilir. Memur ayrıca kişinin silahlı ve tehlikeli olduğundan makul şekilde şüpheleniyorsa, dış giysiler üzerinden silah araması yapabilir.",
    implication:
      "Memurlar, tutuklama için gerekli kuvvetli şüpheye ihtiyaç duymadan, makul şüpheye dayalı bir durdurma sırasında sınırlı bir silah araması yapabilir.",
    source: "https://www.oyez.org/cases/1967/67",
  },
  {
    title: "Miranda v. Arizona (1966)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Gözaltındaki bir şüphelinin sorguya alınmadan önce anayasal hakları konusunda bilgilendirilmesi gerektiğini kurmuştur. Bu haklar sessiz kalma ve avukat bulundurma haklarını içerir. Bu uyarının yapılmaması, sonrasında alınan ifadeyi mahkemede geçersiz kılabilir.",
    implication:
      "Gözaltındaki şüphelilere sorgu başlamadan önce Miranda hakları okunmalıdır. Bu, ifadelerin gönüllü ve kabul edilebilir olmasını sağlar.",
    source: "https://www.oyez.org/cases/1965/759",
  },
  {
    title: "Graham v. Connor (1989)",
    court: "Federal (Hukuk)",
    jurisdiction: "US",
    summary:
      "Kolluk kuvvetinin güç kullanımı için 'objektif makullük' standardını belirler. Kullanılan güç; suçun ağırlığı, şüphelinin anlık tehdit oluşturup oluşturmadığı ve aktif direniş ya da kaçma girişimi dikkate alınarak, olay yerindeki makul bir memurun bakış açısından değerlendirilir.",
    implication:
      "Tüm güç kullanımları, sonradan edinilen bilgilerle değil, aynı durumdaki makul bir memurun ne yapacağı esas alınarak değerlendirilir.",
    source: "https://www.oyez.org/cases/1988/87-6571",
  },
  {
    title: "Tennessee v. Garner (1985)",
    court: "Federal (Hukuk)",
    jurisdiction: "US",
    summary:
      "Yüksek Mahkeme, Dördüncü Ek Madde uyarınca bir polis memurunun kaçan şüphelinin kaçışını engellemek için öldürücü güç kullanamayacağına; ancak şüphelinin memura veya başkalarına ölüm ya da ağır bedensel zarar tehdidi oluşturduğuna dair kuvvetli şüphe varsa bunun mümkün olduğuna hükmetmiştir.",
    implication:
      "Kaçan şüpheliye karşı öldürücü güç yalnızca kişi başkaları için ciddi ve ani bir tehlike oluşturuyorsa meşrudur. Sadece kaçışı önlemek için kullanılamaz.",
    source: "https://www.oyez.org/cases/1984/83-1035",
  },
  {
    title: "Carroll v. United States (1925)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Dördüncü Ek Madde'nin arama emri şartına 'araç istisnası'nı getirmiştir. Araçta delil veya yasa dışı madde bulunduğuna dair kuvvetli şüphe varsa polis, arama emri olmadan aracı arayabilir.",
    implication:
      "Kuvvetli şüphe varsa araç, kolayca hareket ettirilip delilin kaybolma ihtimali nedeniyle arama emri olmadan yerinde aranabilir.",
    source: "https://www.oyez.org/cases/1900-1940/267us132",
  },
  {
    title: "Arizona v. Gant (2009)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Tutuklamaya bağlı araç aramalarının kapsamını daraltmıştır. Polis, yalnızca tutuklanan kişinin arama sırasında araca erişebileceğine ya da araçta tutuklamaya konu suça ilişkin delil bulunduğuna 'inanmak için makul sebep' varsa yolcu bölümünü arayabilir.",
    implication:
      "Tutuklama sonrası aracın tüm yolcu bölümünün otomatik aranması artık mümkün değildir. Arama, kişinin araca erişim ihtimali veya suça ilişkin delil bulunma olasılığıyla gerekçelendirilmelidir.",
    source: "https://www.oyez.org/cases/2008/07-542",
  },
  {
    title: "Whren v. United States (1996)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Bir memurun trafik ihlali gerçekleştiğine inanmak için makul sebebi olduğu sürece, gerçek amacı makul şüphe bulunmayan başka bir suçu araştırmak olsa dahi aracı durdurabileceğine hükmedilmiştir (bahaneli durdurma).",
    implication:
      "Geçerli her trafik ihlali, memurun altta yatan soruşturma amacından bağımsız olarak meşru bir durdurma sebebidir.",
    source: "https://www.oyez.org/cases/1995/95-5841",
  },
  {
    title: "Mapp v. Ohio (1961)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "'Delil dışlama kuralı'nı On Dördüncü Ek Madde yoluyla eyaletlere de uygulamıştır. Kural, Dördüncü Ek Madde ihlal edilerek elde edilen delillerin mahkemede kullanılmasını engeller.",
    implication:
      "Hukuka aykırı elde edilen delil eyalet mahkemelerinde kabul edilmez. 'Zehirli ağacın meyvesi' doktrini anayasaya aykırı polis uygulamalarına karşı caydırıcıdır.",
    source: "https://www.oyez.org/cases/1960/236",
  },
  {
    title: "Katz v. United States (1967)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Mahkeme, Dördüncü Ek Madde'nin 'mekânları değil kişileri koruduğuna' hükmederek 'makul mahremiyet beklentisi' standardını getirmiştir. Devletin, toplumun makul saydığı bir mahremiyet beklentisini ihlal etmesi bir arama sayılır.",
    implication:
      "Arama emri şartı yalnızca fiziksel müdahaleye bağlı değildir. Kişinin makul mahremiyet beklentisi bulunan yerlerde yapılan elektronik izleme de arama sayılır.",
    source: "https://www.oyez.org/cases/1967/35",
  },
  {
    title: "Gideon v. Wainwright (1963)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Altıncı Ek Madde'deki avukat hakkının, On Dördüncü Ek Madde yoluyla eyalet mahkemelerindeki sanıklar için de geçerli olduğuna oybirliğiyle hükmedilmiştir. Devlet, ağır suçlarda yoksul sanıklara avukat sağlamalıdır.",
    implication: "Ciddi bir suçla itham edilen herkesin, ödeme gücünden bağımsız olarak avukat hakkı vardır.",
    source: "https://www.oyez.org/cases/1962/155",
  },
  {
    title: "Chimel v. San Andreas (1969)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Hukuka uygun bir tutuklamaya bağlı aramanın kapsamını belirlemiştir. Polis, silah bulmak veya delilin yok edilmesini önlemek için tutuklanan kişiyi ve 'doğrudan kontrolü altındaki' alanı arayabilir.",
    implication:
      "Tutuklama sonrası arama emri olmadan yapılan aramalar, kişinin anında erişebileceği alanla sınırlıdır. Bir odada tutuklanan kişi için tüm evin aranması emirsiz mümkün değildir.",
    source: "https://www.oyez.org/cases/1968/770",
  },
  {
    title: "Illinois v. Gates (1983)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Muhbir ihbarına dayalı arama emri için kuvvetli şüphenin varlığını belirlemede 'olayın bütünlüğü' standardını getirmiştir. Bu esnek standart, önceki katı iki aşamalı testin yerini almıştır.",
    implication:
      "Arama emri talebinde muhbirin bilgi kaynağı, güvenilirliği ve polisin doğrulayıcı çalışmaları birlikte, bütüncül biçimde değerlendirilir.",
    source: "https://www.oyez.org/cases/1982/81-430",
  },
  {
    title: "United States v. Ross (1982)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "'Araç istisnası'nın kapsamını netleştirmiştir. Polisin araçta yasa dışı madde bulunduğuna dair kuvvetli şüphesi varsa, aranan nesneyi makul şekilde içerebilecek her kabı da arayabilir.",
    implication:
      "Kuvvetli şüpheye dayalı emirsiz araç aramasının kapsamı, arama emriyle yapılacak arama kadar geniştir; bagaj ve kapalı kaplar dâhildir.",
    source: "https://www.oyez.org/cases/1981/80-2209",
  },
  {
    title: "Schneckloth v. Bustamonte (1973)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Aramaya rıza gösterilmesinde gönüllülüğün, olayın bütünlüğüne göre belirlenen bir maddi vakıa meselesi olduğuna hükmetmiştir. Devletin, rıza veren kişinin reddetme hakkını bildiğini kanıtlaması gerekmez.",
    implication:
      "Rıza, baskı veya zorlama sonucu değilse geçerlidir. Polisin kişiye reddetme hakkını hatırlatma zorunluluğu yoktur.",
    source: "https://www.oyez.org/cases/1972/71-732",
  },
  {
    title: "Nix v. Williams (1984)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Delil dışlama kuralına 'kaçınılmaz keşif' istisnasını getirmiştir. Anayasaya aykırı yolla elde edilen delil, hukuka uygun yollarla da kaçınılmaz olarak bulunacaksa mahkemede kabul edilebilir.",
    implication:
      "Usulüne uygun bağımsız bir soruşturmanın aynı delile ulaşacağı gösterilebiliyorsa, hukuka aykırı elde edilen delil yine de kullanılabilir.",
    source: "https://www.oyez.org/cases/1983/82-1651",
  },
  {
    title: "Brigham City, Utah v. Stuart (2006)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Bir kişinin ciddi şekilde yaralandığına ya da böyle bir yaralanma tehdidi altında olduğuna dair objektif makul sebep varsa polisin arama emri olmaksızın konuta girebileceğine oybirliğiyle hükmedilmiştir.",
    implication:
      "'Acil yardım doktrini', yardım sağlamak veya ciddi yaralanmayı önlemek için emirsiz girişe izin verir. Memurun öznel saiki, koşullar objektif olarak haklıysa önemsizdir.",
    source: "https://www.oyez.org/cases/2005/05-691",
  },
  {
    title: "Heien v. North Carolina (2014)",
    court: "Federal",
    jurisdiction: "US",
    summary: "Bir memurun hukuka ilişkin makul hatası, trafik durdurması için gereken makul şüpheyi sağlayabilir.",
    implication:
      "Memurun yasayı yorumlaması objektif olarak makul olduğu sürece, yorum sonradan yanlış çıksa bile durdurma geçerlidir.",
    source: "https://www.oyez.org/cases/2014/13-604",
  },
  {
    title: "Pennsylvania v. Mimms (1977)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Hukuka uygun bir trafik durdurması sırasında memur, ek bir gerekçeye ihtiyaç duymadan sürücüye araçtan inmesini emredebilir.",
    implication:
      "Bu otomatik bir memur güvenliği kuralıdır. Araçtan inme emrine uyulmaması, engelleme gibi ek hukuki sonuçlar doğurabilir.",
    source: "https://www.oyez.org/cases/1977/76-1830",
  },
  {
    title: "Maryland v. Wilson (1997)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Mimms kuralını yolculara da genişleterek, memurun güvenlik gerekçesiyle yolculara da araçtan inme emri verebileceğini kabul etmiştir.",
    implication:
      "Hukuka uygun bir trafik durdurması boyunca hem sürücü hem yolcular araçtan inme emrine uymak zorundadır.",
    source: "https://www.oyez.org/cases/1996/95-1268",
  },
  {
    title: "Florida v. Bostick (1991)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Karşılaşma rızaya dayalı olduğu ve makul bir kişi talebi reddetmekte özgür hissedeceği sürece, polis hiçbir şüphe olmaksızın kişinin eşyalarını aramak için rıza isteyebilir.",
    implication:
      "Rıza, polis baskısı veya makul bir kişinin reddedemeyeceğini düşüneceği bir otorite gösterisi olmadan verildiyse arama geçerlidir.",
    source: "https://www.oyez.org/cases/1990/89-1717",
  },
  {
    title: "Illinois v. Wardlow (2000)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Suç oranı yüksek bir bölgede polisi gören kişinin sebepsiz kaçışı, durdurmayı haklı kılan makul şüphenin belirlenmesinde dikkate alınabilecek bir unsurdur.",
    implication:
      "Polisten kaçmak gibi kaçamak davranışlar, Terry durdurmasını haklı kılan koşullar bütününe katkı sağlar.",
    source: "https://www.oyez.org/cases/1999/98-1036",
  },
  {
    title: "Brown v. Texas (1979)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Polis, kişinin suç faaliyetine karıştığına dair somut ve açıklanabilir bir şüphe olmaksızın kişiyi durdurup kimlik talep edemez.",
    implication: "Yalnızca kimlik sormak amacıyla kimse durdurulamaz; önce suça ilişkin makul şüphe bulunmalıdır.",
    source: "https://www.oyez.org/cases/1978/77-6673",
  },
  {
    title: "United States v. Mendenhall (1980)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Bir kişi ancak fiziksel güç veya otorite gösterisi nedeniyle makul bir kişinin ayrılmakta özgür olmadığını düşüneceği durumda 'yakalanmış' sayılır.",
    implication:
      "Bu dava, rızaya dayalı karşılaşma (şüphe gerektirmez) ile gözaltı/durdurma (en az makul şüphe gerektirir) arasındaki farkı belirler.",
    source: "https://www.oyez.org/cases/1979/78-1821",
  },
  {
    title: "Minnesota v. Dickerson (1993)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "'Dokunarak fark etme' doktrinini kurar. Hukuka uygun bir Terry araması sırasında memur, biçim veya kütlesinden yasa dışı olduğu derhal anlaşılan bir nesneyi emirsiz el koyabilir.",
    implication:
      "Silah araması sırasında bulunan suç unsuru el konulabilir; ancak memur nesneyi ne olduğunu anlamak için elleyip inceleyemez, niteliği ilk temasta belli olmalıdır.",
    source: "https://www.oyez.org/cases/1992/91-2019",
  },
  {
    title: "United States v. Robinson (1973)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Hukuka uygun bir gözaltı tutuklamasının ardından polis, tutuklanan kişinin üzerinde ve doğrudan kontrolündeki alanda tam arama yapabilir.",
    implication:
      "'Tutuklamaya bağlı arama' arama emri şartının otomatik bir istisnasıdır ve geçerli tutuklama dışında ek gerekçe gerektirmez.",
    source: "https://www.oyez.org/cases/1973/72-936",
  },
  {
    title: "Rodriguez v. United States (2015)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Rutin bir trafik durdurması, ek makul şüphe olmadıkça, amacının (örneğin ceza yazmanın) makul olarak gerektirdiği süreden fazla uzatılamaz.",
    implication:
      "Trafik ihlaline ilişkin işlemler bittiğinde durdurma yetkisi sona erer. İlgisiz bir soruşturma için gözaltının sürdürülmesi ayrı bir makul şüphe gerektirir.",
    source: "https://www.oyez.org/cases/2014/13-9972",
  },
  {
    title: "Illinois v. Caballes (2005)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Hukuka uygun bir trafik durdurması sırasında narkotik köpeğinin aracın dışında kullanılması, durdurmayı uzatmadığı sürece 'arama' sayılmaz.",
    implication:
      "Durdurmanın normal süresi içinde kaldığı sürece, aracın dışında köpekli arama için herhangi bir şüpheye gerek yoktur.",
    source: "https://www.oyez.org/cases/2004/03-923",
  },
  {
    title: "Navarette v. San Andreas (2014)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "İsimsiz bir 911 ihbarı, yeterli 'güvenilirlik emareleri' taşıyorsa trafik durdurması için gereken makul şüpheyi sağlayabilir.",
    implication:
      "İsimsiz ihbarın güvenilirliği, ihbarcının olayı bizzat gördüğünü gösteren ayrıntılar gibi koşulların bütünlüğüne göre değerlendirilir.",
    source: "https://www.oyez.org/cases/2013/12-9490",
  },
  {
    title: "Riley v. San Andreas (2014)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Polis, tutuklanan kişiden el konulan cep telefonundaki dijital verileri aramadan önce kural olarak arama emri almalıdır.",
    implication:
      "Telefonlar barındırdıkları kişisel veri nedeniyle güçlü mahremiyet korumasına sahiptir. Tutuklamaya bağlı emirsiz telefon araması genellikle Dördüncü Ek Madde ihlalidir.",
    source: "https://www.oyez.org/cases/2013/13-132",
  },
  {
    title: "United States v. Harrell (1989)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Hukuka uygun bir trafik durdurması sırasında memurlar, memur güvenliği veya soruşturmanın yürütülmesi bakımından makul bir tedbirse sürücüden aracın anahtarlarını isteyebilir.",
    implication:
      "Anahtarların alınması; sürücünün kaçmasını, aracı beklenmedik şekilde hareket ettirmesini veya içerideki bir silaha ulaşmasını önlemek için makul bir güvenlik tedbiridir.",
    source: "https://casetext.com/case/united-states-v-harrell-10",
  },
  {
    title: "White v. Illinois (1992)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Şaşırtıcı bir olayın etkisi altındayken yapılan anlık beyan (heyecanla söylenen söz), kulaktan dolma delil yasağının istisnasıdır; kişinin uydurmaya vakti olmadığı için güvenilir kabul edilir.",
    implication:
      "Bu tür beyanlar, Miranda hakları okunmamış bir kişiden gelse dahi mahkemede kabul edilir; zira polis sorgusunun ürünü değildir.",
    source: "https://www.oyez.org/cases/1991/90-6113",
  },
  {
    title: "Frazier v. Cupp (1969)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Sorgu sırasında polisin aldatıcı taktikler kullanması, itirafı otomatik olarak gayri iradi veya kabul edilemez kılmaz.",
    implication:
      "Polis, itiraf elde etmek için belirli ölçüde aldatma kullanabilir; ancak aldatma şüphelinin iradesini kıracak düzeydeyse itiraf geçersiz sayılabilir.",
    source: "https://www.oyez.org/cases/1968/646",
  },
  {
    title: "Georgia v. Randolph (2006)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "İki hak sahibi de konutta hazırken biri aramaya rıza gösterip diğeri açıkça reddederse, itiraz üstün gelir ve arama itiraz eden bakımından geçersiz olur.",
    implication:
      "Her iki sakin de kapıdayken biri itiraz ediyorsa, diğerinin rızasına dayanılarak arama yapılamaz; arama emri veya acil hâl gerekir.",
    source: "https://www.oyez.org/cases/2005/04-1067",
  },
  {
    title: "Berghuis v. Thompkins (2010)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Şüpheli, sessiz kalma hakkını açık ve tereddütsüz biçimde kullanmalıdır. Hakları okunduktan sonra yalnızca susmak, bu hakkın kullanıldığı anlamına gelmez.",
    implication:
      "Şüpheli susmak istediğini veya avukat talep ettiğini açıkça belirtmedikçe sorgu sürdürülebilir. Sessizlik sonrası gönüllü beyan delil olarak kullanılabilir.",
    source: "https://www.oyez.org/cases/2009/08-1470",
  },
  {
    title: "Plumhoff v. Rickard (2014)",
    court: "Federal (Hukuk)",
    jurisdiction: "US",
    summary:
      "Halkı tehdit eden tehlikeli, yüksek hızlı bir araç takibini sonlandırmak için öldürücü güç kullanımının Dördüncü Ek Madde bakımından makul olduğuna hükmedilmiştir.",
    implication:
      "Kaçan sürücü ciddi bir kamu güvenliği riski oluşturuyorsa memurlar takibi sonlandırmak için öldürücü güç kullanabilir.",
    source: "https://www.oyez.org/cases/2013/12-1117",
  },
  {
    title: "County of Los Santos v. Mendez (2017)",
    court: "Federal (Hukuk)",
    jurisdiction: "US",
    summary:
      "Mahkeme, memurun önceki bir anayasa ihlalinin çatışmayı tahrik ettiği gerekçesiyle makul güç kullanımını gayrimeşru sayan 'tahrik kuralı'nı reddetmiştir.",
    implication:
      "Güç kullanımı, önceki ihlallerden bağımsız olarak, kullanıldığı andaki makullüğüne göre değerlendirilir.",
    source: "https://www.oyez.org/cases/2016/16-369",
  },
  {
    title: "Florida v. Jimeno (1991)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Kişinin araç aramasına verdiği genel rıza, aranan nesneyi makul olarak barındırabilecek araç içindeki kapları da kapsar.",
    implication:
      "Şüpheli uyuşturucu için araç aramasına rıza verdiyse, rızasını açıkça sınırlamadıkça çantaların açılması için ayrı rıza gerekmez.",
    source: "https://www.oyez.org/cases/1990/90-622",
  },
  {
    title: "Michigan v. Long (1983)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Şüphelinin tehlikeli olduğuna ve silahlara anında erişebileceğine dair makul ve açıklanabilir şüphe varsa, hukuka uygun durdurma sırasında aracın yolcu bölümünde koruyucu silah araması yapılabilir.",
    implication:
      "Bu, araç için bir 'Terry araması'dır. Tutuklama olmasa dahi silah saklanabilecek yolcu bölümü sınırlı olarak aranabilir.",
    source: "https://www.oyez.org/cases/1982/82-256",
  },
  {
    title: "South Dakota v. Opperman (1976)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Polis, hukuka uygun şekilde çekilen bir araçta, mal güvenliğini sağlamak ve kayıp iddialarına karşı korunmak amacıyla emirsiz envanter araması yapabilir.",
    implication:
      "Envanter araması delil arama değil, idari bir işlemdir. Geçerli olması için standart birim prosedürüne uygun olmalı ve soruşturma bahanesi olmamalıdır.",
    source: "https://www.oyez.org/cases/1975/75-76",
  },
  {
    title: "Hiibel v. Sixth Judicial District Court of Nevada (2004)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Bir eyalette 'dur ve kimliğini bildir' düzenlemesi varsa, kişi hukuka uygun bir Terry durdurmasında adını bildirmekle yükümlü tutulabilir.",
    implication:
      "Kimlik vermeyi reddetmek, ilgili düzenlemenin bulunduğu yerlerde engellemeden tutuklamaya yol açabilir; ancak sadece reddetmek her koşulda suç değildir.",
    source: "https://www.oyez.org/cases/2003/03-5554",
  },
  {
    title: "J.D.B. v. North Carolina (2011)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Çocuğun yaşı, Miranda bakımından 'gözaltında' sayılıp sayılmadığının belirlenmesinde dikkate alınması gereken bir unsurdur.",
    implication:
      "Memurlar bir küçüğün yaşını değerlendirmelidir. Yetişkin için gözaltı sayılmayan bir durum, çocuk için gözaltı sayılabilir ve Miranda uyarısı gerektirir.",
    source: "https://www.oyez.org/cases/2010/09-11121",
  },
  {
    title: "Dickerson v. United States (2000)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "Miranda uyarılarının anayasal bir zorunluluk olduğunu ve Kongre tarafından yasayla ortadan kaldırılamayacağını teyit etmiştir.",
    implication:
      "Memurlar Miranda uyarısının yerine başka bir prosedür koyamaz; uyarı gerekliyken yapılmadıysa itirafın 'gönüllü' olması yeterli değildir.",
    source: "https://www.oyez.org/cases/1999/99-5525",
  },
  {
    title: "Garrity v. New Jersey (1967)",
    court: "Federal",
    jurisdiction: "US",
    summary:
      "İşten çıkarılma tehdidi altında zorla alınan memur beyanlarının, o memur aleyhine ceza yargılamasında kullanılamayacağına hükmetmiştir.",
    implication: "İdari soruşturmada zorunlu olarak verilen ifadeler ceza davasında delil olarak kullanılamaz.",
    source: "https://www.oyez.org/cases/1966/13",
  },
  {
    title: "People v. Wyse (2020)",
    court: "SA Yüksek Mahkemesi",
    jurisdiction: "SA",
    summary:
      "Bir kişinin bir suç için para cezasını ödemesi, yalnızca San Andreas Ceza Kanunu'nda açıkça belirtilmişse hukuken suç ikrarı sayılır.",
    implication:
      "Ceza ödemek yalnızca mali bir işlem değildir; kanunda öngörüldüğü hâllerde dosyayı ikrarla kapatır ve ileride sonuç doğurabilir.",
    source: "https://forum.gta.world/en/topic/21651-sc-001-20-rick-wyse-v-the-los-santos-police-department/",
  },
  {
    title: "People v. Ruelas (2023)",
    court: "SA Yüksek Mahkemesi",
    jurisdiction: "SA",
    summary:
      "Yaklaşan kolluk görevlilerinden sebepsiz kaçışın, tek başına o kişiyi durdurmak için gereken makul şüpheyi doğurmaya yeterli olduğuna hükmedilmiştir.",
    implication:
      "Bir kişi memuru görünce kaçıyorsa, bu kaçış hukuka uygun bir gözaltı (Terry durdurması) için gerekçe oluşturur.",
    source: "https://forum.gta.world/en/topic/86337-sc-006-22-dominic-ruelas-v-superior-court-of-san-andreas/",
  },
  {
    title: "People v. Champagne (2023)",
    court: "SA Yüksek Mahkemesi",
    jurisdiction: "SA",
    summary:
      "Yeni bir olay yerinden hızla uzaklaşan aracın durdurulması için makul şüphe oluştuğunu; bu durdurmada köpekli aramanın mümkün olduğunu ve memurun gözlemle tespit ettiği hız ihlalinin radar gibi objektif kanıt olmadan da durdurma için yeterli olduğunu belirtmiştir.",
    implication:
      "Olay yerinden kaçış durdurmayı ve K9 kullanımını meşru kılar; deneyimli memurun gözlemi teknolojik doğrulama olmadan da işlem için yeterlidir.",
    source: "https://forum.gta.world/en/topic/104516-23scwc00002-people-of-the-state-of-san-andreas-v-rylee-champagne/",
  },
  {
    title: "People v. Pliego (2023)",
    court: "SA Yüksek Mahkemesi",
    jurisdiction: "SA",
    summary:
      "Gizli muhbirin kimliğinin mahkemede korunmasına ilişkin usulleri belirler; karartma ve kapalı inceleme gibi tedbirleri zorunlu kılar ve sanığın kimliğin savunma için gerekliliğini önce göstermesini arar.",
    implication:
      "Muhbir kimliği, sanık zorunluluğu ikna edici şekilde ortaya koymadıkça açıklanmaz; mahkeme bu bilgiyi aktif olarak korur.",
    source:
      "https://forum.gta.world/en/topic/107638-interlocutory-criminal-appeal-23scwc00005-people-of-the-state-of-san-andreas-v-ruben-pliego/",
  },
  {
    title: "People v. Lira (2023)",
    court: "SA Yüksek Mahkemesi",
    jurisdiction: "SA",
    summary:
      "Bir maddenin bulundurulması suç olmaktan çıkarılmış olsa dahi, o maddeyle ilgili başka suçlar (etki altında araç kullanma, satma amaçlı bulundurma) mevcutsa, koku temelli araç araması hukuka uygundur.",
    implication:
      "Esrar gibi bir maddenin kokusu, basit bulundurmanın ötesinde bir suça işaret edebileceğinden hâlâ arama için kuvvetli şüphe sağlayabilir.",
    source: "https://forum.gta.world/en/topic/109048-23scwc00006-ruben-lira-v-san-andreas-second-court-of-appeal/",
  },
  {
    title: "People v. Russo (2024)",
    court: "SA Yüksek Mahkemesi",
    jurisdiction: "SA",
    summary:
      "Protesto veya kayıt alma gibi anayasal korumaya sahip bir faaliyette bulunmanın, davranış suç seviyesine ulaştığında kişiye tutuklamaya karşı dokunulmazlık sağlamadığına hükmedilmiştir.",
    implication:
      "İfade özgürlüğü, engelleme veya saldırı gibi ayrı bir suç oluşturan eylemler bakımından tutuklamaya engel değildir.",
    source: "https://forum.gta.world/en/topic/133142-24scwc00012-people-of-the-state-of-san-andreas-v-michael-russo/",
  },
  {
    title: "People v. Valdez (2020)",
    court: "SA İstinaf Mahkemesi",
    jurisdiction: "SA",
    summary:
      "Sanığın sorgusunun idari (zorunlu) mı yoksa cezai (gönüllü) mi olduğunun belirsiz kalmasının adil yargılanma hakkını ihlal ettiğine hükmedilmiştir.",
    implication:
      "Memurlar sorgunun niteliğini açıkça belirtmelidir. Kişi cevaplamaya zorlandığını makul şekilde düşünüyorsa beyanları ceza davasında kullanılamayabilir.",
    source: "https://forum.gta.world/en/topic/23011-cfa-003-20-teresa-valdez-v-state-of-san-andreas/",
  },
  {
    title: "People v. Ulloa (2020)",
    court: "SA İstinaf Mahkemesi",
    jurisdiction: "SA",
    summary:
      "Ruhsat durumundan bağımsız olarak herkesin özel mülkte kayıtlı silah taşımasını veya geçici olarak elinde bulundurmasını yasakladığı için ilgili silah düzenlemesi (SHAFT) anayasaya aykırı bulunmuştur.",
    implication:
      "Ruhsatlı kişiler için istisna içermeyen, özel mülkte topyekûn silah yasağı getiren düzenlemelerin anayasaya aykırı sayılması muhtemeldir.",
    source: "https://forum.gta.world/en/topic/28899-cfa-005-20-ivan-ulloa-v-state-of-san-andreas/",
  },
  {
    title: "People v. Perez (2021)",
    court: "SA İstinaf Mahkemesi",
    jurisdiction: "SA",
    summary:
      "SanGANG kaydındaki tek bir memur beyanının çete bağlantısını kanıtlamaya yetmediğini; ayrıca sanığın takip eden memurlardan ölümcül tehlike gördüğüne dair makul inancının kaçma suçuna karşı geçerli bir savunma olabileceğini kabul etmiştir.",
    implication:
      "Çete bağlantısı için veri tabanındaki memur beyanından fazlası gerekir. Şüphelinin takip sırasındaki ruh hâli mahkemede belirleyici olabilir.",
    source: "https://forum.gta.world/en/topic/53196-cfa-14-21-daniel-perez-v-state-of-san-andreas/",
  },
  {
    title: "People v. Biagini (2021)",
    court: "SA İstinaf Mahkemesi",
    jurisdiction: "SA",
    summary:
      "Kamu güvenliğini pervasızca hiçe sayarak araç kullanan ve başkaları için ölüm ya da ağır yaralanma tehdidi oluşturan sürücüye karşı öldürücü güç kullanımını makul bulmuştur.",
    implication:
      "Aracın silah gibi kullanıldığı ve hayati tehlike oluşturduğu makul şekilde değerlendiriliyorsa öldürücü güç meşrudur.",
    source: "https://forum.gta.world/en/topic/60879-cfa-021-21-vincenzo-biagini-v-state-of-san-andreas/",
  },
  {
    title: "People v. Orozco (2021)",
    court: "SA İstinaf Mahkemesi",
    jurisdiction: "SA",
    summary:
      "Rutin bir trafik durdurması sırasında yapılan suçlayıcı beyanların, Miranda uyarısı yapılmamış olsa dahi delil olarak kabul edileceğine hükmedilmiştir.",
    implication:
      "Miranda yalnızca gözaltı sorgusunda gereklidir. Rutin trafik durdurmaları genelde gözaltı sayılmaz; gönüllü beyanlar kullanılabilir.",
    source: "https://forum.gta.world/en/topic/74592-cfa-033-22-state-of-san-andreas-v-joaquin-orozco-interlocutory/",
  },
  {
    title: "People v. Popovic (2021)",
    court: "SA İstinaf Mahkemesi",
    jurisdiction: "SA",
    summary:
      "Ceza Kanunu § 1107 kapsamında 48 saatlik soruşturma amaçlı tutma için kolluğun en azından makul şüphe eşiğini karşılaması gerektiğini belirlemiştir.",
    implication:
      "Sebep olmadan soruşturma amaçlı tutma yapılamaz; 48 saatlik tutmayı haklı kılan açıklanabilir olgular bulunmalıdır.",
    source:
      "https://forum.gta.world/en/topic/90690-interlocutory-criminal-appeal-the-district-attorneys-office-of-los-santos-county-v-los-santos-county-superior-court/",
  },
  {
    title: "People v. Voss (2023)",
    court: "SA İstinaf Mahkemesi",
    jurisdiction: "SA",
    summary:
      "Hukuka uygun bir tutuklama sırasında makul güç kullanımının istenmeyen sonucu olarak ölüm meydana gelirse, bunun hukuka aykırı öldürme suçuna esas olamayacağına hükmedilmiştir.",
    implication:
      "Tutuklama sırasında meşru ve makul güç kullanımının kastı aşan sonucu olarak şüpheli ölürse memur cezai sorumluluk taşımaz.",
    source: "https://forum.gta.world/en/topic/103284-23gjap00005-nathan-voss-v-people-of-the-state-of-san-andreas/",
  },
  {
    title: "People v. Buckshaw (2023)",
    court: "SA İstinaf Mahkemesi",
    jurisdiction: "SA",
    summary:
      "Limanlardaki 'başıboş dolaşma yasağı' düzenlemelerinin, liman geleneksel bir kamusal forum olmadığından ve kurallar tarafsız uygulandığından, ifade özgürlüğüne getirilen uygulanabilir zaman-yer-biçim sınırlaması olduğunu teyit etmiştir.",
    implication:
      "Liman gibi kamusal forum sayılmayan alanlarda, içerik bakımından tarafsız ve güvenlik gibi önemli bir amaca hizmet eden daha sıkı kurallar uygulanabilir.",
    source: "https://forum.gta.world/en/topic/109871-23gjap00017-luke-buckshaw-v-people-no-2/",
  },
  {
    title: "Foster v. Murray (2024)",
    court: "SA İstinaf Mahkemesi (Hukuk)",
    jurisdiction: "SA",
    summary:
      "Trafik durdurmasının, küçük donanım ihlallerine dayanan bahaneli durdurmalarda dahi yalnızca makul şüphe gerektirdiğini açıklığa kavuşturmuştur. Durdurma, kişinin ayrılmakta serbest olmadığı geçici bir yakalama biçimidir; memurun olay yerindeki zayıf açıklaması hukuken haklı bir durdurmayı geçersiz kılmaz.",
    implication:
      "Hukuki bir gerekçe (örneğin cam filmi) bulunduğu sürece durdurma hukuka uygundur. Hukuka uygun hareket eden memurlar doğan zararlardan genellikle sorumlu tutulmaz.",
    source: "https://forum.gta.world/en/topic/114908-23gjap00015-anne-foster-v-shawn-murray/",
  },
];
