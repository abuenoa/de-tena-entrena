import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, MapPin } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { spanishCommunities } from '../utils/spanishLocations';

const ContactForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dob: '',
        community: '',
        province: '',
        history: '',
        motivation: '',
        referral: '',
        injury: '',
        extras: '',
        instagram: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Reset province if community changes
        if (name === 'community') {
            setFormData(prev => ({ ...prev, province: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const finalData = {
            ...formData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        try {
            await addDoc(collection(db, 'contact_requests'), finalData);
            alert(t('contact.success'));
            navigate('/');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert(t('contact.error'));
        } finally {
            setLoading(false);
        }
    };

    // Derived state for provinces based on selected community
    const availableProvinces = spanishCommunities.find(c => c.name === formData.community)?.provinces || [];

    return (
        <div className="min-h-screen bg-brand-black text-white p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> {t('nav.home')}
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl"
                >
                    <div className="mb-8">
                        <h1 className="font-display text-4xl font-bold mb-2 text-white">{t('contact.title')}</h1>
                        <p className="text-white/50 text-lg">{t('contact.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Info */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-brand-red/80">{t('contact.form.name')}</label>
                                <input
                                    required
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-brand-red focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/20"
                                    placeholder="Juan Pérez"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-brand-red/80">{t('contact.form.email')}</label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-brand-red focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/20"
                                    placeholder="juan@ejemplo.com"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-brand-red/80">{t('contact.form.phone')}</label>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-brand-red focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/20"
                                    placeholder="+34 600 000 000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Instagram (Opcional)</label>
                                <input
                                    type="text"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-brand-red focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/20"
                                    placeholder="@usuario"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-brand-red/80 block">{t('contact.form.dob')}</label>
                            <input
                                required
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="w-full md:w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-brand-red focus:bg-white/10 focus:outline-none transition-all text-white scheme-dark appearance-none"
                            />
                        </div>

                        {/* Location Hierarchy */}
                        <div className="space-y-4 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 mb-2 text-brand-red">
                                <MapPin size={18} />
                                <span className="text-sm font-bold uppercase tracking-wider">Ubicación</span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-white/50">Comunidad Autónoma</label>
                                    <select
                                        required
                                        name="community"
                                        value={formData.community}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-brand-red focus:bg-white/10 focus:outline-none transition-all text-white [&>option]:bg-[#1A1A1A]"
                                    >
                                        <option value="">Selecciona...</option>
                                        {spanishCommunities.map(c => (
                                            <option key={c.name} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-white/50">Provincia / Ciudad</label>
                                    <select
                                        required
                                        name="province"
                                        value={formData.province}
                                        onChange={handleChange}
                                        disabled={!formData.community}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-brand-red focus:bg-white/10 focus:outline-none transition-all text-white disabled:opacity-30 [&>option]:bg-[#1A1A1A]"
                                    >
                                        <option value="">Selecciona...</option>
                                        {availableProvinces.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Questions */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-white/50">{t('contact.form.history')}</label>
                                <textarea
                                    required
                                    name="history"
                                    value={formData.history}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-brand-red focus:bg-white/10 focus:outline-none transition-all resize-none placeholder:text-white/20"
                                    placeholder="Ej: Llevo 1 año en el gimnasio pero no soy constante..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-brand-red/80">{t('contact.form.motivation')}</label>
                                <textarea
                                    required
                                    name="motivation"
                                    value={formData.motivation}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-brand-red focus:bg-white/10 focus:outline-none transition-all resize-none placeholder:text-white/20"
                                    placeholder="Quiero mejorar mi salud y sentirme más fuerte..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-white/50">{t('contact.form.injury')}</label>
                                <textarea
                                    name="injury"
                                    value={formData.injury}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-brand-red focus:bg-white/10 focus:outline-none transition-all resize-none placeholder:text-white/30"
                                    placeholder="Ej: Tengo una molestia en el hombro derecho al hacer press, operado de menisco en 2018..."
                                    style={{ '::placeholder': { color: 'rgba(255,255,255,0.3)' } }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-white/50">{t('contact.form.referral')}</label>
                                <input
                                    type="text"
                                    name="referral"
                                    value={formData.referral}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-brand-red focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/20"
                                    placeholder="Instagram, recomendación de un amigo, Google..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-white/50">{t('contact.form.extras')}</label>
                                <textarea
                                    name="extras"
                                    value={formData.extras}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-brand-red focus:bg-white/10 focus:outline-none transition-all resize-none placeholder:text-white/20"
                                    placeholder="Cualquier otra cosa que quieras comentar..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group bg-brand-red hover:bg-neutral-200 hover:text-brand-black text-white font-bold py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wider shadow-lg hover:shadow-brand-red/20"
                        >
                            {loading ? t('contact.form.sending') : <><Send size={20} className="transition-transform group-hover:translate-x-1" /> {t('contact.form.submit')}</>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactForm;
