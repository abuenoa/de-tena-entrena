import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, CheckCircle2, Smartphone, Dumbbell, MessageCircle, Video, ListChecks, Phone, Mail, Instagram } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import welcomeImage from '../../backup_legacy/assets/CamaronBiceps.jpg';

const LandingPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: scrollRef });
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

    const handleStart = () => {
        navigate('/contact');
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div ref={scrollRef} className="relative w-full overflow-hidden bg-brand-black text-white selection:bg-brand-red selection:text-white">
            {/* Background Image with Parallax */}
            {/* Background Image with Parallax */}
            <motion.div
                className="absolute top-0 left-0 w-full h-[120vh] z-0"
                style={{
                    y,
                    backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.6
                }}
            />
            <div className="absolute top-0 left-0 w-full h-full z-0 bg-gradient-to-b from-brand-black/40 via-brand-black/80 to-brand-black" />

            {/* Language Switcher */}
            <div className="absolute top-6 left-6 z-50">
                <LanguageSwitcher />
            </div>

            {/* Hero Section */}
            <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6">
                <div className="z-10 flex flex-col items-center text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="mb-4 font-display text-xl font-bold tracking-[0.2em] text-brand-red uppercase">
                            {t('landing.title_transform')}
                        </h2>
                        <h1 className="mb-6 font-display text-5xl font-extrabold tracking-tighter md:text-7xl lg:text-8xl text-white">
                            {t('landing.title_elevate')}
                        </h1>
                        <p className="mx-auto mb-10 max-w-lg text-lg text-white/70">
                            {t('landing.subtitle')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <button
                            className="group flex items-center gap-3 rounded-full bg-brand-red px-8 py-4 text-lg font-bold tracking-wide transition-all hover:bg-red-700 hover:px-10 shadow-lg shadow-brand-red/20"
                            onClick={handleStart}
                        >
                            {t('landing.cta')}
                            <ChevronRight className="transition-transform group-hover:translate-x-1" />
                        </button>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 flex flex-col items-center gap-2"
                >
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">Scroll to Explore</span>
                    <div className="h-12 w-[1px] bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
                </motion.div>
            </section>

            {/* Infinite Marquee */}
            <div className="relative w-full overflow-hidden border-y border-white/5 bg-brand-black/50 py-6 backdrop-blur-sm z-10">
                <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
                    {[...Array(4)].map((_, i) => (
                        <span key={i} className="flex items-center gap-12 text-4xl font-black uppercase italic tracking-tighter text-white/10">
                            <span>Strength</span><span className="text-brand-red">•</span>
                            <span>Technique</span><span className="text-brand-red">•</span>
                            <span>Discipline</span><span className="text-brand-red">•</span>
                            <span>Performance</span><span className="text-brand-red">•</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 space-y-32">

                {/* Welcome Section */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="flex flex-col md:flex-row gap-12 items-center"
                >
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-red">{t('landing.welcome.title')}</h2>
                        <div className="space-y-4 text-lg text-white/70 leading-relaxed font-light">
                            <p>{t('landing.welcome.letter_p1')}</p>
                            <p>{t('landing.welcome.letter_p2')}</p>
                            <p>{t('landing.welcome.letter_p3')}</p>
                            <p>{t('landing.welcome.letter_p4')}</p>
                            <p className="pt-4 font-handwriting text-2xl text-white">{t('landing.welcome.signature')}</p>
                        </div>
                    </div>
                    {/* Optional: Add David's photo here if we had one, for now keeping it text-focused or using a placeholder graphic */}
                    <div className="flex-1 flex justify-center">
                        <div className="w-full h-[400px] bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden group">
                            <img src={welcomeImage} alt="Training" className="absolute inset-0 w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6">
                                <p className="text-white font-display font-bold text-xl uppercase tracking-widest">Focus</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Roles Section */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase">{t('landing.roles.title')}</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* YOU */}
                        <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-red/30 transition-colors">
                            <h3 className="text-2xl font-bold mb-6 text-brand-red">{t('landing.roles.you_title')}</h3>
                            <ul className="space-y-4">
                                {t('landing.roles.you_list', { returnObjects: true }).map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-white/80">
                                        <CheckCircle2 className="w-6 h-6 text-white/20 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* ME */}
                        <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-red/30 transition-colors">
                            <h3 className="text-2xl font-bold mb-6 text-brand-red">{t('landing.roles.me_title')}</h3>
                            <ul className="space-y-4">
                                {t('landing.roles.me_list', { returnObjects: true }).map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-white/80">
                                        <CheckCircle2 className="w-6 h-6 text-white/20 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Workflow Section */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase">{t('landing.workflow.title')}</h2>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {[
                            { icon: Smartphone, title: 'hevy_title', desc: 'hevy_desc' },
                            { icon: Dumbbell, title: 'routine_title', desc: 'routine_desc' },
                            { icon: MessageCircle, title: 'tracking_title', desc: 'tracking_desc' },
                            { icon: Video, title: 'video_title', desc: 'video_desc' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors"
                            >
                                <item.icon className="w-10 h-10 text-brand-red mb-4" />
                                <h3 className="text-xl font-bold mb-2">{t(`landing.workflow.${item.title}`)}</h3>
                                <p className="text-white/60 text-sm leading-relaxed">{t(`landing.workflow.${item.desc}`)}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Philosophy & Tracking Sections */}
                {/* Philosophy & Tracking Sections */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="space-y-24"
                >
                    {/* Philosophy */}
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-12">{t('landing.philosophy.title')}</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {t('landing.philosophy.points', { returnObjects: true })?.map((point, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-red/30 transition-all"
                                >
                                    <h3 className="text-lg font-medium leading-relaxed text-white/90">"{point}"</h3>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Tracking */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-display font-bold uppercase">{t('landing.tracking.title')}</h2>
                            <p className="text-lg text-white/70 leading-relaxed">
                                {t('landing.tracking.desc')}
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                {t('landing.tracking.sheet_title')}
                            </h3>
                            <p className="text-white/60 mb-6">
                                {t('landing.tracking.sheet_desc')}
                            </p>
                            <button
                                onClick={() => navigate('/contact')}
                                className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors w-full text-center uppercase tracking-wider"
                            >
                                {t('landing.tracking.form_btn')}
                            </button>
                        </div>
                    </div>
                </motion.section>

                {/* Commitment Section */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-brand-red/10 to-transparent border border-brand-red/20"
                >
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl font-display font-bold uppercase mb-4">{t('landing.commitment.title')}</h2>
                            <p className="text-white/70">{t('landing.commitment.desc')}</p>
                            <div className="mt-8">
                                <button onClick={handleStart} className="bg-white text-brand-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                                    {t('landing.final_cta.button')}
                                </button>
                            </div>
                        </div>
                        <div className="flex-1">
                            <ul className="space-y-4">
                                {t('landing.commitment.list', { returnObjects: true }).map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 p-4 rounded-xl bg-brand-black/40 border border-white/5">
                                        <ListChecks className="w-5 h-5 text-brand-red shrink-0" />
                                        <span className="font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.section>

                {/* Testimonials */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-2">
                            {t('landing.testimonials.title')} <span className="text-brand-red">{t('landing.testimonials.subtitle')}</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Alicia L.", img: "/Ali_testimonio.jpeg", text: "En 3 meses he conseguido lo que llevaba años intentando. David me ha enseñado a entrenar de verdad." },
                            { name: "Carlos T.", img: "/Cepa_testimonio.jpeg", text: "El planteamiento inteligente marca la diferencia. No se trata de hacer más, si no de perfeccionar lo básico." },
                            { name: "Antonio B.", img: "/Anto_testimonio.jpeg", text: "No es solo un entrenador, es alguien que realmente se preocupa por tu progreso. He aprendido más en 2 meses que en años." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 text-center transition-all hover:border-brand-red/50 hover:-translate-y-2"
                            >
                                <div className="absolute left-6 top-6 font-display text-6xl text-brand-red/10">"</div>
                                <div className="absolute bottom-6 right-6 rotate-180 font-display text-6xl text-brand-red/10">"</div>

                                <div className="mx-auto mb-6 h-24 w-24 rounded-full border-4 border-brand-red/20 overflow-hidden shadow-lg shadow-brand-red/20">
                                    <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <h3 className="mb-4 font-display text-xl font-bold">{item.name}</h3>
                                <p className="relative z-10 italic text-white/70">"{item.text}"</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Final CTA */}
                <section className="text-center py-20">
                    <h2 className="text-4xl md:text-6xl font-display font-bold uppercase mb-8">{t('landing.final_cta.ready')}</h2>
                    <button
                        onClick={handleStart}
                        className="group inline-flex items-center gap-3 rounded-full bg-brand-red px-12 py-6 text-xl font-bold tracking-wide transition-all hover:bg-red-700 hover:scale-105 shadow-2xl shadow-brand-red/30"
                    >
                        {t('landing.final_cta.button')}
                        <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                    </button>
                </section>

                {/* Support & FAQ */}
                <section className="space-y-24 py-12 border-t border-white/5">
                    {/* Support */}
                    <div className="text-center space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-display font-bold uppercase">{t('landing.support.title')}</h2>
                            <p className="text-xl text-white/70">{t('landing.support.desc')}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {[
                                { icon: Phone, label: 'phone', link: 'tel:+34615328602' },
                                { icon: Mail, label: 'email', link: 'mailto:daviddetenad@gmail.com' },
                                { icon: MessageCircle, label: 'whatsapp', link: 'https://wa.me/34615328602' },
                                { icon: Instagram, label: 'instagram', link: 'https://instagram.com/david.detena' }
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-red/30 hover:bg-white/10 transition-all group flex flex-col items-center gap-4"
                                >
                                    <div className="p-4 rounded-full bg-brand-red/10 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-bold text-white/90 mb-1">{t(`landing.support.details.${item.label}.label`)}</h3>
                                        <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{t(`landing.support.details.${item.label}.value`)}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl font-display font-bold uppercase text-center mb-12">{t('landing.faq.title')}</h2>
                        <div className="space-y-6">
                            {t('landing.faq.items', { returnObjects: true }).map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-red/30 transition-colors"
                                >
                                    <h3 className="text-lg font-bold text-brand-red mb-3">{item.q}</h3>
                                    <p className="text-white/70 leading-relaxed">{item.a}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer Minimal */}
                <footer className="border-t border-white/10 py-12 text-center text-white/30 text-sm">
                    <p>&copy; {new Date().getFullYear()} De Tena Entrena. All rights reserved.</p>
                </footer>

            </div>
        </div>
    );
};

export default LandingPage;
