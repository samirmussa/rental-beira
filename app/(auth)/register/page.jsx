'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { User, Mail, Lock, Phone, Home, Building, UserPlus, Eye, EyeOff, Smartphone } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) {
      toast.error('Escolha se é Proprietário ou Arrendatário');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Cadastro realizado com sucesso! Faça login.');
        router.push('/login');
      } else {
        toast.error(data.error || 'Erro no cadastro');
      }
    } catch (err) {
      toast.error('Erro de conexão');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] sm:bg-[size:40px_40px] lg:bg-[size:60px_60px]" />
      
      {/* Responsive Container */}
      <div className="w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl">
        <Card className="w-full bg-slate-800/80 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <CardHeader className="text-center space-y-3 sm:space-y-4 pb-6 sm:pb-8">
            {/* Logo Icon */}
            <div className="flex justify-center">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl sm:rounded-2xl">
                <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            
            {/* Title */}
            <div className="space-y-1 sm:space-y-2">
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Criar Conta
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-400 px-2">
                Junte-se à nossa plataforma de arrendamento
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="px-3 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Grid Layout for Larger Screens */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                
                {/* Left Column */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Name Field */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="nome" className="text-xs sm:text-sm text-gray-300 font-medium">
                      Nome Completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <Input
                        id="nome"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        required
                        placeholder="samir sulemane"
                        className="pl-7 sm:pl-10 text-sm sm:text-base h-10 sm:h-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm text-gray-300 font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="samir@exemplo.com"
                        className="pl-7 sm:pl-10 text-sm sm:text-base h-10 sm:h-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="telefone" className="text-xs sm:text-sm text-gray-300 font-medium">
                      Telefone / WhatsApp
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <Input
                        id="telefone"
                        name="telefone"
                        value={form.telefone}
                        onChange={handleChange}
                        placeholder="84 99999 9999"
                        className="pl-7 sm:pl-10 text-sm sm:text-base h-10 sm:h-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Password Field */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="senha" className="text-xs sm:text-sm text-gray-300 font-medium">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <Input
                        id="senha"
                        name="senha"
                        type={showPassword ? 'text' : 'password'}
                        value={form.senha}
                        onChange={handleChange}
                        required
                        minLength={6}
                        placeholder="Mínimo 6 caracteres"
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

                  {/* Role Select */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="role" className="text-xs sm:text-sm text-gray-300 font-medium">
                      Você é:
                    </Label>
                    <Select onValueChange={(value) => setForm({ ...form, role: value })} required>
                      <SelectTrigger className="text-sm sm:text-base h-10 sm:h-12 bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Escolha uma opção" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600 text-white">
                        <SelectItem value="proprietario" className="text-xs sm:text-sm focus:bg-slate-700 py-2 sm:py-3">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Building className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Proprietário (quero arrendar)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="arrendatario" className="text-xs sm:text-sm focus:bg-slate-700 py-2 sm:py-3">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Arrendatário (quero alugar)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Submit Button - Full width on all screens */}
              <div className="pt-2 sm:pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full text-sm sm:text-base h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                >
                  {loading ? (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs sm:text-sm">Criando conta...</span>
                    </div>
                  ) : (
                    'Cadastrar'
                  )}
                </Button>
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4 sm:pt-6 border-t border-slate-700/50 mt-4 sm:mt-6">
              <p className="text-gray-400 text-xs sm:text-sm">
                Já tem conta?{' '}
                <a 
                  href="/login" 
                  className="text-blue-400 font-medium hover:text-blue-300 transition-colors duration-200 hover:underline"
                >
                  Faça login
                </a>
              </p>
            </div>

            {/* Mobile App Hint */}
            <div className="flex items-center justify-center gap-2 pt-3 sm:hidden">
              <Smartphone className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500">Também disponível no app</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}