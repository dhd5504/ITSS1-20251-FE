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
import { useAuth } from "@/contexts/AuthContext";

const formatDateTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Review = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingReview, setEditingReview] = useState<{
    id: string;
    rating: number;
    content: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "highest">(
    "newest"
  );
  const { user } = useAuth();

  const tags = ["環境", "清潔", "親切", "楽しい", "安全"];

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

  useEffect(() => {
    if (id) {
      fetchSpot();
    }
  }, [id]);

  const canModifyReview = (reviewUserId?: string) => {
    if (!user) return false;
    const currentId = (user.id ?? "").toString().trim().toLowerCase();
    if (!reviewUserId) return false;
    const targetId = reviewUserId.toString().trim().toLowerCase();
    return targetId === currentId;
  };

  const handleDeleteReview = (reviewId: string) => {
    toast.custom(
      (t) => (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => toast.dismiss(t)}
          />
          {/* Toast content */}
          <div className="relative z-50 bg-white rounded-lg shadow-xl p-5 max-w-sm">
            <p className="text-sm mb-4 text-center">
              本当にこのレビューを削除しますか？
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                className="flex-1 text-sm"
                onClick={async () => {
                  toast.dismiss(t);
                  try {
                    const res = await apiClient.delete(
                      `api/spots/${spot?.id}/reviews/${reviewId}`,
                      { withCredentials: true }
                    );
                    if (res.status === 200) {
                      toast.success("レビューを削除しました");
                      fetchSpot();
                    }
                  } catch (error) {
                    console.error(error);
                    toast.error("レビューを削除できませんでした");
                  }
                }}
              >
                削除
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-sm"
                onClick={() => toast.dismiss(t)}
              >
                キャンセル
              </Button>
            </div>
          </div>
        </>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  const handleEditReview = (
    reviewId: string,
    currentRating: number,
    currentContent: string
  ) => {
    setEditingReview({
      id: reviewId,
      rating: currentRating,
      content: currentContent,
    });
    setRating(currentRating);
    setComment(currentContent);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("評価を選択してください");
      return;
    }
    if (!comment.trim()) {
      toast.error("コメントを入力してください");
      return;
    }

    try {
      if (editingReview) {
        // Update existing review
        const res = await apiClient.put(
          `api/spots/${spot?.id}/reviews/${editingReview.id}`,
          { rating, content: comment },
          { withCredentials: true }
        );
        if (res.status === 200) {
          toast.success("レビューを更新しました");
          setEditingReview(null);
          setRating(0);
          setComment("");
          fetchSpot();
        }
      } else {
        // Create new review
        const res = await apiClient.post(
          `api/spots/${id}/reviews`,
          { rating, content: comment },
          { withCredentials: true }
        );
        if (res.status === 200) {
          toast.success("レビューを投稿しました！");
          navigate(-1);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(
        editingReview
          ? "レビューを更新できませんでした"
          : "レビューを投稿できませんでした"
      );
    }
  };

  const getFilteredAndSortedReviews = () => {
    if (!spot?.reviews) return [];

    // Filter by search query
    let filtered = spot.reviews.filter((review) => {
      const searchLower = searchQuery.toLowerCase();
      const commentMatch = review.comment?.toLowerCase().includes(searchLower);
      const userMatch = review.userName?.toLowerCase().includes(searchLower);
      return commentMatch || userMatch;
    });

    // Sort reviews
    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === "newest") {
        return (
          new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
        );
      } else if (sortOption === "oldest") {
        return (
          new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
        );
      } else if (sortOption === "highest") {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });

    return sorted;
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
            <h2 className="text-lg font-semibold mb-4">
              {editingReview ? "レビューを編集" : "レビューを投稿"}
            </h2>

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">場所: {spot.name}</Label>
                <p className="text-sm text-muted-foreground">
                  投稿者: {user.username}
                </p>
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
                  {editingReview ? "レビューを更新" : "レビューを投稿"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRating(0);
                    setComment("");
                    setSelectedTags([]);
                    setEditingReview(null);
                  }}
                >
                  {editingReview ? "キャンセル" : "リセット"}
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">レビュー検索</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="レビューを検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <select
                  value={sortOption}
                  onChange={(e) =>
                    setSortOption(
                      e.target.value as "newest" | "oldest" | "highest"
                    )
                  }
                  className="px-3 py-2 border rounded-md bg-white"
                >
                  <option value="newest">新しい順</option>
                  <option value="oldest">古い順</option>
                  <option value="highest">評価が高い順</option>
                </select>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="font-semibold">最近のレビュー</h3>
              {getFilteredAndSortedReviews().length === 0 ? (
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    {searchQuery
                      ? "検索結果が見つかりませんでした"
                      : "レビューがまだありません"}
                  </p>
                </Card>
              ) : (
                getFilteredAndSortedReviews().map((review) => (
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
                        投稿者 {review.userName} •{" "}
                        {formatDateTime(review.date as string)}
                      </span>
                      {canModifyReview(review.userId as string) && (
                        <div className="flex gap-2">
                          <button
                            className="text-primary hover:underline"
                            onClick={() =>
                              handleEditReview(
                                review.id as string,
                                review.rating as number,
                                (review.comment as string) || ""
                              )
                            }
                          >
                            編集
                          </button>
                          <button
                            className="text-destructive hover:underline"
                            onClick={() =>
                              handleDeleteReview(review.id as string)
                            }
                          >
                            削除
                          </button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
