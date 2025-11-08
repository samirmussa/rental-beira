// app/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, Shield, Phone, MapPin, Home as HomeIcon, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [busca, setBusca] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl">
                <HomeIcon className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              Arrenda Beira
            </h1>
            
            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto opacity-95 leading-relaxed px-2">
              Encontre ou anuncie casas para arrendamento na cidade da Beira com segurança, transparência e facilidade.
            </p>

            {/* Search Bar */}
            

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
              <Link href="/register" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-xl sm:rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Começar Agora
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold rounded-xl sm:rounded-2xl transition-all duration-200 transform hover:scale-105"
                >
                  Fazer Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Por que escolher Arrenda Beira?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Card Segurança */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 bg-blue-100 rounded-2xl text-blue-600">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-gray-800">
                  Anúncios Verificados
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Todos os imóveis passam por verificação para garantir sua segurança e confiança.
                </p>
              </div>

              {/* Card Contato */}
              <div className="bg-gradient-to-br from-green-50 to-teal-100 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 bg-green-100 rounded-2xl text-green-600">
                    <Phone className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-gray-800">
                  Contato Direto
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Converse diretamente com proprietários via WhatsApp ou telefone, sem intermediários.
                </p>
              </div>

              {/* Card Mapa */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 md:col-span-2 lg:col-span-1">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 bg-purple-100 rounded-2xl text-purple-600">
                    <MapPin className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-gray-800">
                  Mapa Interativo
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Visualize a localização exata de cada imóvel no mapa detalhado da cidade da Beira.
                </p>
              </div>
            </div>

            {/* Additional Info */}
           
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Pronto para encontrar seu novo lar?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90">
              Junte-se a milhares de pessoas que já encontraram o imóvel perfeito na Beira.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-xl sm:rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Criar Conta Grátis
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold rounded-xl sm:rounded-2xl transition-all duration-200 transform hover:scale-105"
                >
                  Saiba Mais
                </Button>
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>100% Seguro</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Suporte 24/7</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Foco na Beira</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HomeIcon className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold">Arrenda Beira</span>
            </div>
            <p className="text-gray-400 text-sm sm:text-base mb-4">
              A melhor plataforma de arrendamento da cidade da Beira
            </p>
            <div className="text-gray-500 text-xs sm:text-sm">
              © 2026 Arrenda Beira. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}