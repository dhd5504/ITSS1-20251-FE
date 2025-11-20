import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import authBackground from "@/assets/auth-background.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(formData.email, formData.password);
    if (success) {
      toast.success("ログインに成功しました");
      navigate("/home");
    } else {
      toast.error("メールアドレスまたはパスワードが間違っています");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-auth-background relative overflow-hidden"
      style={{
        backgroundImage: `url(${authBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className="text-3xl font-bold text-white mb-8">Welcome to App</h1>
      
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="pt-8 pb-6 px-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-auth-gradient-start to-auth-gradient-end flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">ログイン</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                メールアドレス
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                パスワード
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                ログイン状態を保持する
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-auth-gradient-start to-auth-gradient-end hover:opacity-90 transition-opacity font-medium h-11"
            >
              ログイン
            </Button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              アカウントをお持ちでないですか{" "}
              <Link
                to="/signup"
                className="text-primary font-medium hover:underline"
              >
                新規登録
              </Link>
            </p>
            <Link
              to="/forgot-password"
              className="block text-sm text-primary font-medium hover:underline"
            >
              パスワードを忘れた？
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
