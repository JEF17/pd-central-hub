// AUTO-GENERATED from penal code + kefalet cetveli. Do not edit by hand.
export type ChargeClass = "A" | "B" | "C";
export type ChargeType = "F" | "M" | "I";

/** Bir maddenin uygulanabilir ceza seviyesi (madde bendi / sınıf / değer eşiği). */
export interface ChargeLevel {
  key: string;
  label: string;
  /** "Madde (a)" ya da "Toplam değer $10,000 aşıyorsa" gibi koşul; yoksa boş. */
  condition: string;
  cls: ChargeClass;
  type: ChargeType;
  points: number;
  minMinutes: number;
  maxMinutes: number;
  fine: number;
}

/** Suç sayısına göre değişen ceza kademesi (1., 2., 3. suç). */
export interface OffenseTier {
  n: number;
  fine: number;
  minMinutes: number;
  maxMinutes: number;
  note: string;
}

export interface BailInfo {
  amount: number;
  auto: boolean;
  optional: boolean;
}

export interface ChargeCategory {
  /** Kontrollü madde kategorisi (A, B, C, D, T) */
  key: string;
  fine: number;
  maxMinutes: number;
  note: string;
}

export interface ChargeDefinition {
  number: string;
  title: string;
  classification: string;
  levels: ChargeLevel[];
  tiers: OffenseTier[];
  categories?: ChargeCategory[];
  bail: BailInfo;
}

