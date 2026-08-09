// AUTO-GENERATED from penal code + kefalet cetveli. Do not edit by hand.
export type ChargeClass = "A" | "B" | "C";
export type ChargeType = "F" | "M" | "I";

export interface ChargeVariant {
  cls: ChargeClass;
  type: ChargeType;
  points: number;
  minMinutes: number;
  maxMinutes: number;
  fine: number;
  offenseFines: number[];
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
  /** Hapis yerine uygulanan yaptırım varsa açıklaması */
  note: string;
}

export interface ChargeDefinition {
  number: string;
  title: string;
  classification: string;
  variants: ChargeVariant[];
  /** Uyuşturucu suçlarında (C.K. 601-606) madde kategorisine göre ceza tablosu */
  categories?: ChargeCategory[];
  bail: BailInfo;
}

export const chargeCatalog: ChargeDefinition[] = [
  {
    "number": "001",
    "title": "İhanet",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "B",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "C",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A, B veya C Sınıfı felony kapsamında sorumlu tutulacaktır ve cezası mahkemenin takdirine göre belirlenecektir.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "002",
    "title": "Casusluk",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "B",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "C",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A, B veya C Sınıfı felony kapsamında sorumlu tutulacaktır ve cezası mahkemenin takdirine göre belirlenecektir.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "003",
    "title": "İç Terörizm",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "B",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "C",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A, B veya C Sınıfı felony kapsamında sorumlu tutulacaktır ve cezası mahkemenin takdirine göre belirlenecektir.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "004",
    "title": "İç Terörizm Tehdidi",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "B",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "C",
        "type": "F",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A, B veya C Sınıfı felony kapsamında sorumlu tutulacaktır ve cezası mahkemenin takdirine göre belirlenecektir.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "101",
    "title": "Vergi Kaçakçılığı",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 5000,
        "offenseFines": [
          5000,
          10000,
          15000
        ]
      }
    ],
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $5,000 para cezası\n2. $10,000 para cezası\n3. $15,000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "102",
    "title": "Seçimde Sahtekarlık",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "bail": {
      "amount": 60000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "103",
    "title": "Kamu Görevinde Yolsuzluk",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 5760,
        "maxMinutes": 10080,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 7 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "104",
    "title": "Kamu Görevini İhmal",
    "variants": [
      {
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 4320,
        "maxMinutes": 8640,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 4320,
        "maxMinutes": 8640,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "B Sınıfı (3) veya C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 6 günden fazla olmayacaktır.",
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "105",
    "title": "Kamu Görevlisine Rüşvet",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 4320,
        "maxMinutes": 7200,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 5 günden fazla olmayacaktır.",
    "bail": {
      "amount": 300000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "106",
    "title": "İsyana Teşvik",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 360,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 2 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "107",
    "title": "Yasa Dışı Toplanma",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 1440,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 1 günden fazla olmayacaktır.",
    "bail": {
      "amount": 50000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "108",
    "title": "Delillerle Oynama",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 5,
        "minMinutes": 240,
        "maxMinutes": 5760,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 saatten az 4 günden fazla olmayacaktır.",
    "bail": {
      "amount": 150000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "109",
    "title": "Tanık veya Mağdura Tehdit ",
    "variants": [
      {
        "cls": "B",
        "type": "F",
        "points": 5,
        "minMinutes": 2880,
        "maxMinutes": 10080,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 2880,
        "maxMinutes": 10080,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "B Sınıfı (5) veya C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 7 günden fazla olmayacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "110",
    "title": "Mahkemeye Saygısızlık",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 5760,
        "fine": 20000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden fazla olmayacaktır ve/ya da para cezası  $20.000'dan fazla olmayacaktır. Duruma göre sadece hapis ya da para cezası veya her ikisi de ilgili kişiye karşı uygulanabilir.\n(( Bu suç sadece kefalet ihlallerinin olması durumunda zorunlu olarak mahkemeye gidecektir. ))",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "111",
    "title": "Yalancı Şahitlik",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 300,
        "maxMinutes": 4320,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 5 saatten az 3 günden fazla olmayacaktır.",
    "bail": {
      "amount": 80000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "112",
    "title": " Kamu Görevini Engellemek",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 1440,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "Madde (a) ihlalinde A Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.\nMadde (b) ihlalinde B Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 2 günden fazla olmayacaktır.\nMadde (c) ihlalinde C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 12 saatten fazla olmayacaktır.",
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "113",
    "title": "Kolluk Kuvvetlerinde Görevli Hayvanı Engellemek",
    "variants": [
      {
        "cls": "B",
        "type": "M",
        "points": 0,
        "minMinutes": 720,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "A",
        "type": "F",
        "points": 3,
        "minMinutes": 4320,
        "maxMinutes": 11520,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "Madde (a) ihlalinde B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 12 saatten az 2 günden fazla olmayacaktır.\n Madde (b) ihlalinde B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.\nMadde (c) ihlalinde A Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 8 günden fazla olmayacaktır.",
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "114",
    "title": "Yasal Gözaltından Kaçmak",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 10080,
        "maxMinutes": 12960,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 7 günden az 9 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "115",
    "title": "Kolluk Kuvvetlerinden Kaçmak",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 1440,
        "maxMinutes": 7200,
        "fine": 5000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 5 günden fazla olmayacaktır. Ayrıca sürücü lisansına 7 günlüğüne el koyulacaktır. Aracın çekilmesine ve para cezasına ilişkin cezalar ise aşağıdaki gibidir:\n1. 7 günlüğüne araca el koyulacaktır ve $5.000 para cezası\n2. 14 günlüğüne araca el koyulacaktır ve $10.000 para cezası\n3. 14 günlüğüne araca el koyulacaktır ve $20.000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.\n\nNot: Bu suç kişiye karşıdır ve araca karşı değildir. Bu nedenle kovalama farklı bir araçta başladıysa ve kaçan kişi farklı bir araca geçerse son kullandığı araç çekilebilir. Eğer araç başka birisine aitse ve çalındığını kanıtlayabilirse aracı teslim alabilir. Eğer aracın plaka kaydı yoksa araç parçalatılacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "116",
    "title": "Tutuklamaya Direnmek",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.",
    "bail": {
      "amount": 50000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "117",
    "title": "Hükümet Görevlilerine Yalan Söylemek",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 480,
        "maxMinutes": 5760,
        "fine": 10000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 8 saatten az 4 günden fazla olmayacaktır, para cezası ise $10.000 olacaktır.",
    "bail": {
      "amount": 150000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "118",
    "title": "Acil Yardım Hatlarının Kötüye Kullanımı",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 5000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır, para cezası ise $5.000 olacaktır.",
    "bail": {
      "amount": 90000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "119",
    "title": "Kimlik Hırsızlığı",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 240,
        "maxMinutes": 1440,
        "fine": 10000,
        "offenseFines": []
      }
    ],
    "classification": "Madde (a) ihlalinde C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 4 saatten az 1 günden fazla olmayacaktır.\nMadde (b) ihlalinde C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 4 günden fazla olmayacaktır, para cezası ise $10.000 olacaktır.",
    "bail": {
      "amount": 150000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "120",
    "title": "Bir Kamu Çalışanına Saldırı Tehdidi veya Darp",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 5,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "B",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (5) veya B Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 6 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "121",
    "title": "Sahtecilik",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 4320,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 3 günden fazla olmayacaktır.",
    "bail": {
      "amount": 350000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "122",
    "title": "Dolandırıcılık",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "Madde (a) ihlalinde C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 2 günden fazla olmayacaktır.\nMadde (b) veya (c) ihlalinde C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "123",
    "title": "Para Aklamak",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "Toplam değer $10,000 aşmıyorsa C Sınıfı (2) felony. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.\nToplam değer $10,000 aşıyorsa C Sınıfı (3) felony. Hapis cezası 3 günden az 5 günden fazla olmayacaktır.\nToplam değer $100,000 aşıyorsa C Sınıfı (4) felony. Hapis cezası 3 günden az 6 günden fazla olmayacaktır.\nToplam değer $500,000 aşıyorsa C Sınıfı (5) felony. Hapis cezası 5 günden az 8 günden fazla olmayacaktır.\nToplam değer $1,000,000 aşıyorsa C Sınıfı (6) felony. Hapis cezası 6 günden az 9 günden fazla olmayacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "124",
    "title": "ABD Para Birimine Zarar Vermek",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 1440,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 2 günden fazla olmayacaktır.",
    "bail": {
      "amount": 350000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "125",
    "title": "Huzuru Bozmak",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 2500,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır, para cezası ise $2.500 olacaktır.",
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "126",
    "title": "Haraç Kesmek",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 6,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "B",
        "type": "F",
        "points": 5,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (6), B Sınıfı (5) veya C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "127",
    "title": "EFCE Yasasının İhlali - Sinyal Bozucu",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 6,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "Madde (a) ihlalinde C Sınıfı (6) felony. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.\nMadde (b) ihlalinde C Sınıfı (4) felony. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.\nMadde (c) ihlalinde C Sınıfı (4) felony. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.",
    "bail": {
      "amount": 75000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "128",
    "title": "EFCE Yasasının İhlali - Kart Kopyalama",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 6,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "Madde (a) ihlalinde C Sınıfı (6) felony. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.\nMadde (b) ihlalinde C Sınıfı (4) felony. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.\nMadde (c) ihlalinde C Sınıfı (4) felony. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.",
    "bail": {
      "amount": 75000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "129",
    "title": "EFCE Yasasının İhlali - Araç Takibi",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 6,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (6) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.",
    "bail": {
      "amount": 75000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "130",
    "title": "Bir Mahkumu Kaçırmak",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 10080,
        "maxMinutes": 12960,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 7 günden az 9 günden fazla olmayacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "131",
    "title": "Hapishane İçerisinde Uyuşturucu Madde Bulundurmak",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 5,
        "minMinutes": 0,
        "maxMinutes": 10080,
        "fine": 45000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Ceza yönergeleri:\nA — $45.000'a kadar para cezası ve 7 günden fazla olmamak üzere hapis cezası.\nB — $37.500'a kadar para cezası ve 6 günden fazla olmamak üzere hapis cezası.\nC — $30.000'a kadar para cezası ve 5 günden fazla olmamak üzere hapis cezası.\nD — $22.500'a kadar para cezası ve 4 günden fazla olmamak üzere hapis cezası.\nT — $8.000'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası.",
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "132",
    "title": "Hapishane İçerisinde İletişim Aleti Bulundurmak",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır ve en fazla bin dolar ($1.000) para cezası ile cezalandırılacaktır.",
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "133",
    "title": "Hapishane İçerisinde Tütün Bulundurmak",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. Bin dolardan ($1.000) fazla olmamak kaydıyla para cezası ile cezalandırılacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "134",
    "title": "Hapishane İçerisinde Yetkisiz Anahtar Bulundurmak",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 2500,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır, para cezası ise $2.500 olacaktır.",
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "135",
    "title": "Barış Görevlisi Köpeğini Öldürmek",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 7200,
        "maxMinutes": 8640,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 5 günden az 6 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "136",
    "title": "Barış Görevlisi Köpeğini Ağır Yaralamak",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 4320,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 3 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "137",
    "title": "Barış Görevlisi Köpeğine Saldırmak",
    "variants": [
      {
        "cls": "B",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 2500,
        "offenseFines": []
      }
    ],
    "classification": "B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır, para cezası ise $2.500 olacaktır.",
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "138",
    "title": "Barış Görevlisi Köpeğini Engelleme",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 50,
        "maxMinutes": 360,
        "fine": 2500,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 50 dakikadan az 6 saatten fazla olmayacaktır, para cezası ise $2.500 olacaktır.",
    "bail": {
      "amount": 75000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "139",
    "title": "Mobil Veri Bilgisayarının Kötüye Kullanımı",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 4320,
        "maxMinutes": 8640,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 4320,
        "maxMinutes": 8640,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (2) ve B Sınıfı (3) olarak felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 6 günden fazla olmayacaktır.",
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "140",
    "title": "Mobil Veri Bilgisayarından Yetkisiz Bilgi Paylaşımı",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "B",
        "type": "F",
        "points": 2,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (3) ve B Sınıfı (2) olarak felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "141",
    "title": "Mahkumla Yasa Dışı İletişim Kurmak",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 1080,
        "maxMinutes": 4320,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 18 saatten az 3 günden fazla olmayacaktır.",
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "142",
    "title": "Mahkemeye Katılmamak",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "Misdemeanor ile suçlanmış ya da hüküm giymişse C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden fazla olmayacaktır.\nFelony ile suçlanmış ya da hüküm giymişse C Sınıfı felony kapsamında sorumlu tutulacaktır. Hapis cezası 6 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "201",
    "title": "Cinayet",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 18,
        "minMinutes": 28800,
        "maxMinutes": 28800,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (18) felony kapsamında sorumlu tutulacaktır. Hapis cezası 20 günden az olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "202",
    "title": "Birinci Derece Cinayet",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 15,
        "minMinutes": 25920,
        "maxMinutes": 25920,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (15) felony kapsamında sorumlu tutulacaktır. Hapis cezası 18 günden az olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "203",
    "title": "İkinci Derece Cinayet",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 10,
        "minMinutes": 21600,
        "maxMinutes": 21600,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (10) felony kapsamında sorumlu tutulacaktır. Hapis cezası 15 günden az olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "204",
    "title": "Kasten Adam Öldürme",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 7,
        "minMinutes": 7200,
        "maxMinutes": 14400,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (7) felony kapsamında sorumlu tutulacaktır. Hapis cezası 5 günden az 10 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "205",
    "title": "Kasıtsız Adam Öldürme",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 5,
        "minMinutes": 4320,
        "maxMinutes": 11520,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 8 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "206",
    "title": "Saldırı",
    "variants": [
      {
        "cls": "B",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 2 günden fazla olmayacaktır.",
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "207",
    "title": "Ölümcül Silahla Saldırı",
    "variants": [
      {
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 4320,
        "maxMinutes": 7200,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "Madde (a) ihlalinde B Sınıfı (3) felony. Hapis cezası 3 günden az 5 günden fazla olmayacaktır.\nMadde (b) ihlalinde B Sınıfı (4) felony. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "208",
    "title": "Darp",
    "variants": [
      {
        "cls": "B",
        "type": "M",
        "points": 0,
        "minMinutes": 420,
        "maxMinutes": 4320,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 7 saatten az 3 günden fazla olmayacaktır.",
    "bail": {
      "amount": 150000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "209",
    "title": "Ağırlaştırılmış Darp",
    "variants": [
      {
        "cls": "B",
        "type": "F",
        "points": 6,
        "minMinutes": 5760,
        "maxMinutes": 8640,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "Madde (a) ihlalinde B Sınıfı (6) felony. Hapis cezası 4 günden az 6 günden fazla olmayacaktır.\nMadde (b) ihlalinde B Sınıfı (8) felony. Hapis cezası 5 günden az 9 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "210",
    "title": "Kaçırma",
    "variants": [
      {
        "cls": "B",
        "type": "F",
        "points": 7,
        "minMinutes": 7200,
        "maxMinutes": 7200,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "B Sınıfı (7) felony kapsamında sorumlu tutulacaktır. Hapis cezası 5 günden az olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "211",
    "title": "İnsan Kaçakçılığı",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 9,
        "minMinutes": 8640,
        "maxMinutes": 8640,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (9) felony kapsamında sorumlu tutulacaktır. Hapis cezası 6 günden az olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "212",
    "title": "Yasa Dışı Hapis",
    "variants": [
      {
        "cls": "B",
        "type": "M",
        "points": 0,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "213",
    "title": "İşkence",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 10,
        "minMinutes": 8640,
        "maxMinutes": 8640,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (10) felony kapsamında sorumlu tutulacaktır. Hapis cezası 6 günden az olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "214",
    "title": "Tehdit Suçu",
    "variants": [
      {
        "cls": "B",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 1440,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "B Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 1 günden fazla olmayacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "215",
    "title": "Soygun",
    "variants": [
      {
        "cls": "B",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "B Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "216",
    "title": "Silahlı Soygun",
    "variants": [
      {
        "cls": "B",
        "type": "F",
        "points": 5,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "B Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "217",
    "title": "Tecavüz",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "218",
    "title": "Çocuk Bireyle İlişkiye Girme",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 5,
        "minMinutes": 5760,
        "maxMinutes": 5760,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "219",
    "title": "Cinsel Saldırı",
    "variants": [
      {
        "cls": "B",
        "type": "F",
        "points": 4,
        "minMinutes": 4320,
        "maxMinutes": 11520,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "B Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 3 günden az 8 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "220",
    "title": "Taciz",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 2 günden fazla olmayacaktır.",
    "bail": {
      "amount": 50000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "221",
    "title": "Aile İçi Şiddet",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 2 günden fazla olmayacaktır.",
    "bail": {
      "amount": 120000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "222",
    "title": "Yakıcı Kimyasal Maddelerle Saldırı",
    "variants": [
      {
        "cls": "B",
        "type": "F",
        "points": 6,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "B Sınıfı (6) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "bail": {
      "amount": 325000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "301",
    "title": "Kundakçılık",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 5,
        "minMinutes": 10080,
        "maxMinutes": 10080,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 7 günden az olmayacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "302",
    "title": "Hırsızlık",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.",
    "bail": {
      "amount": 400000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "303",
    "title": "Haneye Tecavüz",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "bail": {
      "amount": 450000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "304",
    "title": "Büyük Çaplı Hırsızlık",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 240,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 saatten az 2 günden fazla olmayacaktır.",
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "305",
    "title": "Küçük Çaplı Hırsızlık",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 120,
        "maxMinutes": 1440,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 saatten az 1 günden fazla olmayacaktır.",
    "bail": {
      "amount": 25000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "306",
    "title": "Araç Hırsızlığı",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 6 günden fazla olmayacaktır.",
    "bail": {
      "amount": 300000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "307",
    "title": "Ateşli Silah Hırsızlığı",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "bail": {
      "amount": 400000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "308",
    "title": "Hırsızlık Aletlerinin Bulundurulması",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır.",
    "bail": {
      "amount": 50000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "309",
    "title": "Çalınan Mal Varlığının Alınması",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 2 günden fazla olmayacaktır.",
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "310",
    "title": "İzinsiz Giriş",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 2 günden fazla olmayacaktır.",
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "311",
    "title": "Vandalizm",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 2880,
        "fine": 2500,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 2 günden fazla olmayacaktır, para cezası ise $2,500 olacaktır.",
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "312",
    "title": "Zimmetine Geçirme",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "Toplam değer $30.000'ı aşmıyorsa C Sınıfı misdemeanor. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.\nToplam değer $30.000'ı aşıyorsa C Sınıfı (2) felony. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "313",
    "title": "Taşıt Tescil Hırsızlığı",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 1440,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "Madde (a) ihlalinde C Sınıfı misdemeanor. Hapis cezası 3 saatten az 1 günden fazla olmayacaktır.\nMadde (b) ihlalinde C Sınıfı misdemeanor. Hapis cezası 12 saatten az 2 günden fazla olmayacaktır.\nMadde (c) ihlalinde C Sınıfı (3) felony. Hapis cezası 1 günden az 3 günden fazla olmayacaktır. Kaçış motorlu bir taşıt veya bisiklet ile yapıldığı takdirde 115. madde ek suçlama olarak eklenir.",
    "bail": {
      "amount": 550000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "314",
    "title": "Hapishane Mülküne Zarar Verme",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "Hasarın toplam maliyeti $950'ı aşmıyorsa C Sınıfı misdemeanor. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.\nHasarın toplam maliyeti $950'ı aşıyorsa C Sınıfı (2) felony. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.",
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "401",
    "title": "Geçerli Bir Sürücü Lisansı Olmadan Araç Kullanma",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 1440,
        "fine": 2500,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 30 dakikadan az 1 günden fazla olmayacaktır. Para cezası ise $2.500 olacaktır ve araç 1 günlüğüne bağlanacaktır.\n\nNot: Havalimanı araç kiralama acentesinden kiralanan araçlar sürücü lisansı gerekliliklerinden muaftır. Lisansı askıya alınmış veya el koyulmuş kişiler bu muafiyetten yararlanamaz.",
    "bail": {
      "amount": 60000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "402",
    "title": "Askıya Alınmış Bir Sürücü Lisansıyla Araç Kullanma",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 1440,
        "fine": 5000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 45 dakikadan az 1 günden fazla olmayacaktır. Para cezası ise $5.000 olacaktır ve araç 2 günlüğüne bağlanacaktır.",
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "403",
    "title": "Sürücü Lisansı İbraz Etmemek",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.000 para cezası ile cezalandırılacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "404",
    "title": "Taşıt Tescil Belgesi İbraz Etmemek",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.000 para cezası ile cezalandırılacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "405",
    "title": "Taşıt Sigorta Belgesi İbraz Etmemek",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.000 para cezası ile cezalandırılacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "406",
    "title": "Kayıtsız Taşıt",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 5000,
        "offenseFines": []
      }
    ],
    "classification": "Madde (a) ihlalinde C Sınıfı infraction. $5.000 para cezası, taşıta 1 gün el koyulacak, lisans 3 gün askıya alınacaktır.\nMadde (b) ihlalinde C Sınıfı infraction. $5.000 para cezası ve taşıta 1 gün el koyulacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "407",
    "title": "Sigortasız Taşıt",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 5000,
        "offenseFines": []
      }
    ],
    "classification": "Madde (a) ihlalinde C Sınıfı infraction. $5.000 para cezası, taşıta 1 gün el koyulacak, lisans 3 gün askıya alınacaktır.\nMadde (b) ihlalinde C Sınıfı infraction. $5.000 para cezası ve taşıta 1 gün el koyulacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "408",
    "title": "Vur Kaç",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "A",
        "type": "F",
        "points": 4,
        "minMinutes": 720,
        "maxMinutes": 4320,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 720,
        "maxMinutes": 4320,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "Madde (a) ihlalinde C Sınıfı misdemeanor. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.\nMadde (b) ihlalinde A Sınıfı (4) veya B Sınıfı (3) felony. Hapis cezası 12 saatten az 3 günden fazla olmayacaktır.",
    "bail": {
      "amount": 400000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "409",
    "title": "Bir Arazi veya Deniz Aracının Dikkatsiz Kullanımı",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 7 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $15.000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür. Bu suç için ceza artırımlarına izin verilmektedir.",
    "bail": {
      "amount": 80000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "410",
    "title": "Hız İhlali",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $8.000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "411",
    "title": "Aşırı Hız İhlali",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 8000,
        "offenseFines": [
          8000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $8.000 para cezası\n2. 1 günlüğüne taşıta el koyulacaktır, 2 günlüğüne lisans askıya alınacaktır ve $8.000 para cezası\n3. 3 günlüğüne taşıta el koyulacaktır, 4 günlüğüne lisans askıya alınacaktır ve $12.000 para cezası\n4. 7 günlüğüne taşıta el koyulacaktır, 7 günlüğüne lisans askıya alınacaktır ve $15.000 para cezası\n5. 10 günlüğüne taşıta el koyulacaktır, 10 günlüğüne lisans askıya alınacaktır ve $20.000 para cezası",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "412",
    "title": "Trafik Kontrol Araçlarına Uymama",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "413",
    "title": "Kavşakta Yol Vermeme",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "414",
    "title": "Trafiğe Girişte Yol Vermeme",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "415",
    "title": "Yaya Geçidinde Yol Vermeme",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "416",
    "title": "Acil Durum Araçlarına Yol Vermeme",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "417",
    "title": "Dönüşte Hatalı Şeride Girme",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "418",
    "title": "Hatalı Park",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000,
        "offenseFines": [
          1000,
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $1.000 para cezası\n2. $2.500 para cezası\n3. $5.000 para cezası\nNot: Trafik akışını engelleyen veya halk için risk oluşturan araçlara 1 gün süreyle el koyulabilir.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "419",
    "title": "Dikkatsiz Sürüş",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 5000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır. Para cezası ise $5.000 olacak, taşıt 3 gün bağlanacak ve lisans 3 gün askıya alınacaktır.",
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "420",
    "title": "Araç Tehlikesi",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 4,
        "minMinutes": 1440,
        "maxMinutes": 7200,
        "fine": 10000,
        "offenseFines": []
      },
      {
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 1440,
        "maxMinutes": 7200,
        "fine": 10000,
        "offenseFines": []
      },
      {
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 1440,
        "maxMinutes": 7200,
        "fine": 10000,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (4), B Sınıfı (3) veya C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 5 günden fazla olmayacaktır. Para cezası ise $10.000 olacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "421",
    "title": "Farları Çalıştırmamak",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $2.500 para cezası ile cezalandırılacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "422",
    "title": "Emniyetsiz Geri Manevra",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "423",
    "title": "Trafiği Engelleme",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "424",
    "title": "Ters Yönde Sürüş",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "425",
    "title": "Emniyetsiz Sürüş",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "426",
    "title": "Sürüş Sırasında Elektronik Cihaz Kullanma",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "427",
    "title": "Taşıt Gürültüsü",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "428",
    "title": "Hidroliklerin Yasa Dışı Kullanımı",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 2 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "429",
    "title": "Cam Filmleri",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000,
        "offenseFines": [
          1000,
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $1.000 para cezası\n2. $2.500 para cezası\n3. $5.000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "430",
    "title": "Etki Altında Sürüş [DUI]",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 1440,
        "fine": 5000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Aşağıdaki suç sayısı kriterlerine göre cezalandırılacaktır:\n1. 3 saat hapis cezası, 3 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $5.000 para cezası\n2. 6 saat hapis cezası, 7 günlüğüne taşıta el koyulacaktır, 7 günlüğüne lisans askıya alınacaktır ve $8.000 para cezası\n3. 1 gün hapis cezası (C Sınıfı [2] felony kapsamında sorumlu tutulur), 10 günlüğüne taşıta el koyulacaktır, 10 günlüğüne lisans askıya alınacaktır ve $12.000 para cezası\nSuçun devam etmesi halinde üçüncü cezaya dönülür. Bu suç için ceza artırımlarına izin verilmektedir.",
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "431",
    "title": "Test Yapılmasını Reddetme",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 360,
        "fine": 5000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Aşağıdaki suç sayısı kriterlerine göre cezalandırılacaktır:\n1. 3 saat hapis cezası, 3 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $5.000 para cezası\n2. 6 saat hapis cezası, 7 günlüğüne taşıta el koyulacaktır, 7 günlüğüne lisans askıya alınacaktır ve $8.000 para cezası",
    "bail": {
      "amount": 75000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "432",
    "title": "Motorlu Taşıt Yarışı",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 5500,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır. Para cezası ise $5.500 olacak, taşıt 7 gün bağlanacak ve lisans 7 gün askıya alınacaktır.\nMadde (b) ihlalinde C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 3 günden fazla olmayacaktır. Para cezası ise $15.000 olacak, taşıt 10 gün bağlanacak ve lisans 7 gün askıya alınacaktır. 115. Kolluk Kuvvetlerinden Kaçmak maddesinin ihlalinde ilgili madde suçlamalara eklenecektir.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "433",
    "title": "Yaya Geçidi İhlali",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1500,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.500 para cezası ile cezalandırılacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "434",
    "title": "Açık Materyal Bulundurma",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.000 para cezası ile cezalandırılacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "435",
    "title": "Emniyet Kemeri — Emniyet Ekipmanı Kullanmama",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.000 para cezası ile cezalandırılacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "436",
    "title": "Emniyetsiz Taşıtı Kullanma",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $2.000 para cezası ile cezalandırılacak ve taşıt 2 gün bağlanacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "437",
    "title": "Geçerli Bir Lisans Olmadan Hava Aracı Kullanma",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "438",
    "title": "Hava Aracının Dikkatsiz Kullanımı",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 50000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 6 günden fazla olmayacaktır. Para cezası ise $50.000 olacak, PPL askıya alınacak ve taşıta 3 gün el koyulacaktır.",
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "439",
    "title": "ATC Talimatlarına Uymamak",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 60,
        "maxMinutes": 1440,
        "fine": 50000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 1 günden fazla olmayacaktır. Para cezası ise $50.000 olacaktır.",
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "440",
    "title": "Hava Aracıyla Kaçma",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 100000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır. Para cezası ise $100.000 olacak ve taşıta 7 gün el koyulacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "441",
    "title": "Bisikletin Dikkatsiz Kullanımı",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $2.500 para cezası ile cezalandırılacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "442",
    "title": "Vespucci Beach'te İzinsiz Taşıt Kullanımı",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 2500,
        "offenseFines": [
          2500,
          5000
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $2.500 para cezası\n2. $5.000 para cezası\n3. 3 günlüğüne taşıta el koyulacaktır, 3 günlüğüne lisans askıya alınacaktır ve $7.500 para cezası",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "443",
    "title": "Sokağı İşgal Etme",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 5,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 20000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 3 günden fazla olmayacaktır. Para cezası ise $20.000 olacaktır, araç 7 günlüğüne bağlanacak ve sürücü lisansına 7 günlüğüne el koyulacaktır.\nSuçlu kasıtlı olarak motorlu bir taşıt veya bisiklet ile kaçtığı veya kaçmaya teşebbüs ettiği takdirde 115. Kolluk Kuvvetlerinden Kaçmak maddesi ek suçlama olarak eklenir, araca 14 gün süreyle el koyulur.\nSuçlu kasıtlı olarak yaya bir şekilde kaçtığı veya kaçmaya teşebbüs ettiği takdirde 116. Tutuklamaya Direnmek maddesi ek suçlama olarak eklenir.",
    "bail": {
      "amount": 350000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "444",
    "title": "Araçlarda Işık Kontrolü",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 500,
        "offenseFines": [
          500,
          2500
        ]
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır ve aşağıdaki suç sayısı kriterlerine göre para cezası ile cezalandırılacaktır:\n1. $500 para cezası\n2. $2.500 para cezası\n3. 2 günlüğüne taşıta, 2 günlüğüne lisansa el koyulacaktır ve $7.500 para cezası yanında araçtan ilgili ekipmanların sökümü iadesiz olarak sağlanacaktır.\nSuçun devam etmesi halinde üçüncü cezaya dönülür ve ceza işlenmeye devam eder.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "501",
    "title": "Teşhircilik",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.",
    "bail": {
      "amount": 300000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "502",
    "title": "Kamu İçinde Uygunsuz veya Ahlaksız Davranış",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.",
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "503",
    "title": "Fuhuş",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 1440,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 1 günden fazla olmayacaktır.",
    "bail": {
      "amount": 150000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "504",
    "title": "Fuhuşa Teşvik",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "505",
    "title": "Tacizci Takip",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.",
    "bail": {
      "amount": 400000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "506",
    "title": "Kumar Dolandırıcılığı",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 720,
        "maxMinutes": 1440,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "Toplam değer $10.000'ı aşmıyorsa C Sınıfı misdemeanor. Hapis cezası 12 saatten az 1 günden fazla olmayacaktır.\nToplam değer $10.000'ı aşıyorsa C Sınıfı (2) felony. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.\nNot: \"Hileli bir şekilde elde etmek\", bahis veya bahis miktarını değiştirmeyi, oyun kuralları tarafından onaylanmayan bir teknik veya cihaz aracılığıyla haksız avantaj elde etmeyi de içerir.",
    "bail": {
      "amount": 450000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "507",
    "title": "Çocuk İstismarı",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 7,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "B",
        "type": "F",
        "points": 5,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (7) veya B Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "508",
    "title": "Çocuk İhmali",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (4) veya B Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 6 günden fazla olmayacaktır.",
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "509",
    "title": "Reşit Olmayan Bireye Alkol veya Tütün Satışı",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 120,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 2 saatten az 2 günden fazla olmayacaktır.",
    "bail": {
      "amount": 80000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "510",
    "title": "Reşit Olmadan Alkol veya Tütün Kullanımı",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 2 günden fazla olmayacaktır.",
    "bail": {
      "amount": 50000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "511",
    "title": "Hayvan İstismarı",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 5,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "B",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (5) veya B Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "512",
    "title": "Mahkumla Cinsel İlişkiye Girme",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "bail": {
      "amount": 350000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "601",
    "title": "Kontrollü Madde Üretimi",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 7,
        "minMinutes": 0,
        "maxMinutes": 20160,
        "fine": 50000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (7) felony kapsamında sorumlu tutulacaktır. Ceza yönergeleri:\nA — $50.000'a kadar para cezası ve 14 günden fazla olmamak üzere hapis cezası\nB — $45.000'a kadar para cezası ve 12 günden fazla olmamak üzere hapis cezası\nC — $40.000'a kadar para cezası ve 10 günden fazla olmamak üzere hapis cezası\nD — $20.000'a kadar para cezası ve 8 günden fazla olmamak üzere hapis cezası\nT — $15.000'a kadar para cezası ve 3 günden fazla olmamak üzere hapis cezası",
    "categories": [
      {
        "key": "A",
        "fine": 50000,
        "maxMinutes": 20160,
        "note": ""
      },
      {
        "key": "B",
        "fine": 45000,
        "maxMinutes": 17280,
        "note": ""
      },
      {
        "key": "C",
        "fine": 40000,
        "maxMinutes": 14400,
        "note": ""
      },
      {
        "key": "D",
        "fine": 20000,
        "maxMinutes": 11520,
        "note": ""
      },
      {
        "key": "T",
        "fine": 15000,
        "maxMinutes": 4320,
        "note": ""
      }
    ],
    "bail": {
      "amount": 470000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "602",
    "title": "Kontrollü Madde Bulundurmak",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 1200,
        "fine": 4500,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Ceza yönergeleri:\nA — $4.500'a kadar para cezası ve 20 saatten fazla olmamak üzere hapis cezası\nB — $3.750'a kadar para cezası ve 15 saatten fazla olmamak üzere hapis cezası\nC — $3.000'a kadar para cezası ve 10 saatten fazla olmamak üzere hapis cezası\nD — $2.250'a kadar para cezası ve yazılı veya sözlü uyarı\nT — $500'a kadar para cezası ve yazılı veya sözlü uyarı",
    "categories": [
      {
        "key": "A",
        "fine": 4500,
        "maxMinutes": 1200,
        "note": ""
      },
      {
        "key": "B",
        "fine": 3750,
        "maxMinutes": 900,
        "note": ""
      },
      {
        "key": "C",
        "fine": 3000,
        "maxMinutes": 600,
        "note": ""
      },
      {
        "key": "D",
        "fine": 2250,
        "maxMinutes": 0,
        "note": "yazılı veya sözlü uyarı"
      },
      {
        "key": "T",
        "fine": 500,
        "maxMinutes": 0,
        "note": "yazılı veya sözlü uyarı"
      }
    ],
    "bail": {
      "amount": 20000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "603",
    "title": "Kontrollü Maddeyi Dağıtım Amacıyla Bulundurmak",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 2880,
        "fine": 15000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Ceza yönergeleri:\nA — $15.000'a kadar para cezası ve 2 günden fazla olmamak üzere hapis cezası\nB — $10.500'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası\nC — $7.000'a kadar para cezası ve 14 saatten fazla olmamak üzere hapis cezası\nD — $5.250'a kadar para cezası ve 12 saatten fazla olmamak üzere hapis cezası\nT — $1.000'a kadar para cezası ve 6 saatten fazla olmamak üzere hapis cezası",
    "categories": [
      {
        "key": "A",
        "fine": 15000,
        "maxMinutes": 2880,
        "note": ""
      },
      {
        "key": "B",
        "fine": 10500,
        "maxMinutes": 1440,
        "note": ""
      },
      {
        "key": "C",
        "fine": 7000,
        "maxMinutes": 840,
        "note": ""
      },
      {
        "key": "D",
        "fine": 5250,
        "maxMinutes": 720,
        "note": ""
      },
      {
        "key": "T",
        "fine": 1000,
        "maxMinutes": 360,
        "note": ""
      }
    ],
    "bail": {
      "amount": 30000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "604",
    "title": "Kontrollü Madde Satmak",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 0,
        "maxMinutes": 2880,
        "fine": 15000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Ceza yönergeleri:\nA — $15.000'a kadar para cezası ve 2 günden fazla olmamak üzere hapis cezası\nB — $10.500'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası\nC — $7.000'a kadar para cezası ve 14 saatten fazla olmamak üzere hapis cezası\nD — $5.250'a kadar para cezası ve 12 saatten fazla olmamak üzere hapis cezası\nT — $1.000'a kadar para cezası ve 6 saatten fazla olmamak üzere hapis cezası",
    "categories": [
      {
        "key": "A",
        "fine": 15000,
        "maxMinutes": 2880,
        "note": ""
      },
      {
        "key": "B",
        "fine": 10500,
        "maxMinutes": 1440,
        "note": ""
      },
      {
        "key": "C",
        "fine": 7000,
        "maxMinutes": 840,
        "note": ""
      },
      {
        "key": "D",
        "fine": 5250,
        "maxMinutes": 720,
        "note": ""
      },
      {
        "key": "T",
        "fine": 1000,
        "maxMinutes": 360,
        "note": ""
      }
    ],
    "bail": {
      "amount": 70000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "605",
    "title": "Uyuşturucu Kaçakçılığı",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 3,
        "minMinutes": 0,
        "maxMinutes": 5760,
        "fine": 22500,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Ceza yönergeleri:\nA — $22.500'a kadar para cezası ve 4 günden fazla olmamak üzere hapis cezası\nB — $18.750'a kadar para cezası ve 3 günden fazla olmamak üzere hapis cezası\nC — $15.000'a kadar para cezası ve 2 günden fazla olmamak üzere hapis cezası\nD — $11.500'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası\nT — $4.000'a kadar para cezası ve 10 saatten fazla olmamak üzere hapis cezası",
    "categories": [
      {
        "key": "A",
        "fine": 22500,
        "maxMinutes": 5760,
        "note": ""
      },
      {
        "key": "B",
        "fine": 18750,
        "maxMinutes": 4320,
        "note": ""
      },
      {
        "key": "C",
        "fine": 15000,
        "maxMinutes": 2880,
        "note": ""
      },
      {
        "key": "D",
        "fine": 11500,
        "maxMinutes": 1440,
        "note": ""
      },
      {
        "key": "T",
        "fine": 4000,
        "maxMinutes": 600,
        "note": ""
      }
    ],
    "bail": {
      "amount": 80000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "606",
    "title": "Uyuşturucu Ticareti",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 5,
        "minMinutes": 0,
        "maxMinutes": 10080,
        "fine": 45000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Ceza yönergeleri:\nA — $45.000'a kadar para cezası ve 7 günden fazla olmamak üzere hapis cezası\nB — $37.500'a kadar para cezası ve 6 günden fazla olmamak üzere hapis cezası\nC — $30.000'a kadar para cezası ve 5 günden fazla olmamak üzere hapis cezası\nD — $22.500'a kadar para cezası ve 4 günden fazla olmamak üzere hapis cezası\nT — $8.000'a kadar para cezası ve 1 günden fazla olmamak üzere hapis cezası\nNot: Gözaltına alındığında veya tutuklandığında bulunan her 75 gram için cezasına ek 12 saat eklenecektir.",
    "categories": [
      {
        "key": "A",
        "fine": 45000,
        "maxMinutes": 10080,
        "note": ""
      },
      {
        "key": "B",
        "fine": 37500,
        "maxMinutes": 8640,
        "note": ""
      },
      {
        "key": "C",
        "fine": 30000,
        "maxMinutes": 7200,
        "note": ""
      },
      {
        "key": "D",
        "fine": 22500,
        "maxMinutes": 5760,
        "note": ""
      },
      {
        "key": "T",
        "fine": 8000,
        "maxMinutes": 1440,
        "note": ""
      }
    ],
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "607",
    "title": "Uyuşturucu Aletlerini Bulundurma",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 1440,
        "maxMinutes": 4320,
        "fine": 4500,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Para cezası $4.500 olacaktır.\nEğer cihazlar veya aletler, C.K. 605 Uyuşturucu Kaçakçılığı ve C.K. 606 Uyuşturucu Ticareti suçunun işlenmesi sırasında kullanıldıysa C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "609",
    "title": "Yasa Dışı Dinleme",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 5760,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 4 günden fazla olmayacaktır.",
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "610",
    "title": "Yüzün Gizlenmesi",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 60,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 1 saatten az 2 günden fazla olmayacaktır.",
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "611",
    "title": "Yangın Yönetmeliği İhlali",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 3000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $3.000 para cezası ile cezalandırılacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "612",
    "title": "Çevrenin Kirletilmesi",
    "variants": [
      {
        "cls": "C",
        "type": "I",
        "points": 0,
        "minMinutes": 0,
        "maxMinutes": 0,
        "fine": 1000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı infraction kapsamında sorumlu tutulacaktır. $1.000 para cezası ile cezalandırılacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "613",
    "title": "SRCB İhlali",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 600,
        "maxMinutes": 600,
        "fine": 50000,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 10 saat ve para cezası $50.000 olacaktır.",
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "701",
    "title": "İzinsiz Ateşli Silah Bulundurma",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 240,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 4 saatten fazla olmayacaktır.",
    "bail": {
      "amount": 400000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "702",
    "title": "Yasaklı Ateşli Silah Bulundurma",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 6 günden fazla olmayacaktır.",
    "bail": {
      "amount": 400000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "703",
    "title": "Ağırlaştırılmış Silah Bulundurma",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 5,
        "minMinutes": 5760,
        "maxMinutes": 14400,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 10 günden fazla olmayacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "704",
    "title": "Patlayıcı veya Yanıcı Cihazların Bulundurulması",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 5760,
        "maxMinutes": 11520,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 4 günden az 8 günden fazla olmayacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "705",
    "title": "Yasal Olmayan Ateşli Silah ve Patlayıcı Maddelerin Satışı",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "bail": {
      "amount": 800000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "706",
    "title": "Ölümcül Silahın Sergilenmesi",
    "variants": [
      {
        "cls": "B",
        "type": "F",
        "points": 3,
        "minMinutes": 1440,
        "maxMinutes": 7200,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "B Sınıfı (3) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 5 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "707",
    "title": "Ateşli Silahların Kamu Alanında Ateşlenmesi",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 2880,
        "maxMinutes": 11520,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 8 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "708",
    "title": "Silahla Motorlu Taşıttan Ateş Etmek",
    "variants": [
      {
        "cls": "A",
        "type": "F",
        "points": 7,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "B",
        "type": "F",
        "points": 5,
        "minMinutes": 2880,
        "maxMinutes": 7200,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "A Sınıfı (7) veya B Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  },
  {
    "number": "709",
    "title": "Ateşli Silahların Dikkatsiz Kullanımı",
    "variants": [
      {
        "cls": "B",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 5760,
        "fine": 0,
        "offenseFines": []
      },
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 360,
        "maxMinutes": 5760,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "B Sınıfı veya C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 6 saatten az 4 günden fazla olmayacaktır.",
    "bail": {
      "amount": 250000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "710",
    "title": "SHAFT İhlali",
    "variants": [
      {
        "cls": "C",
        "type": "M",
        "points": 0,
        "minMinutes": 180,
        "maxMinutes": 2880,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı misdemeanor kapsamında sorumlu tutulacaktır. Hapis cezası 3 saatten az 2 günden fazla olmayacaktır.",
    "bail": {
      "amount": 100000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "711",
    "title": "Felony Hükümlüsünün Silah Bulundurması",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 5,
        "minMinutes": 1440,
        "maxMinutes": 5760,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (5) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 4 günden fazla olmayacaktır.",
    "bail": {
      "amount": 800000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "712",
    "title": "Felony Hükümlüsünün Mühimmat Bulundurması",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 2,
        "minMinutes": 1440,
        "maxMinutes": 5760,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (2) felony kapsamında sorumlu tutulacaktır. Hapis cezası 1 günden az 4 günden fazla olmayacaktır.",
    "bail": {
      "amount": 200000,
      "auto": true,
      "optional": false
    }
  },
  {
    "number": "713",
    "title": "Hapishanede Ölümcül Silah Bulundurmak",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 10080,
        "maxMinutes": 12960,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "C Sınıfı (4) felony kapsamında sorumlu tutulacaktır. Hapis cezası 7 günden az 9 günden fazla olmayacaktır.",
    "bail": {
      "amount": 500000,
      "auto": true,
      "optional": true
    }
  },
  {
    "number": "714",
    "title": "Okul Sınırları İçerisinde Silah Bulundurmak",
    "variants": [
      {
        "cls": "C",
        "type": "F",
        "points": 4,
        "minMinutes": 2880,
        "maxMinutes": 8640,
        "fine": 0,
        "offenseFines": []
      }
    ],
    "classification": "Madde (a) ihlalinde C Sınıfı (4) felony. Hapis cezası 2 günden az 6 günden fazla olmayacaktır.\nMadde (c) ihlalinde C Sınıfı (3) felony. Hapis cezası 2 günden az 5 günden fazla olmayacaktır.\nDiğer maddelerin ihlalinde C Sınıfı misdemeanor. Hapis cezası 1 günden az 3 günden fazla olmayacaktır.",
    "bail": {
      "amount": 0,
      "auto": false,
      "optional": false
    }
  }
];
