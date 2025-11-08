'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, Home, Smartphone } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Email ou senha incorretos');
      setIsLoading(false);
      return;
    }

    const sessionRes = await fetch('/api/auth/session');
    const session = await sessionRes.json();

    if (!session?.user?.role) {
      setError('Erro ao obter perfil do usuário');
      setIsLoading(false);
      return;
    }

    if (session.user.role === 'admin') {
      router.push('/admin');
    } else if (session.user.role === 'proprietario') {
      router.push('/proprietarios');
    } else {
      router.push('/arrendatarios');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-3 sm:p-4 md:p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] sm:bg-[size:40px_40px] lg:bg-[size:60px_60px]" />
      
      {/* Mobile First Design */}
      <div className="w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg">
        <Card className="w-full bg-slate-800/80 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <CardHeader className="text-center space-y-3 sm:space-y-4 pb-6 sm:pb-8">
            {/* Logo Icon - Responsive sizing */}
            <div className="flex justify-center">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl sm:rounded-2xl">
                <Home className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            
            {/* Title - Responsive text sizing */}
            <div className="space-y-1 sm:space-y-2">
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Arrenda Beira
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-400 px-2">
                Entre na sua conta para continuar
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="px-3 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                {/* Email Field */}
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm text-gray-300 font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@gmail.com"
                      required
                      className="pl-7 sm:pl-10 pr-3 text-sm sm:text-base h-10 sm:h-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="password" className="text-xs sm:text-sm text-gray-300 font-medium">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      required
                      className="pl-7 sm:pl-10 pr-10 text-sm sm:text-base h-10 sm:h-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 sm:right-3 top-2.5 sm:top-3 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? 
                        <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" /> : 
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-2 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-xs sm:text-sm text-center">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full text-sm sm:text-base h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs sm:text-sm">Entrando...</span>
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>

              {/* Register Link */}
              <div className="text-center pt-3 sm:pt-4 border-t border-slate-700/50">
                <p className="text-gray-400 text-xs sm:text-sm">
                  Não tem conta?{' '}
                  <a 
                    href="/register" 
                    className="text-blue-400 font-medium hover:text-blue-300 transition-colors duration-200 hover:underline"
                  >
                    Cadastre-se
                  </a>
                </p>
              </div>

              {/* Mobile App Hint */}
              <div className="flex items-center justify-center gap-2 pt-2 sm:hidden">
                <Smartphone className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">Também disponível no app</span>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}