export const chargeCatalog: ChargeDefinition[] = [
  {
    "number": "001",
    "title": "İhanet",
    "classification": "A, B veya C Sınıfı felony kapsamında sorumlu tutulacaktır ve cezası mahkemenin takdirine göre belirlenecektir.",
    "levels": [
      {
        "key": "l1",
        "label": "A, B veya · C Sınıfı felony",
        "condition": "A, B veya",
        "cls": "C",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "002",
    "title": "Casusluk",
    "classification": "A, B veya C Sınıfı felony kapsamında sorumlu tutulacaktır ve cezası mahkemenin takdirine göre belirlenecektir.",
    "levels": [
      {
        "key": "l1",
        "label": "A, B veya · C Sınıfı felony",
        "condition": "A, B veya",
        "cls": "C",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "003",
    "title": "İç Terörizm",
    "classification": "A, B veya C Sınıfı felony kapsamında sorumlu tutulacaktır ve cezası mahkemenin takdirine göre belirlenecektir.",
    "levels": [
      {
        "key": "l1",
        "label": "A, B veya · C Sınıfı felony",
        "condition": "A, B veya",
        "cls": "C",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "004",
    "title": "İç Terörizm Tehdidi",
    "classification": "A, B veya C Sınıfı felony kapsamında sorumlu tutulacaktır ve cezası mahkemenin takdirine göre belirlenecektir.",
    "levels": [
      {
        "key": "l1",
        "label": "A, B veya · C Sınıfı felony",
        "condition": "A, B veya",
        "cls": "C",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "101",
    "title": "Vergi Kaçakçılığı",
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $5,000 para cezası\n2. $10,000 para cezası\n3. $15,000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (2) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5,000 para cezası"
      },
      {
        "n": 2,
        "fine": 10000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$10,000 para cezası"
      },
      {
        "n": 3,
        "fine": 15000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$15,000 para cezası"
      }
    ],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "102",
    "title": "Seçimde Sahtekarlık",
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (2) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 60000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "103",
    "title": "Kamu Görevinde Yolsuzluk",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 7 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 5760,
        "maxMinutes": 10080,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "104",
    "title": "Kamu Görevini İhmal",
    "classification": "B Sınıfı (3) veya C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 6 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "B Sınıfı (3) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 4320,
        "maxMinutes": 8640,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "C Sınıfı (2) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 4320,
        "maxMinutes": 8640,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "105",
    "title": "Kamu Görevlisine Rüşvet",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 5 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 4320,
        "maxMinutes": 7200,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 300000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "106",
    "title": "İsyana Teşvik",
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 2 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (2) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 360,
        "maxMinutes": 2880,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "107",
    "title": "Yasa Dışı Toplanma",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 1 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 1440,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 50000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "108",
    "title": "Delillerle Oynama",
    "classification": "C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 saatten az 4 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (5) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 5,
        "minMinutes": 240,
        "maxMinutes": 5760,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 150000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "109",
    "title": "Tanık veya Mağdura Tehdit",
    "classification": "B Sınıfı (5) veya C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 7 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "B Sınıfı (5) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 5,
        "minMinutes": 2880,
        "maxMinutes": 10080,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "C Sınıfı (3) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 2880,
        "maxMinutes": 10080,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "110",
    "title": "Mahkemeye Saygısızlık",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden fazla olmayacaktır ve/ya da para cezası  $20.000'dan fazla olmayacaktır. Duruma göre sadece hapis ya da para cezası veya her ikisi de ilgili kişiye karşı uygulanabilir.\n(( Bu suç sadece kefalet ihlallerinin olması durumunda zorunlu olarak mahkemeye gidecektir. ))",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 5760,
        "fine": 20000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "111",
    "title": "Yalancı Şahitlik",
    "classification": "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 5 saatten az 3 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (3) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 300,
        "maxMinutes": 4320,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 80000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "112",
    "title": "Kamu Görevini Engellemek",
    "classification": "Madde (a) ihlalinde A Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.\nMadde (b) ihlalinde B Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 2 günden fazla olmayacaktır.\nMadde (c) ihlalinde C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 12 saatten fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Madde (a) · A Sınıfı (4) felony",
        "condition": "Madde (a)",
        "cls": "A",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Madde (b) · B Sınıfı (3) felony",
        "condition": "Madde (b)",
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 1440,
        "maxMinutes": 2880,
        "fine": 0
      },
      {
        "key": "l3",
        "label": "Madde (c) · C Sınıfı misdemeanor",
        "condition": "Madde (c)",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 720,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "113",
    "title": "Kolluk Kuvvetlerinde Görevli Hayvanı Engellemek",
    "classification": "Madde (a) ihlalinde B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 12 saatten az 2 günden fazla olmayacaktır.\n Madde (b) ihlalinde B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.\nMadde (c) ihlalinde A Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 8 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Madde (a) · B Sınıfı misdemeanor",
        "condition": "Madde (a)",
        "cls": "B",
        "type": "M",
        "points": 0,
        "minMinutes": 720,
        "maxMinutes": 2880,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Madde (b) · B Sınıfı misdemeanor",
        "condition": "Madde (b)",
        "cls": "B",
        "type": "M",
        "points": 0,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0
      },
      {
        "key": "l3",
        "label": "Madde (c) · A Sınıfı (3) felony",
        "condition": "Madde (c)",
        "cls": "A",
        "type": "F",
        "points": 3,
        "minMinutes": 4320,
        "maxMinutes": 11520,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "114",
    "title": "Yasal Gözaltından Kaçmak",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 7 günden az 9 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 10080,
        "maxMinutes": 12960,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "115",
    "title": "Kolluk Kuvvetlerinden Kaçmak",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 5 günden fazla olmayacaktır. Ayrıca sürücü lisansına 7 günlüğüne el koyulacaktır. Aracın çekilmesine ve para cezasına ilişkin cezalar ise aşağıdaki gibidir:\n1. 7 günlüğüne araca el koyulacaktır ve $5.000 para cezası\n2. 14 günlüğüne araca el koyulacaktır ve $10.000 para cezası\n3. 14 günlüğüne araca el koyulacaktır ve $20.000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.\n\nNot: Bu suç kişiye karşıdır ve araca karşı değildir. Bu nedenle kovalama farklı bir araçta başladıysa ve kaçan kişi farklı bir araca geçerse son kullandığı araç çekilebilir. Eğer araç başka birisine aitse ve çalındığını kanıtlayabilirse aracı teslim alabilir. Eğer aracın plaka kaydı yoksa araç parçalatılacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 1440,
        "maxMinutes": 7200,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "7 günlüğüne araca el koyulacaktır ve $5.000 para cezası"
      },
      {
        "n": 2,
        "fine": 10000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "14 günlüğüne araca el koyulacaktır ve $10.000 para cezası"
      },
      {
        "n": 3,
        "fine": 20000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "14 günlüğüne araca el koyulacaktır ve $20.000 para cezası"
      }
    ],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "116",
    "title": "Tutuklamaya Direnmek",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 50000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "117",
    "title": "Hükümet Görevlilerine Yalan Söylemek",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 8 saatten az 4 günden fazla olmayacaktır, para cezası ise $10.000 olacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 480,
        "maxMinutes": 5760,
        "fine": 10000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 150000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "118",
    "title": "Acil Yardım Hatlarının Kötüye Kullanımı",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır, para cezası ise $5.000 olacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 5000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 90000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "119",
    "title": "Kimlik Hırsızlığı",
    "classification": "Madde (a) ihlalinde C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 4 saatten az 1 günden fazla olmayacaktır.\nMadde (b) ihlalinde C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 4 günden fazla olmayacaktır, para cezası ise $10.000 olacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Madde (a) · C Sınıfı misdemeanor",
        "condition": "Madde (a)",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 240,
        "maxMinutes": 1440,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Madde (b) · C Sınıfı misdemeanor",
        "condition": "Madde (b)",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 1440,
        "maxMinutes": 5760,
        "fine": 10000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 150000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "120",
    "title": "Bir Kamu Çalışanına Saldırı Tehdidi veya Darp",
    "classification": "A Sınıfı (5) veya B Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 6 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (5) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 5,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "B Sınıfı (4) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "121",
    "title": "Sahtecilik",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 3 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 4320,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 350000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "122",
    "title": "Dolandırıcılık",
    "classification": "Madde (a) ihlalinde C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 2 günden fazla olmayacaktır.\nMadde (b) veya (c) ihlalinde C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Madde (a) · C Sınıfı misdemeanor",
        "condition": "Madde (a)",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 2880,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Madde (b) veya (c) · C Sınıfı (2) felony",
        "condition": "Madde (b) veya (c)",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "123",
    "title": "Para Aklamak",
    "classification": "Toplam değer $10,000 aşmıyorsa C Sınıfı (2) felony. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.\nToplam değer $10,000 aşıyorsa C Sınıfı (3) felony. Hapis cezası 3 günden az 5 günden fazla olmayacaktır.\nToplam değer $100,000 aşıyorsa C Sınıfı (4) felony. Hapis cezası 3 günden az 6 günden fazla olmayacaktır.\nToplam değer $500,000 aşıyorsa C Sınıfı (5) felony. Hapis cezası 5 günden az 8 günden fazla olmayacaktır.\nToplam değer $1,000,000 aşıyorsa C Sınıfı (6) felony. Hapis cezası 6 günden az 9 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Toplam değer $10,000 aşmıyorsa · C Sınıfı (2) felony",
        "condition": "Toplam değer $10,000 aşmıyorsa",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Toplam değer $10,000 aşıyorsa · C Sınıfı (3) felony",
        "condition": "Toplam değer $10,000 aşıyorsa",
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 4320,
        "maxMinutes": 7200,
        "fine": 0
      },
      {
        "key": "l3",
        "label": "Toplam değer $100,000 aşıyorsa · C Sınıfı (4) felony",
        "condition": "Toplam değer $100,000 aşıyorsa",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 4320,
        "maxMinutes": 8640,
        "fine": 0
      },
      {
        "key": "l4",
        "label": "Toplam değer $500,000 aşıyorsa · C Sınıfı (5) felony",
        "condition": "Toplam değer $500,000 aşıyorsa",
        "cls": "C",
        "type": "F",
        "points": 5,
        "minMinutes": 7200,
        "maxMinutes": 11520,
        "fine": 0
      },
      {
        "key": "l5",
        "label": "Toplam değer $1,000,000 aşıyorsa · C Sınıfı (6) felony",
        "condition": "Toplam değer $1,000,000 aşıyorsa",
        "cls": "C",
        "type": "F",
        "points": 6,
        "minMinutes": 8640,
        "maxMinutes": 12960,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "124",
    "title": "ABD Para Birimine Zarar Vermek",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 2 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 1440,
        "maxMinutes": 2880,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 350000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "125",
    "title": "Huzuru Bozmak",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır, para cezası ise $2.500 olacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 2500
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "126",
    "title": "Haraç Kesmek",
    "classification": "A Sınıfı (6), B Sınıfı (5) veya C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (6) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 6,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "B Sınıfı (5) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 5,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0
      },
      {
        "key": "l3",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "127",
    "title": "EFCE Yasasının İhlali - Sinyal Bozucu",
    "classification": "Madde (a) ihlalinde C Sınıfı (6) felony. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.\nMadde (b) ihlalinde C Sınıfı (4) felony. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.\nMadde (c) ihlalinde C Sınıfı (4) felony. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Madde (a) · C Sınıfı (6) felony",
        "condition": "Madde (a)",
        "cls": "C",
        "type": "F",
        "points": 6,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Madde (b) · C Sınıfı (4) felony",
        "condition": "Madde (b)",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0
      },
      {
        "key": "l3",
        "label": "Madde (c) · C Sınıfı (4) felony",
        "condition": "Madde (c)",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 75000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "128",
    "title": "EFCE Yasasının İhlali - Kart Kopyalama",
    "classification": "Madde (a) ihlalinde C Sınıfı (6) felony. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.\nMadde (b) ihlalinde C Sınıfı (4) felony. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.\nMadde (c) ihlalinde C Sınıfı (4) felony. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Madde (a) · C Sınıfı (6) felony",
        "condition": "Madde (a)",
        "cls": "C",
        "type": "F",
        "points": 6,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Madde (b) · C Sınıfı (4) felony",
        "condition": "Madde (b)",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0
      },
      {
        "key": "l3",
        "label": "Madde (c) · C Sınıfı (4) felony",
        "condition": "Madde (c)",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 75000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "129",
    "title": "EFCE Yasasının İhlali - Araç Takibi",
    "classification": "C Sınıfı (6) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (6) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 6,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 75000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "130",
    "title": "Bir Mahkumu Kaçırmak",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 7 günden az 9 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 10080,
        "maxMinutes": 12960,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "131",
    "title": "Hapishane İçerisinde Uyuşturucu Madde Bulundurmak",
    "classification": "C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Ceza yönergeleri:\nA — $45.000'a kadar para cezası ve 7 günden fazla olmamak üzere hapis cezası.\nB — $37.500'a kadar para cezası ve 6 günden fazla olmamak üzere hapis cezası.\nC — $30.000'a kadar para cezası ve 5 günden fazla olmamak üzere hapis cezası.\nD — $22.500'a kadar para cezası ve 4 günden fazla olmamak üzere hapis cezası.\nT — $8.000'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (5) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 5,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    },
    "categories": [
      {
        "key": "A",
        "fine": 45000,
        "maxMinutes": 10080,
        "note": "$45.000'a kadar para cezası ve 7 günden fazla olmamak üzere hapis cezası."
      },
      {
        "key": "B",
        "fine": 37500,
        "maxMinutes": 8640,
        "note": "$37.500'a kadar para cezası ve 6 günden fazla olmamak üzere hapis cezası."
      },
      {
        "key": "C",
        "fine": 30000,
        "maxMinutes": 7200,
        "note": "$30.000'a kadar para cezası ve 5 günden fazla olmamak üzere hapis cezası."
      },
      {
        "key": "D",
        "fine": 22500,
        "maxMinutes": 5760,
        "note": "$22.500'a kadar para cezası ve 4 günden fazla olmamak üzere hapis cezası."
      },
      {
        "key": "T",
        "fine": 8000,
        "maxMinutes": 1440,
        "note": "$8.000'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası."
      }
    ]
  },
  {
    "number": "132",
    "title": "Hapishane İçerisinde İletişim Aleti Bulundurmak",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır ve en fazla bin dolar ($1.000) para cezası ile cezalandırılacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "133",
    "title": "Hapishane İçerisinde Tütün Bulundurmak",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. Bin dolardan ($1.000) fazla olmamak kaydıyla para cezası ile cezalandırılacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "134",
    "title": "Hapishane İçerisinde Yetkisiz Anahtar Bulundurmak",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır, para cezası ise $2.500 olacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 2500
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "135",
    "title": "Barış Görevlisi Köpeğini Öldürmek",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 5 günden az 6 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 7200,
        "maxMinutes": 8640,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "136",
    "title": "Barış Görevlisi Köpeğini Ağır Yaralamak",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 3 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 4320,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "137",
    "title": "Barış Görevlisi Köpeğine Saldırmak",
    "classification": "B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır, para cezası ise $2.500 olacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "B Sınıfı misdemeanor",
        "condition": "",
        "cls": "B",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 2500
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "138",
    "title": "Barış Görevlisi Köpeğini Engelleme",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 50 dakikadan az 6 saatten fazla olmayacaktır, para cezası ise $2.500 olacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 50,
        "maxMinutes": 360,
        "fine": 2500
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 75000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "139",
    "title": "Mobil Veri Bilgisayarının Kötüye Kullanımı",
    "classification": "C Sınıfı (2) ve B Sınıfı (3) olarak felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 6 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (2) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 4320,
        "maxMinutes": 8640,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "B Sınıfı (3) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 4320,
        "maxMinutes": 8640,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "140",
    "title": "Mobil Veri Bilgisayarından Yetkisiz Bilgi Paylaşımı",
    "classification": "C Sınıfı (3) ve B Sınıfı (2) olarak felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (3) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "B Sınıfı (2) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 2,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "141",
    "title": "Mahkumla Yasa Dışı İletişim Kurmak",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 18 saatten az 3 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 1080,
        "maxMinutes": 4320,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "142",
    "title": "Mahkemeye Katılmamak",
    "classification": "Misdemeanor ile suçlanmış ya da hüküm giymişse C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden fazla olmayacaktır.\nFelony ile suçlanmış ya da hüküm giymişse C Sınıfı felony kapsamında sorumlu tutulacaktır. Hapis cezası 6 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Misdemeanor ile suçlanmış ya da hüküm giymişse · C Sınıfı misdemeanor",
        "condition": "Misdemeanor ile suçlanmış ya da hüküm giymişse",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 2880,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Felony ile suçlanmış ya da hüküm giymişse · C Sınıfı felony",
        "condition": "Felony ile suçlanmış ya da hüküm giymişse",
        "cls": "C",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 8640,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "201",
    "title": "Cinayet",
    "classification": "A Sınıfı (18) felony kapsamında sorumlu tutulacaktır. Hapis cezası 20 günden az olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (18) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 18,
        "minMinutes": 28800,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "202",
    "title": "Birinci Derece Cinayet",
    "classification": "A Sınıfı (15) felony kapsamında sorumlu tutulacaktır. Hapis cezası 18 günden az olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (15) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 15,
        "minMinutes": 25920,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "203",
    "title": "İkinci Derece Cinayet",
    "classification": "A Sınıfı (10) felony kapsamında sorumlu tutulacaktır. Hapis cezası 15 günden az olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (10) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 10,
        "minMinutes": 21600,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "204",
    "title": "Kasten Adam Öldürme",
    "classification": "A Sınıfı (7) felony kapsamında sorumlu tutulacaktır. Hapis cezası 5 günden az 10 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (7) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 7,
        "minMinutes": 7200,
        "maxMinutes": 14400,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "205",
    "title": "Kasıtsız Adam Öldürme",
    "classification": "A Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 8 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (5) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 5,
        "minMinutes": 4320,
        "maxMinutes": 11520,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "206",
    "title": "Saldırı",
    "classification": "B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 2 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "B Sınıfı misdemeanor",
        "condition": "",
        "cls": "B",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 2880,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "207",
    "title": "Ölümcül Silahla Saldırı",
    "classification": "Madde (a) ihlalinde B Sınıfı (3) felony. Hapis cezası 3 günden az 5 günden fazla olmayacaktır.\nMadde (b) ihlalinde B Sınıfı (4) felony. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Madde (a) · B Sınıfı (3) felony",
        "condition": "Madde (a)",
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 4320,
        "maxMinutes": 7200,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Madde (b) · B Sınıfı (4) felony",
        "condition": "Madde (b)",
        "cls": "B",
        "type": "F",
        "points": 4,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "208",
    "title": "Darp",
    "classification": "B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 7 saatten az 3 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "B Sınıfı misdemeanor",
        "condition": "",
        "cls": "B",
        "type": "M",
        "points": 0,
        "minMinutes": 420,
        "maxMinutes": 4320,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 150000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "209",
    "title": "Ağırlaştırılmış Darp",
    "classification": "Madde (a) ihlalinde B Sınıfı (6) felony. Hapis cezası 4 günden az 6 günden fazla olmayacaktır.\nMadde (b) ihlalinde B Sınıfı (8) felony. Hapis cezası 5 günden az 9 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Madde (a) · B Sınıfı (6) felony",
        "condition": "Madde (a)",
        "cls": "B",
        "type": "F",
        "points": 6,
        "minMinutes": 5760,
        "maxMinutes": 8640,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Madde (b) · B Sınıfı (8) felony",
        "condition": "Madde (b)",
        "cls": "B",
        "type": "F",
        "points": 8,
        "minMinutes": 7200,
        "maxMinutes": 12960,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "210",
    "title": "Kaçırma",
    "classification": "B Sınıfı (7) felony kapsamında sorumlu tutulacaktır. Hapis cezası 5 günden az olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "B Sınıfı (7) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 7,
        "minMinutes": 7200,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "211",
    "title": "İnsan Kaçakçılığı",
    "classification": "A Sınıfı (9) felony kapsamında sorumlu tutulacaktır. Hapis cezası 6 günden az olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (9) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 9,
        "minMinutes": 8640,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "212",
    "title": "Yasa Dışı Hapis",
    "classification": "B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "B Sınıfı misdemeanor",
        "condition": "",
        "cls": "B",
        "type": "M",
        "points": 0,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "213",
    "title": "İşkence",
    "classification": "A Sınıfı (10) felony kapsamında sorumlu tutulacaktır. Hapis cezası 6 günden az olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (10) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 10,
        "minMinutes": 8640,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "214",
    "title": "Tehdit Suçu",
    "classification": "B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 1 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "B Sınıfı misdemeanor",
        "condition": "",
        "cls": "B",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 1440,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "215",
    "title": "Soygun",
    "classification": "B Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "B Sınıfı (4) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "216",
    "title": "Silahlı Soygun",
    "classification": "B Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "B Sınıfı (5) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 5,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "217",
    "title": "Tecavüz",
    "classification": "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (3) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "218",
    "title": "Çocuk Bireyle İlişkiye Girme",
    "classification": "A Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (5) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 5,
        "minMinutes": 5760,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "219",
    "title": "Cinsel Saldırı",
    "classification": "B Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 8 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "B Sınıfı (4) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 4,
        "minMinutes": 4320,
        "maxMinutes": 11520,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "220",
    "title": "Taciz",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 2 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 2880,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 50000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "221",
    "title": "Aile İçi Şiddet",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 2 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 2880,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 120000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "222",
    "title": "Yakıcı Kimyasal Maddelerle Saldırı",
    "classification": "B Sınıfı (6) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "B Sınıfı (6) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 6,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 325000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "301",
    "title": "Kundakçılık",
    "classification": "A Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 7 günden az olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (5) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 5,
        "minMinutes": 10080,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "302",
    "title": "Hırsızlık",
    "classification": "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (3) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 400000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "303",
    "title": "Haneye Tecavüz",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 450000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "304",
    "title": "Büyük Çaplı Hırsızlık",
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 saatten az 2 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (2) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 240,
        "maxMinutes": 2880,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "305",
    "title": "Küçük Çaplı Hırsızlık",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 saatten az 1 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 120,
        "maxMinutes": 1440,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 25000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "306",
    "title": "Araç Hırsızlığı",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 6 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 300000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "307",
    "title": "Ateşli Silah Hırsızlığı",
    "classification": "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (3) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 400000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "308",
    "title": "Hırsızlık Aletlerinin Bulundurulması",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 50000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "309",
    "title": "Çalınan Mal Varlığının Alınması",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 2 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 2880,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "310",
    "title": "İzinsiz Giriş",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 2 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 2880,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "311",
    "title": "Vandalizm",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 2 günden fazla olmayacaktır, para cezası ise $2,500 olacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 2880,
        "fine": 2500
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "312",
    "title": "Zimmetine Geçirme",
    "classification": "Toplam değer $30.000'ı aşmıyorsa C Sınıfı misdemeanor. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.\nToplam değer $30.000'ı aşıyorsa C Sınıfı (2) felony. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Toplam değer $30.000'ı aşmıyorsa · C Sınıfı misdemeanor",
        "condition": "Toplam değer $30.000'ı aşmıyorsa",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Toplam değer $30.000'ı aşıyorsa · C Sınıfı (2) felony",
        "condition": "Toplam değer $30.000'ı aşıyorsa",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "313",
    "title": "Taşıt Tescil Hırsızlığı",
    "classification": "Madde (a) ihlalinde C Sınıfı misdemeanor. Hapis cezası 3 saatten az 1 günden fazla olmayacaktır.\nMadde (b) ihlalinde C Sınıfı misdemeanor. Hapis cezası 12 saatten az 2 günden fazla olmayacaktır.\nMadde (c) ihlalinde C Sınıfı (3) felony. Hapis cezası 1 günden az 3 günden fazla olmayacaktır. Kaçış motorlu bir taşıt veya bisiklet ile yapıldığı takdirde 115. madde ek suçlama olarak eklenir.",
    "levels": [
      {
        "key": "l1",
        "label": "Madde (a) · C Sınıfı misdemeanor",
        "condition": "Madde (a)",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 1440,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Madde (b) · C Sınıfı misdemeanor",
        "condition": "Madde (b)",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 720,
        "maxMinutes": 2880,
        "fine": 0
      },
      {
        "key": "l3",
        "label": "Madde (c) · C Sınıfı (3) felony",
        "condition": "Madde (c)",
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 550000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "314",
    "title": "Hapishane Mülküne Zarar Verme",
    "classification": "Hasarın toplam maliyeti $950'ı aşmıyorsa C Sınıfı misdemeanor. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.\nHasarın toplam maliyeti $950'ı aşıyorsa C Sınıfı (2) felony. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Hasarın toplam maliyeti $950'ı aşmıyorsa · C Sınıfı misdemeanor",
        "condition": "Hasarın toplam maliyeti $950'ı aşmıyorsa",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Hasarın toplam maliyeti $950'ı aşıyorsa · C Sınıfı (2) felony",
        "condition": "Hasarın toplam maliyeti $950'ı aşıyorsa",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "401",
    "title": "Geçerli Bir Sürücü Lisansı Olmadan Araç Kullanma",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 30 dakikadan az 1 günden fazla olmayacaktır. Para cezası ise $2.500 olacaktır ve araç 1 günlüğüne bağlanacaktır.\n\nNot: Havalimanı araç kiralama acentesinden kiralanan araçlar sürücü lisansı gerekliliklerinden muaftır. Lisansı askıya alınmış veya el koyulmuş kişiler bu muafiyetten yararlanamaz.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 30,
        "maxMinutes": 1440,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 60000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "402",
    "title": "Askıya Alınmış Bir Sürücü Lisansıyla Araç Kullanma",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 45 dakikadan az 1 günden fazla olmayacaktır. Para cezası ise $5.000 olacaktır ve araç 2 günlüğüne bağlanacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 45,
        "maxMinutes": 1440,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "403",
    "title": "Sürücü Lisansı İbraz Etmemek",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.000 para cezası ile cezalandırılacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "404",
    "title": "Taşıt Tescil Belgesi İbraz Etmemek",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.000 para cezası ile cezalandırılacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "405",
    "title": "Taşıt Sigorta Belgesi İbraz Etmemek",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.000 para cezası ile cezalandırılacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "406",
    "title": "Kayıtsız Taşıt",
    "classification": "Madde (a) ihlalinde C Sınıfı infraction. $5.000 para cezası, taşıta 1 gün el koyulacak, lisans 3 gün askıya alınacaktır.\nMadde (b) ihlalinde C Sınıfı infraction. $5.000 para cezası ve taşıta 1 gün el koyulacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Madde (a) · C Sınıfı infraction",
        "condition": "Madde (a)",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 5000
      },
      {
        "key": "l2",
        "label": "Madde (b) · C Sınıfı infraction",
        "condition": "Madde (b)",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 5000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "407",
    "title": "Sigortasız Taşıt",
    "classification": "Madde (a) ihlalinde C Sınıfı infraction. $5.000 para cezası, taşıta 1 gün el koyulacak, lisans 3 gün askıya alınacaktır.\nMadde (b) ihlalinde C Sınıfı infraction. $5.000 para cezası ve taşıta 1 gün el koyulacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Madde (a) · C Sınıfı infraction",
        "condition": "Madde (a)",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 5000
      },
      {
        "key": "l2",
        "label": "Madde (b) · C Sınıfı infraction",
        "condition": "Madde (b)",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 5000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "408",
    "title": "Vur Kaç",
    "classification": "Madde (a) ihlalinde C Sınıfı misdemeanor. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.\nMadde (b) ihlalinde A Sınıfı (4) veya B Sınıfı (3) felony. Hapis cezası 12 saatten az 3 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Madde (a) · C Sınıfı misdemeanor",
        "condition": "Madde (a)",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Madde (b) · A Sınıfı (4) felony",
        "condition": "Madde (b)",
        "cls": "A",
        "type": "F",
        "points": 4,
        "minMinutes": 720,
        "maxMinutes": 4320,
        "fine": 0
      },
      {
        "key": "l3",
        "label": "Madde (b) · B Sınıfı (3) felony",
        "condition": "Madde (b)",
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 720,
        "maxMinutes": 4320,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 400000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "409",
    "title": "Bir Arazi veya Deniz Aracının Dikkatsiz Kullanımı",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 7 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $15.000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür. Bu suç için ceza artırımlarına izin verilmektedir.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 15000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "7 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $15.000 para cezası"
      }
    ],
    "bail": {
      "amount": 80000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "410",
    "title": "Hız İhlali",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $8.000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 8000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $8.000 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "411",
    "title": "Aşırı Hız İhlali",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $8.000 para cezası\n2. 1 günlüğüne taşıta el koyulacaktır, 2 günlüğüne lisans askıya alınacaktır ve $8.000 para cezası\n3. 3 günlüğüne taşıta el koyulacaktır, 4 günlüğüne lisans askıya alınacaktır ve $12.000 para cezası\n4. 7 günlüğüne taşıta el koyulacaktır, 7 günlüğüne lisans askıya alınacaktır ve $15.000 para cezası\n5. 10 günlüğüne taşıta el koyulacaktır, 10 günlüğüne lisans askıya alınacaktır ve $20.000 para cezası",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 8000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$8.000 para cezası"
      },
      {
        "n": 2,
        "fine": 8000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "1 günlüğüne taşıta el koyulacaktır, 2 günlüğüne lisans askıya alınacaktır ve $8.000 para cezası"
      },
      {
        "n": 3,
        "fine": 12000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "3 günlüğüne taşıta el koyulacaktır, 4 günlüğüne lisans askıya alınacaktır ve $12.000 para cezası"
      },
      {
        "n": 4,
        "fine": 15000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "7 günlüğüne taşıta el koyulacaktır, 7 günlüğüne lisans askıya alınacaktır ve $15.000 para cezası"
      },
      {
        "n": 5,
        "fine": 20000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "10 günlüğüne taşıta el koyulacaktır, 10 günlüğüne lisans askıya alınacaktır ve $20.000 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "412",
    "title": "Trafik Kontrol Araçlarına Uymama",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 7500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "413",
    "title": "Kavşakta Yol Vermeme",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 7500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "414",
    "title": "Trafiğe Girişte Yol Vermeme",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 7500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "415",
    "title": "Yaya Geçidinde Yol Vermeme",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 7500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "416",
    "title": "Acil Durum Araçlarına Yol Vermeme",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 7500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "417",
    "title": "Dönüşte Hatalı Şeride Girme",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 7500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "418",
    "title": "Hatalı Park",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $1.000 para cezası\n2. $2.500 para cezası\n3. $5.000 para cezası\nNot: Trafik akışını engelleyen veya halk için risk oluşturan araçlara 1 gün süreyle el koyulabilir.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 1000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$1.000 para cezası"
      },
      {
        "n": 2,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 3,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "419",
    "title": "Dikkatsiz Sürüş",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır. Para cezası ise $5.000 olacak, taşıt 3 gün bağlanacak ve lisans 3 gün askıya alınacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "420",
    "title": "Araç Tehlikesi",
    "classification": "A Sınıfı (4), B Sınıfı (3) veya C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 5 günden fazla olmayacaktır. Para cezası ise $10.000 olacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (4) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 4,
        "minMinutes": 1440,
        "maxMinutes": 7200,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "B Sınıfı (3) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 1440,
        "maxMinutes": 7200,
        "fine": 0
      },
      {
        "key": "l3",
        "label": "C Sınıfı (2) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 1440,
        "maxMinutes": 7200,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "421",
    "title": "Farları Çalıştırmamak",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $2.500 para cezası ile cezalandırılacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "422",
    "title": "Emniyetsiz Geri Manevra",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 7500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "423",
    "title": "Trafiği Engelleme",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 7500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "424",
    "title": "Ters Yönde Sürüş",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 7500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "425",
    "title": "Emniyetsiz Sürüş",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 7500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "426",
    "title": "Sürüş Sırasında Elektronik Cihaz Kullanma",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 7500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "427",
    "title": "Taşıt Gürültüsü",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 7500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "428",
    "title": "Hidroliklerin Yasa Dışı Kullanımı",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 7500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "429",
    "title": "Cam Filmleri",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $1.000 para cezası\n2. $2.500 para cezası\n3. $5.000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 1000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$1.000 para cezası"
      },
      {
        "n": 2,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 3,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "430",
    "title": "Etki Altında Sürüş [DUI]",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Aşağıdaki suç sayısı kriterlerine göre cezalandırılacaktır:\n1. 3 saat hapis cezası, 3 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $5.000 para cezası\n2. 6 saat hapis cezası, 7 günlüğüne taşıta el koyulacaktır, 7 günlüğüne lisans askıya alınacaktır ve $8.000 para cezası\n3. 1 gün hapis cezası (C Sınıfı [2] felony kapsamında sorumlu tutulur), 10 günlüğüne taşıta el koyulacaktır, 10 günlüğüne lisans askıya alınacaktır ve $12.000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür. Bu suç için ceza artırımlarına izin verilmektedir.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 5000,
        "minMinutes": 180,
        "maxMinutes": 180,
        "note": "3 saat hapis cezası, 3 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $5.000 para cezası"
      },
      {
        "n": 2,
        "fine": 8000,
        "minMinutes": 360,
        "maxMinutes": 360,
        "note": "6 saat hapis cezası, 7 günlüğüne taşıta el koyulacaktır, 7 günlüğüne lisans askıya alınacaktır ve $8.000 para cezası"
      },
      {
        "n": 3,
        "fine": 12000,
        "minMinutes": 1440,
        "maxMinutes": 1440,
        "note": "1 gün hapis cezası (C Sınıfı [2] felony kapsamında sorumlu tutulur), 10 günlüğüne taşıta el koyulacaktır, 10 günlüğüne lisans askıya alınacaktır ve $12.000 para cezası"
      }
    ],
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "431",
    "title": "Test Yapılmasını Reddetme",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Aşağıdaki suç sayısı kriterlerine göre cezalandırılacaktır:\n1. 3 saat hapis cezası, 3 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $5.000 para cezası\n2. 6 saat hapis cezası, 7 günlüğüne taşıta el koyulacaktır, 7 günlüğüne lisans askıya alınacaktır ve $8.000 para cezası",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 5000,
        "minMinutes": 180,
        "maxMinutes": 180,
        "note": "3 saat hapis cezası, 3 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $5.000 para cezası"
      },
      {
        "n": 2,
        "fine": 8000,
        "minMinutes": 360,
        "maxMinutes": 360,
        "note": "6 saat hapis cezası, 7 günlüğüne taşıta el koyulacaktır, 7 günlüğüne lisans askıya alınacaktır ve $8.000 para cezası"
      }
    ],
    "bail": {
      "amount": 75000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "432",
    "title": "Motorlu Taşıt Yarışı",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır. Para cezası ise $5.500 olacak, taşıt 7 gün bağlanacak ve lisans 7 gün askıya alınacaktır.\nMadde (b) ihlalinde C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 3 günden fazla olmayacaktır. Para cezası ise $15.000 olacak, taşıt 10 gün bağlanacak ve lisans 7 gün askıya alınacaktır. 115. Kolluk Kuvvetlerinden Kaçmak maddesinin ihlalinde ilgili madde suçlamalara eklenecektir.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Madde (b) · C Sınıfı (5) felony",
        "condition": "Madde (b)",
        "cls": "C",
        "type": "F",
        "points": 5,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "433",
    "title": "Yaya Geçidi İhlali",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.500 para cezası ile cezalandırılacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1500
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "434",
    "title": "Açık Materyal Bulundurma",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.000 para cezası ile cezalandırılacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "435",
    "title": "Emniyet Kemeri — Emniyet Ekipmanı Kullanmama",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.000 para cezası ile cezalandırılacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "436",
    "title": "Emniyetsiz Taşıtı Kullanma",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $2.000 para cezası ile cezalandırılacak ve taşıt 2 gün bağlanacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "437",
    "title": "Geçerli Bir Lisans Olmadan Hava Aracı Kullanma",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "438",
    "title": "Hava Aracının Dikkatsiz Kullanımı",
    "classification": "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 6 günden fazla olmayacaktır. Para cezası ise $50.000 olacak, PPL askıya alınacak ve taşıta 3 gün el koyulacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (3) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "439",
    "title": "ATC Talimatlarına Uymamak",
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır. Para cezası ise $50.000 olacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (2) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "440",
    "title": "Hava Aracıyla Kaçma",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır. Para cezası ise $100.000 olacak ve taşıta 7 gün el koyulacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "441",
    "title": "Bisikletin Dikkatsiz Kullanımı",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $2.500 para cezası ile cezalandırılacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "442",
    "title": "Vespucci Beach'te İzinsiz Taşıt Kullanımı",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 3 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 2,
        "fine": 5000,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$5.000 para cezası"
      },
      {
        "n": 3,
        "fine": 7500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "3 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası"
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "443",
    "title": "Sokağı İşgal Etme",
    "classification": "C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 3 günden fazla olmayacaktır. Para cezası ise $20.000 olacaktır, araç 7 günlüğüne bağlanacak ve sürücü lisansına 7 günlüğüne el koyulacaktır.\nSuçlu kasıtlı olarak motorlu bir taşıt veya bisiklet ile kaçtığı veya kaçmaya teşebbüs ettiği takdirde 115. Kolluk Kuvvetlerinden Kaçmak maddesi ek suçlama olarak eklenir, araca 14 gün süreyle el koyulur.\nSuçlu kasıtlı olarak yaya bir şekilde kaçtığı veya kaçmaya teşebbüs ettiği takdirde 116. Tutuklamaya Direnmek maddesi ek suçlama olarak eklenir.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (5) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 5,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 350000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "444",
    "title": "Araçlarda Işık Kontrolü",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $500 para cezası\n2. $2.500 para cezası\n3. 2 günlüğüne taşıta, 2 günlüğüne lisansa el koyulacaktır ve $7.500 para cezası yanında araçtan ilgili ekipmanların sökümü iadesiz olarak sağlanacaktır.\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [
      {
        "n": 1,
        "fine": 500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$500 para cezası"
      },
      {
        "n": 2,
        "fine": 2500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "$2.500 para cezası"
      },
      {
        "n": 3,
        "fine": 7500,
        "minMinutes": 0,
        "maxMinutes": 0,
        "note": "2 günlüğüne taşıta, 2 günlüğüne lisansa el koyulacaktır ve $7.500 para cezası yanında araçtan ilgili ekipmanların sökümü iadesiz olarak sağlanacaktır."
      }
    ],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "501",
    "title": "Teşhircilik",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 300000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "502",
    "title": "Kamu İçinde Uygunsuz veya Ahlaksız Davranış",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "503",
    "title": "Fuhuş",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 150000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "504",
    "title": "Fuhuşa Teşvik",
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (2) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "505",
    "title": "Tacizci Takip",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 400000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "506",
    "title": "Kumar Dolandırıcılığı",
    "classification": "Toplam değer $10.000'ı aşmıyorsa C Sınıfı misdemeanor. Hapis cezası 12 saatten az 1 günden fazla olmayacaktır.\nToplam değer $10.000'ı aşıyorsa C Sınıfı (2) felony. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.\nNot: \"Hileli bir şekilde elde etmek\", bahis veya bahis miktarını değiştirmeyi, oyun kuralları tarafından onaylanmayan bir teknik veya cihaz aracılığıyla haksız avantaj elde etmeyi de içerir.",
    "levels": [
      {
        "key": "l1",
        "label": "Toplam değer $10.000'ı aşmıyorsa · C Sınıfı misdemeanor",
        "condition": "Toplam değer $10.000'ı aşmıyorsa",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 720,
        "maxMinutes": 1440,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Toplam değer $10.000'ı aşıyorsa · C Sınıfı (2) felony",
        "condition": "Toplam değer $10.000'ı aşıyorsa",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 450000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "507",
    "title": "Çocuk İstismarı",
    "classification": "A Sınıfı (7) veya B Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (7) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 7,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "B Sınıfı (5) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 5,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "508",
    "title": "Çocuk İhmali",
    "classification": "A Sınıfı (4) veya B Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 6 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (4) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "B Sınıfı (3) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "509",
    "title": "Reşit Olmayan Bireye Alkol veya Tütün Satışı",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 saatten az 2 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 120,
        "maxMinutes": 2880,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 80000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "510",
    "title": "Reşit Olmadan Alkol veya Tütün Kullanımı",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 2 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 2880,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 50000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "511",
    "title": "Hayvan İstismarı",
    "classification": "A Sınıfı (5) veya B Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (5) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 5,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "B Sınıfı (4) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "512",
    "title": "Mahkumla Cinsel İlişkiye Girme",
    "classification": "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (3) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 350000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "601",
    "title": "Kontrollü Madde Üretimi",
    "classification": "C Sınıfı (7) felony kapsamında sorumlu tutulacaktır. Ceza yönergeleri:\nA — $50.000'a kadar para cezası ve 14 günden fazla olmamak üzere hapis cezası\nB — $45.000'a kadar para cezası ve 12 günden fazla olmamak üzere hapis cezası\nC — $40.000'a kadar para cezası ve 10 günden fazla olmamak üzere hapis cezası\nD — $20.000'a kadar para cezası ve 8 günden fazla olmamak üzere hapis cezası\nT — $15.000'a kadar para cezası ve 3 günden fazla olmamak üzere hapis cezası",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (7) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 7,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 470000,
      "auto": true,
      "optional": false
    },
    "categories": [
      {
        "key": "A",
        "fine": 50000,
        "maxMinutes": 20160,
        "note": "$50.000'a kadar para cezası ve 14 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "B",
        "fine": 45000,
        "maxMinutes": 17280,
        "note": "$45.000'a kadar para cezası ve 12 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "C",
        "fine": 40000,
        "maxMinutes": 14400,
        "note": "$40.000'a kadar para cezası ve 10 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "D",
        "fine": 20000,
        "maxMinutes": 11520,
        "note": "$20.000'a kadar para cezası ve 8 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "T",
        "fine": 15000,
        "maxMinutes": 4320,
        "note": "$15.000'a kadar para cezası ve 3 günden fazla olmamak üzere hapis cezası"
      }
    ]
  },
  {
    "number": "602",
    "title": "Kontrollü Madde Bulundurmak",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Ceza yönergeleri:\nA — $4.500'a kadar para cezası ve 20 saatten fazla olmamak üzere hapis cezası\nB — $3.750'a kadar para cezası ve 15 saatten fazla olmamak üzere hapis cezası\nC — $3.000'a kadar para cezası ve 10 saatten fazla olmamak üzere hapis cezası\nD — $2.250'a kadar para cezası ve yazılı veya sözlü uyarı\nT — $500'a kadar para cezası ve yazılı veya sözlü uyarı",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 20000,
      "auto": true,
      "optional": false
    },
    "categories": [
      {
        "key": "A",
        "fine": 4500,
        "maxMinutes": 1200,
        "note": "$4.500'a kadar para cezası ve 20 saatten fazla olmamak üzere hapis cezası"
      },
      {
        "key": "B",
        "fine": 3750,
        "maxMinutes": 900,
        "note": "$3.750'a kadar para cezası ve 15 saatten fazla olmamak üzere hapis cezası"
      },
      {
        "key": "C",
        "fine": 3000,
        "maxMinutes": 600,
        "note": "$3.000'a kadar para cezası ve 10 saatten fazla olmamak üzere hapis cezası"
      },
      {
        "key": "D",
        "fine": 2250,
        "maxMinutes": 0,
        "note": "$2.250'a kadar para cezası ve yazılı veya sözlü uyarı"
      },
      {
        "key": "T",
        "fine": 500,
        "maxMinutes": 0,
        "note": "$500'a kadar para cezası ve yazılı veya sözlü uyarı"
      }
    ]
  },
  {
    "number": "603",
    "title": "Kontrollü Maddeyi Dağıtım Amacıyla Bulundurmak",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Ceza yönergeleri:\nA — $15.000'a kadar para cezası ve 2 günden fazla olmamak üzere hapis cezası\nB — $10.500'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası\nC — $7.000'a kadar para cezası ve 14 saatten fazla olmamak üzere hapis cezası\nD — $5.250'a kadar para cezası ve 12 saatten fazla olmamak üzere hapis cezası\nT — $1.000'a kadar para cezası ve 6 saatten fazla olmamak üzere hapis cezası",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 30000,
      "auto": true,
      "optional": false
    },
    "categories": [
      {
        "key": "A",
        "fine": 15000,
        "maxMinutes": 2880,
        "note": "$15.000'a kadar para cezası ve 2 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "B",
        "fine": 10500,
        "maxMinutes": 1440,
        "note": "$10.500'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "C",
        "fine": 7000,
        "maxMinutes": 840,
        "note": "$7.000'a kadar para cezası ve 14 saatten fazla olmamak üzere hapis cezası"
      },
      {
        "key": "D",
        "fine": 5250,
        "maxMinutes": 720,
        "note": "$5.250'a kadar para cezası ve 12 saatten fazla olmamak üzere hapis cezası"
      },
      {
        "key": "T",
        "fine": 1000,
        "maxMinutes": 360,
        "note": "$1.000'a kadar para cezası ve 6 saatten fazla olmamak üzere hapis cezası"
      }
    ]
  },
  {
    "number": "604",
    "title": "Kontrollü Madde Satmak",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Ceza yönergeleri:\nA — $15.000'a kadar para cezası ve 2 günden fazla olmamak üzere hapis cezası\nB — $10.500'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası\nC — $7.000'a kadar para cezası ve 14 saatten fazla olmamak üzere hapis cezası\nD — $5.250'a kadar para cezası ve 12 saatten fazla olmamak üzere hapis cezası\nT — $1.000'a kadar para cezası ve 6 saatten fazla olmamak üzere hapis cezası",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 70000,
      "auto": true,
      "optional": false
    },
    "categories": [
      {
        "key": "A",
        "fine": 15000,
        "maxMinutes": 2880,
        "note": "$15.000'a kadar para cezası ve 2 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "B",
        "fine": 10500,
        "maxMinutes": 1440,
        "note": "$10.500'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "C",
        "fine": 7000,
        "maxMinutes": 840,
        "note": "$7.000'a kadar para cezası ve 14 saatten fazla olmamak üzere hapis cezası"
      },
      {
        "key": "D",
        "fine": 5250,
        "maxMinutes": 720,
        "note": "$5.250'a kadar para cezası ve 12 saatten fazla olmamak üzere hapis cezası"
      },
      {
        "key": "T",
        "fine": 1000,
        "maxMinutes": 360,
        "note": "$1.000'a kadar para cezası ve 6 saatten fazla olmamak üzere hapis cezası"
      }
    ]
  },
  {
    "number": "605",
    "title": "Uyuşturucu Kaçakçılığı",
    "classification": "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Ceza yönergeleri:\nA — $22.500'a kadar para cezası ve 4 günden fazla olmamak üzere hapis cezası\nB — $18.750'a kadar para cezası ve 3 günden fazla olmamak üzere hapis cezası\nC — $15.000'a kadar para cezası ve 2 günden fazla olmamak üzere hapis cezası\nD — $11.500'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası\nT — $4.000'a kadar para cezası ve 10 saatten fazla olmamak üzere hapis cezası",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (3) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 80000,
      "auto": true,
      "optional": true
    },
    "categories": [
      {
        "key": "A",
        "fine": 22500,
        "maxMinutes": 5760,
        "note": "$22.500'a kadar para cezası ve 4 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "B",
        "fine": 18750,
        "maxMinutes": 4320,
        "note": "$18.750'a kadar para cezası ve 3 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "C",
        "fine": 15000,
        "maxMinutes": 2880,
        "note": "$15.000'a kadar para cezası ve 2 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "D",
        "fine": 11500,
        "maxMinutes": 1440,
        "note": "$11.500'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "T",
        "fine": 4000,
        "maxMinutes": 600,
        "note": "$4.000'a kadar para cezası ve 10 saatten fazla olmamak üzere hapis cezası"
      }
    ]
  },
  {
    "number": "606",
    "title": "Uyuşturucu Ticareti",
    "classification": "C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Ceza yönergeleri:\nA — $45.000'a kadar para cezası ve 7 günden fazla olmamak üzere hapis cezası\nB — $37.500'a kadar para cezası ve 6 günden fazla olmamak üzere hapis cezası\nC — $30.000'a kadar para cezası ve 5 günden fazla olmamak üzere hapis cezası\nD — $22.500'a kadar para cezası ve 4 günden fazla olmamak üzere hapis cezası\nT — $8.000'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası\nNot: Gözaltına alındığında veya tutuklandığında bulunan her 75 gram için cezasına ek 12 saat eklenecektir.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (5) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 5,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    },
    "categories": [
      {
        "key": "A",
        "fine": 45000,
        "maxMinutes": 10080,
        "note": "$45.000'a kadar para cezası ve 7 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "B",
        "fine": 37500,
        "maxMinutes": 8640,
        "note": "$37.500'a kadar para cezası ve 6 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "C",
        "fine": 30000,
        "maxMinutes": 7200,
        "note": "$30.000'a kadar para cezası ve 5 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "D",
        "fine": 22500,
        "maxMinutes": 5760,
        "note": "$22.500'a kadar para cezası ve 4 günden fazla olmamak üzere hapis cezası"
      },
      {
        "key": "T",
        "fine": 8000,
        "maxMinutes": 1440,
        "note": "$8.000'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası"
      }
    ]
  },
  {
    "number": "607",
    "title": "Uyuşturucu Aletlerini Bulundurma",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Para cezası $4.500 olacaktır.\nEğer cihazlar veya aletler, C.K. 605 Uyuşturucu Kaçakçılığı ve C.K. 606 Uyuşturucu Ticareti suçunun işlenmesi sırasında kullanıldıysa C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Eğer cihazlar veya aletler, C.K. 605 Uyuşturucu Kaçakçılığı ve C.K. 606 Uyuşturucu Ticareti suçunun işlenmesi sırasında kullanıldıysa · C Sınıfı misdemeanor",
        "condition": "Eğer cihazlar veya aletler, C.K. 605 Uyuşturucu Kaçakçılığı ve C.K. 606 Uyuşturucu Ticareti suçunun işlenmesi sırasında kullanıldıysa",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "609",
    "title": "Yasa Dışı Dinleme",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "610",
    "title": "Yüzün Gizlenmesi",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 2 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 2880,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "611",
    "title": "Yangın Yönetmeliği İhlali",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $3.000 para cezası ile cezalandırılacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 3000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "612",
    "title": "Çevrenin Kirletilmesi",
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.000 para cezası ile cezalandırılacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı infraction",
        "condition": "",
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "613",
    "title": "SRCB İhlali",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 10 saat ve para cezası $50.000 olacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 600,
        "maxMinutes": 600,
        "fine": 50000
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "701",
    "title": "İzinsiz Ateşli Silah Bulundurma",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 4 saatten fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 240,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 400000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "702",
    "title": "Yasaklı Ateşli Silah Bulundurma",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 6 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 400000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "703",
    "title": "Ağırlaştırılmış Silah Bulundurma",
    "classification": "C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 10 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (5) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 5,
        "minMinutes": 5760,
        "maxMinutes": 14400,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "704",
    "title": "Patlayıcı veya Yanıcı Cihazların Bulundurulması",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "705",
    "title": "Yasal Olmayan Ateşli Silah ve Patlayıcı Maddelerin Satışı",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 800000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "706",
    "title": "Ölümcül Silahın Sergilenmesi",
    "classification": "B Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 5 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "B Sınıfı (3) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 1440,
        "maxMinutes": 7200,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "707",
    "title": "Ateşli Silahların Kamu Alanında Ateşlenmesi",
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 8 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (2) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 2880,
        "maxMinutes": 11520,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "708",
    "title": "Silahla Motorlu Taşıttan Ateş Etmek",
    "classification": "A Sınıfı (7) veya B Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "A Sınıfı (7) felony",
        "condition": "",
        "cls": "A",
        "type": "F",
        "points": 7,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "B Sınıfı (5) felony",
        "condition": "",
        "cls": "B",
        "type": "F",
        "points": 5,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "709",
    "title": "Ateşli Silahların Dikkatsiz Kullanımı",
    "classification": "B Sınıfı veya C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 4 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "B Sınıfı misdemeanor",
        "condition": "",
        "cls": "B",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 5760,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 5760,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "710",
    "title": "SHAFT İhlali",
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 2 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı misdemeanor",
        "condition": "",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 2880,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "711",
    "title": "Felony Hükümlüsünün Silah Bulundurması",
    "classification": "C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 4 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (5) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 5,
        "minMinutes": 1440,
        "maxMinutes": 5760,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 800000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "712",
    "title": "Felony Hükümlüsünün Mühimmat Bulundurması",
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 4 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (2) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 1440,
        "maxMinutes": 5760,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "713",
    "title": "Hapishanede Ölümcül Silah Bulundurmak",
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 7 günden az 9 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "C Sınıfı (4) felony",
        "condition": "",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 10080,
        "maxMinutes": 12960,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "714",
    "title": "Okul Sınırları İçerisinde Silah Bulundurmak",
    "classification": "Madde (a) ihlalinde C Sınıfı (4) felony. Hapis cezası 2 günden az 6 günden fazla olmayacaktır.\nMadde (c) ihlalinde C Sınıfı (3) felony. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.\nDiğer maddelerin ihlalinde C Sınıfı misdemeanor. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.",
    "levels": [
      {
        "key": "l1",
        "label": "Madde (a) · C Sınıfı (4) felony",
        "condition": "Madde (a)",
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 0
      },
      {
        "key": "l2",
        "label": "Madde (c) · C Sınıfı (3) felony",
        "condition": "Madde (c)",
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0
      },
      {
        "key": "l3",
        "label": "Diğer maddelerin · C Sınıfı misdemeanor",
        "condition": "Diğer maddelerin",
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 0
      }
    ],
    "tiers": [],
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  }
];
