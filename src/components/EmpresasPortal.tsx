import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Building2, Phone, Mail, CheckCircle2, Award, Sparkles, Send, Download, Copy, ExternalLink, MessageSquare, BadgePercent } from 'lucide-react';
import { INOLVIDABLE_STATION_INFO, BUSINESS_PACKS } from '../data/mockData';
import { BusinessContactForm } from '../types';

interface EmpresasPortalProps {
  onClose: () => void;
}

export const EmpresasPortal: React.FC<EmpresasPortalProps> = ({ onClose }) => {
  const [qrType, setQrType] = useState<'empresas' | 'whatsapp' | 'dossier' | 'promo'>('empresas');
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [simulatedScanResult, setSimulatedScanResult] = useState<string | null>(null);

  const [formData, setFormData] = useState<BusinessContactForm>({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    packSelected: 'Plan Éxito Inolvidable (TDT + HD)',
    message: '',
  });

  const getQrUrl = () => {
    switch (qrType) {
      case 'whatsapp':
        return `https://wa.me/34600009480?text=${encodeURIComponent('Hola Inolvidable FM Empresas, quiero información sobre publicidad en TDT')}`;
      case 'dossier':
        return 'https://www.inolvidablefm.com/dossier-comercial-2026.pdf';
      case 'promo':
        return 'https://www.inolvidablefm.com/oferta-tdt-descuento-30';
      case 'empresas':
      default:
        return INOLVIDABLE_STATION_INFO.empresasUrl;
    }
  };

  const qrTargetUrl = getQrUrl();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrTargetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        companyName: '',
        contactName: '',
        phone: '',
        email: '',
        packSelected: 'Plan Éxito Inolvidable (TDT + HD)',
        message: '',
      });
    }, 3500);
  };

  const handleSimulateScan = () => {
    setSimulatedScanResult(`¡Escaneo de prueba simulado con éxito! Destino: ${qrTargetUrl}`);
    setTimeout(() => setSimulatedScanResult(null), 4000);
  };

  return (
    <div className="flex flex-col gap-6 text-white animate-fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 p-6 rounded-2xl border-2 border-blue-500/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-blue-900/50">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white font-black text-xs px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                BOTÓN AZUL
              </span>
              <span className="bg-blue-900/80 text-blue-300 border border-blue-700/60 text-xs font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Inolvidable FM Empresas TDT
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              Portal Corporativo & Publicidad en TDT
            </h2>
            <p className="text-xs text-slate-300">
              Conecte su negocio con más de 120.000 oyentes y telespectadores diarios en toda Canarias
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl transition font-bold"
        >
          Cerrar Portal
        </button>
      </div>

      {/* Main Grid: QR Code Demo + Advertising Rate Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: QR Code Demo Box */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col items-center text-center justify-between gap-6 shadow-xl">
          <div className="w-full">
            <div className="flex items-center justify-center gap-2 text-blue-400 font-bold text-sm mb-1 uppercase tracking-wider">
              <QrCode className="w-5 h-5" />
              <span>Código QR Modo Demo</span>
            </div>
            <p className="text-xs text-slate-300">
              Escanee con la cámara de su teléfono móvil para interactuar en directo desde el televisor TDT
            </p>
          </div>

          {/* Selector for QR Demo Content */}
          <div className="flex items-center justify-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-[11px] font-semibold w-full">
            <button
              type="button"
              onClick={() => setQrType('empresas')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition ${
                qrType === 'empresas' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Web Empresas
            </button>
            <button
              type="button"
              onClick={() => setQrType('whatsapp')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition ${
                qrType === 'whatsapp' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setQrType('dossier')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition ${
                qrType === 'dossier' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dossier PDF
            </button>
          </div>

          {/* QR Code Canvas Frame */}
          <div className="bg-white p-5 rounded-2xl shadow-2xl border-4 border-blue-500/80 flex flex-col items-center gap-2 relative group">
            <QRCodeSVG
              value={qrTargetUrl}
              size={190}
              bgColor={"#FFFFFF"}
              fgColor={"#0f172a"}
              level={"H"}
              includeMargin={false}
              imageSettings={{
                src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=100&q=80",
                x: undefined,
                y: undefined,
                height: 36,
                width: 36,
                excavate: true,
              }}
            />
            <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Inolvidable FM TDT Scan</span>
            </div>
          </div>

          {/* Simulated Scan Feedback */}
          {simulatedScanResult && (
            <div className="bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 p-3 rounded-xl text-xs font-semibold animate-bounce-subtle">
              {simulatedScanResult}
            </div>
          )}

          {/* QR Actions */}
          <div className="w-full flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSimulateScan}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-3 rounded-xl transition shadow flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Simular Escaneo</span>
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold p-2.5 rounded-xl border border-slate-700 transition"
                title="Copiar Enlace QR"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <a
              href={qrTargetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-slate-400 hover:text-blue-300 underline font-mono truncate block text-center"
            >
              {qrTargetUrl}
            </a>
          </div>
        </div>

        {/* Right Column: Rate Cards & Contact Form */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col gap-6 shadow-xl">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <BadgePercent className="w-5 h-5 text-amber-400" />
              Planes Publicitarios de Radio & TDT Canarias
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Seleccione la cobertura perfecta para promocionar sus productos o servicios
            </p>
          </div>

          {/* Business Packs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {BUSINESS_PACKS.map((pack) => (
              <div
                key={pack.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                  pack.popular
                    ? 'bg-gradient-to-b from-blue-950 to-slate-950 border-blue-500 shadow-lg shadow-blue-900/30'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {pack.popular && (
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-2">
                      MÁS POPULAR
                    </span>
                  )}
                  <h4 className="font-bold text-sm text-white">{pack.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{pack.tagline}</p>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-blue-400">{pack.price}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{pack.period}</span>
                  </div>
                </div>

                <div className="mt-3 border-t border-slate-800/80 pt-3">
                  <span className="text-[10px] bg-blue-900/60 text-blue-300 font-bold px-2 py-0.5 rounded">
                    {pack.spotsPerDay} cuñas diarias
                  </span>
                  <ul className="mt-2 text-[11px] text-slate-300 space-y-1">
                    {pack.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Express Quote Request Form */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              Solicitud de Información & Asesoramiento Comercial
            </h4>

            {formSubmitted ? (
              <div className="py-6 flex flex-col items-center text-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
                <p className="font-bold text-base text-white">¡Solicitud Registrada con Éxito!</p>
                <p className="text-xs text-slate-300">
                  Un asesor del Departamento Comercial de Inolvidable FM contactará con su empresa a la brevedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nombre de Empresa:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Comercial Canarias S.L."
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Persona de Contacto:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Antonio Santana"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Teléfono:</label>
                  <input
                    type="tel"
                    required
                    placeholder="+34 928 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Plan Preferido:</label>
                  <select
                    value={formData.packSelected}
                    onChange={(e) => setFormData({ ...formData, packSelected: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    {BUSINESS_PACKS.map((p) => (
                      <option key={p.id} value={p.title}>{p.title} ({p.price})</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl shadow transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Consulta a Dpto. Comercial
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Contact Direct Phone & Email Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>Tel. Comercial: <strong className="text-white">{INOLVIDABLE_STATION_INFO.contactPhone}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Email: <strong className="text-white">{INOLVIDABLE_STATION_INFO.contactEmail}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
