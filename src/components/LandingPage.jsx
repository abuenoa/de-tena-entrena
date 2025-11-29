import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Zap, Trophy } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="relative w-full">
            {/* Hero Section */}
            <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
                {/* Background Orb */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red blur-[120px] opacity-40"
                />

                {/* Floating Glass Element */}
                <div className="absolute inset-0 z-0 backdrop-blur-[2px]" />

                {/* Giant Title */}
                <div className="z-10 flex flex-col items-center text-center mix-blend-difference">
                    <motion.h1
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="font-display text-6xl font-black uppercase leading-[0.9] tracking-tighter text-white md:text-9xl"
                    >
                        Define Your <br />
                        <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>Legacy</span>
                    </motion.h1>
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
            <div className="relative w-full overflow-hidden border-y border-white/5 bg-brand-black/50 py-6 backdrop-blur-sm">
                <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
                    {[...Array(4)].map((_, i) => (
                        <span key={i} className="flex items-center gap-12 text-4xl font-black uppercase italic tracking-tighter text-white/20">
                            <span>Strength</span>
                            <span className="text-brand-red">•</span>
                            <span>Technique</span>
                            <span className="text-brand-red">•</span>
                            <span>Discipline</span>
                            <span className="text-brand-red">•</span>
                            <span>Performance</span>
                            <span className="text-brand-red">•</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Philosophy / Bento Grid */}
            <section className="relative z-10 px-4 py-32 md:px-8">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="font-display text-4xl font-bold uppercase text-white md:text-6xl">
                            The <span className="text-brand-red">Methodology</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 md:h-[600px]">
                        {/* Card 1: Large Left */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group relative flex flex-col justify-end overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-colors hover:border-brand-red/50 md:col-span-2 md:row-span-2"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-80" />
                            <Activity className="mb-4 h-12 w-12 text-brand-red" />
                            <h3 className="relative z-10 mb-2 font-display text-3xl font-bold">Data-Driven Performance</h3>
                            <p className="relative z-10 max-w-md text-white/60">
                                Every rep, every set, every meal is calculated. We don't guess; we engineer your results using advanced metrics and biomechanics.
                            </p>
                        </motion.div>

                        {/* Card 2: Top Right */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="group relative flex flex-col justify-center rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-colors hover:border-brand-red/50"
                        >
                            <Zap className="mb-4 h-8 w-8 text-brand-red" />
                            <h3 className="font-display text-xl font-bold">Explosive Power</h3>
                            <p className="mt-2 text-sm text-white/60">Athletic conditioning for real-world application.</p>
                        </motion.div>

                        {/* Card 3: Bottom Right */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="group relative flex flex-col justify-center rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-colors hover:border-brand-red/50"
                        >
                            <Trophy className="mb-4 h-8 w-8 text-brand-red" />
                            <h3 className="font-display text-xl font-bold">Elite Mindset</h3>
                            <p className="mt-2 text-sm text-white/60">Forging mental resilience alongside physical strength.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="relative z-10 px-4 py-32 md:px-8">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16 text-center"
                    >
                        <h2 className="font-display text-4xl font-bold uppercase text-white md:text-6xl">
                            Client <span className="text-brand-red">Transformations</span>
                        </h2>
                        <p className="mt-4 text-lg text-white/50">Resultados reales de personas reales</p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Testimonial 1 - Alicia */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 text-center transition-all hover:border-brand-red/50 hover:-translate-y-2"
                        >
                            <div className="absolute left-6 top-6 font-display text-6xl text-brand-red/10">"</div>
                            <div className="absolute bottom-6 right-6 rotate-180 font-display text-6xl text-brand-red/10">"</div>

                            <img
                                src="/Ali_testimonio.jpeg"
                                alt="Alicia L."
                                className="mx-auto mb-6 h-24 w-24 rounded-full border-4 border-brand-red/20 object-cover shadow-lg shadow-brand-red/20"
                            />
                            <h3 className="mb-4 font-display text-xl font-bold">Alicia L.</h3>
                            <p className="relative z-10 italic text-white/70">
                                En 3 meses he conseguido lo que llevaba años intentando. David me ha enseñado a entrenar de verdad, sin atajos ni promesas vacías.
                            </p>
                        </motion.div>

                        {/* Testimonial 2 - Carlos */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 text-center transition-all hover:border-brand-red/50 hover:-translate-y-2"
                        >
                            <div className="absolute left-6 top-6 font-display text-6xl text-brand-red/10">"</div>
                            <div className="absolute bottom-6 right-6 rotate-180 font-display text-6xl text-brand-red/10">"</div>

                            <img
                                src="/Cepa_testimonio.jpeg"
                                alt="Carlos T."
                                className="mx-auto mb-6 h-24 w-24 rounded-full border-4 border-brand-red/20 object-cover shadow-lg shadow-brand-red/20"
                            />
                            <h3 className="mb-4 font-display text-xl font-bold">Carlos T.</h3>
                            <p className="relative z-10 italic text-white/70">
                                El planteamiento inteligente marca la diferencia. No se trata de hacer más, si no de perfeccionar lo básico.
                            </p>
                        </motion.div>

                        {/* Testimonial 3 - Antonio */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 text-center transition-all hover:border-brand-red/50 hover:-translate-y-2"
                        >
                            <div className="absolute left-6 top-6 font-display text-6xl text-brand-red/10">"</div>
                            <div className="absolute bottom-6 right-6 rotate-180 font-display text-6xl text-brand-red/10">"</div>

                            <img
                                src="/Anto_testimonio.jpeg"
                                alt="Antonio B."
                                className="mx-auto mb-6 h-24 w-24 rounded-full border-4 border-brand-red/20 object-cover shadow-lg shadow-brand-red/20"
                            />
                            <h3 className="mb-4 font-display text-xl font-bold">Antonio B.</h3>
                            <p className="relative z-10 italic text-white/70">
                                No es solo un entrenador, es alguien que realmente se preocupa por tu progreso. He aprendido más en 2 meses que en años entrenando solo.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
