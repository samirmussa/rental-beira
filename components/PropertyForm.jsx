'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import MapComponent from './MapComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner'; // opcional: npx shadcn-ui@latest add toast

export default function PropertyForm() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [imagens, setImagens] = useState([]);
  const [position, setPosition] = useState({ lat: 0, lng: 0 });

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    preco: '',
    tipo: '',
    area: '',
    quartos: '',
    wc: '',
    bairro: '',
    endereco: '',
    telefone: '',
    whatsapp: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return data.url;
    });

    const urls = await Promise.all(uploadPromises);
    setImagens((prev) => [...prev, ...urls]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position.lat || !session?.user) return;

    setLoading(true);
    try {
      const res = await fetch('/api/imoveis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          preco: Number(form.preco),
          area: Number(form.area),
          quartos: Number(form.quartos),
          wc: Number(form.wc),
          coordenadas: position,
          imagens,
          proprietario: session.user.id,
          contato: {
            telefone: form.telefone,
            whatsapp: form.whatsapp,
            email: session.user.email,
          },
        }),
      });

      if (res.ok) {
        toast.success('Imóvel cadastrado com sucesso!');
        // reset form
      } else {
        toast.error('Erro ao cadastrar');
      }
    } catch (err) {
      toast.error('Erro interno');
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Cadastrar Novo Imóvel para Arrendamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Título do Anúncio</Label>
              <Input name="titulo" value={form.titulo} onChange={handleChange} required />
            </div>
            <div>
              <Label>Preço (MZN)</Label>
              <Input name="preco" type="number" value={form.preco} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea name="descricao" value={form.descricao} onChange={handleChange} rows={3} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select onValueChange={(v) => setForm({ ...form, tipo: v })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="T1">T1</SelectItem>
                  <SelectItem value="T2">T2</SelectItem>
                  <SelectItem value="T3">T3</SelectItem>
                  <SelectItem value="T4">T4</SelectItem>
                  <SelectItem value="Apartamento">Apartamento</SelectItem>
                  <SelectItem value="Moradia">Moradia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quartos</Label>
              <Input name="quartos" type="number" value={form.quartos} onChange={handleChange} />
            </div>
            <div>
              <Label>WC</Label>
              <Input name="wc" type="number" value={form.wc} onChange={handleChange} />
            </div>
            <div>
              <Label>Área (m²)</Label>
              <Input name="area" type="number" value={form.area} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Bairro</Label>
              <Input name="bairro" value={form.bairro} onChange={handleChange} required />
            </div>
            <div>
              <Label>Endereço Completo (opcional)</Label>
              <Input name="endereco" value={form.endereco} onChange={handleChange} />
            </div>
          </div>

          <div>
            <Label>Localização no Mapa (clique para marcar)</Label>
            <MapComponent position={position} setPosition={setPosition} height="400px" />
          </div>

          <div>
            <Label>Fotos do Imóvel</Label>
            <Input type="file" multiple accept="image/*" onChange={handleImageUpload} />
            <div className="flex flex-wrap gap-2 mt-2">
              {imagens.map((url, i) => (
                <img key={i} src={url} alt="" className="w-24 h-24 object-cover rounded" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Telefone</Label>
              <Input name="telefone" value={form.telefone} onChange={handleChange} />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input name="whatsapp" value={form.whatsapp} onChange={handleChange} />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !position.lat}>
            {loading ? 'Salvando...' : 'Publicar Imóvel'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}