export interface Spot {
  id: string;
  name: string;
  category: string;
  address: string;
  distance: string;
  hours: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: string;
  phone: string;
  description: string;
  features: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  tags: string[];
}

export const mockSpots: Spot[] = [
  {
    id: "1",
    name: "ワンダーランド屋内遊園",
    category: "公園",
    address: "東京都中央区",
    distance: "3.23 km",
    hours: "09:00 - 22:00",
    image: "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800",
    rating: 4.5,
    reviewCount: 128,
    price: "¥1,500",
    phone: "03-XXXX-XXXX",
    description:
      "子供たちが楽しめる屋内遊園地です。安全で清潔な環境で、様々な遊具があります。",
    features: ["屋内", "駐車場", "WiFi", "授乳室"],
    reviews: [],
  },
  {
    id: "2",
    name: "トーキョーモール",
    category: "カフェ",
    address: "渋谷区神南1丁目",
    distance: "1.5 km",
    hours: "10:00 - 21:00",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800",
    rating: 4.8,
    reviewCount: 256,
    price: "¥2,000",
    phone: "03-XXXX-XXXX",
    description: "おしゃれなカフェとショップが集まるモールです。",
    features: ["カフェ", "レストラン", "ショップ", "駐車場"],
    reviews: [],
  },
  {
    id: "3",
    name: "リタカフェ",
    category: "カフェ",
    address: "東京都世田谷区",
    distance: "0.8 km",
    hours: "08:00 - 20:00",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
    rating: 4.6,
    reviewCount: 89,
    price: "¥800",
    phone: "03-XXXX-XXXX",
    description: "静かで落ち着いた雰囲気のカフェです。",
    features: ["WiFi", "電源", "禁煙"],
    reviews: [],
  },
  {
    id: "4",
    name: "アドベンチャー動物園",
    category: "動物園",
    address: "東京都台東区",
    distance: "3.2 km",
    hours: "10:00 - 17:00",
    image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800",
    rating: 4.7,
    reviewCount: 342,
    price: "¥1,500",
    phone: "03-XXXX-XXXX",
    description: "様々な動物を見ることができる動物園です。",
    features: ["駐車場", "レストラン", "授乳室", "ベビーカー"],
    reviews: [],
  },
  {
    id: "5",
    name: "グリーンパーク",
    category: "公園",
    address: "東京都中目黒区",
    distance: "1.8 km",
    hours: "06:00 - 18:00",
    image: "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800",
    rating: 4.7,
    reviewCount: 156,
    price: "無料",
    phone: "03-XXXX-XXXX",
    description: "はっきりとそこにいて、子どもたちと楽しく過ごしてください。",
    features: ["遊具", "芝生", "トイレ", "駐車場"],
    reviews: [
      {
        id: "r1",
        userName: "Kim",
        rating: 5,
        date: "2025-10-20",
        comment: "はっきりとそこにいて、子どもたちと楽しく過ごしてください。",
        tags: ["環境", "清潔", "親切"],
      },
      {
        id: "r2",
        userName: "山田太郎",
        rating: 5,
        date: "2025-10-10",
        comment: "子供がパンダを見て大喜びでした！また行きたいです",
        tags: ["楽しい"],
      },
    ],
  },
  {
    id: "6",
    name: "キッズパークランド",
    category: "公園",
    address: "東京都品川区",
    distance: "2.7 km",
    hours: "10:00 - 19:00",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
    rating: 4.5,
    reviewCount: 234,
    price: "¥1,000",
    phone: "03-XXXX-XXXX",
    description:
      "子どもたちのためのテーマパークです。ブランコ、トランポリン、ボールプールなどのアクティビティがあります。",
    features: ["トイレ", "駐車場", "カフェ", "休憩室", "オムツ替え"],
    reviews: [
      {
        id: "r3",
        userName: "田中花子",
        rating: 5,
        date: "2025-10-15",
        comment:
          "とてもきれいで、施設も充実していました。スタッフも親切でよかったです。",
        tags: ["環境", "親切", "清潔"],
      },
    ],
  },
];

export const mockUser = {
  email: "example@email.com",
  password: "12345678",
  name: "たなか れいこ",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
};
