import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import { Spot } from "@/data/mockData";

const Review = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = ["環境", "清潔", "親切", "楽しい", "安全"];

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`api/spots/${id}`);

        if (response.status === 200) {
          setSpot(response.data.data);
        }
      } catch (error) {
        toast.error("スポットの取得に失敗しました");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSpot();
    }
  }, [id]);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("評価を選択してください");
      return;
    }
    if (!comment.trim()) {
      toast.error("コメントを入力してください");
      return;
    }
    toast.success("レビューを投稿しました！");
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>スポットが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          戻る
        </Button>

        <h1 className="text-2xl font-bold mb-6">{spot.name} - レビュー</h1>
        <p className="text-muted-foreground mb-8">
          この場所についての詳細な体験を共有しましょう！
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">レビューを投稿</h2>

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">場所: {spot.name}</Label>
                <p className="text-sm text-muted-foreground">投稿者: Kim</p>
              </div>

              <div>
                <Label className="mb-2 block">評価</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm self-center">
                      {rating} / 5
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="comment" className="mb-2 block">
                  体験・コメント
                </Label>
                <Textarea
                  id="comment"
                  placeholder="この場所での体験を共有してください。 
例：子供が楽しめた、設備が綺麗だった、アクセスが便利など"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-32"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                  レビューを投稿
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRating(0);
                    setComment("");
                    setSelectedTags([]);
                  }}
                >
                  リセット
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">レビュー検索</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="レビューを検索"
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <Button variant="outline">新しい順</Button>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="font-semibold">最近のレビュー</h3>
              {spot.reviews.map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium">{review.userName}</p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating ? "fill-current" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs">{review.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {review.comment}
                  </p>
                  <div className="flex gap-2 mb-2">
                    {review.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>
                      Posted by {review.userName} • {review.date}
                    </span>
                    <div className="flex gap-2">
                      <button className="text-primary hover:underline">
                        編集
                      </button>
                      <button className="text-destructive hover:underline">
                        削除
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
