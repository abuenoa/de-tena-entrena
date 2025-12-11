import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const ContactForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        goal: '',
        experience: '',
        injuries: '',
        commitment: '3', // Days per week
        instagram: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, 'contact_requests'), {
                ...formData,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
            alert('Solicitud enviada con éxito. Nos pondremos en contacto pronto.');
            navigate('/');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Hubo un error al enviar la solicitud. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-black text-white p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Volver
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface border border-white/10 rounded-3xl p-8"
                >
                    <h1 className="font-display text-3xl font-bold mb-2">Solicitud de Asesoría</h1>
                    <p className="text-white/50 mb-8">Completa el formulario para empezar tu transformación.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Nombre Completo</label>
                                <input
                                    required
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-colors"
                                    placeholder="Juan Pérez"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Email</label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-colors"
                                    placeholder="juan@ejemplo.com"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Teléfono (WhatsApp)</label>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-colors"
                                    placeholder="+34 600 000 000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Instagram (Opcional)</label>
                                <input
                                    type="text"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-colors"
                                    placeholder="@usuario"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">Edad</label>
                            <input
                                required
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-colors"
                                placeholder="25"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">¿Cuál es tu objetivo principal?</label>
                            <textarea
                                required
                                name="goal"
                                value={formData.goal}
                                onChange={handleChange}
                                rows="3"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-colors"
                                placeholder="Ganar masa muscular, perder grasa, mejorar rendimiento..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">Experiencia entrenando</label>
                            <select
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-colors text-white"
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="principiante">Principiante (0-1 años)</option>
                                <option value="intermedio">Intermedio (1-3 años)</option>
                                <option value="avanzado">Avanzado (+3 años)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">¿Tienes alguna lesión?</label>
                            <textarea
                                name="injuries"
                                value={formData.injuries}
                                onChange={handleChange}
                                rows="2"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-colors"
                                placeholder="No, o describe tu lesión..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">Días disponibles para entrenar</label>
                            <input
                                type="range"
                                name="commitment"
                                min="1"
                                max="7"
                                value={formData.commitment}
                                onChange={handleChange}
                                className="w-full accent-brand-red"
                            />
                            <div className="text-center font-bold text-brand-red">{formData.commitment} días/semana</div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? 'Enviando...' : <><Send size={20} /> Enviar Solicitud</>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactForm;
