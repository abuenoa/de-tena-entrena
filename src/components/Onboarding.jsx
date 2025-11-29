import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Activity, Zap, Heart } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        weight: '',
        height: '',
        age: '',
        goal: '',
        injuries: ''
    });

    const totalSteps = 3;
    const progress = ((step + 1) / totalSteps) * 100;

    const handleNext = () => {
        if (step < totalSteps - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const variants = {
        enter: { y: 100, opacity: 0 },
        center: { y: 0, opacity: 1 },
        exit: { y: -100, opacity: 0 }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-brand-black text-white">
            {/* Progress Bar */}
            <div className="h-1 w-full bg-white/10">
                <motion.div
                    className="h-full bg-brand-red"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                            className="flex w-full max-w-md flex-col gap-8"
                        >
                            <h2 className="text-center font-display text-4xl font-bold">Your Stats</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm text-white/50">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) => handleChange('weight', e.target.value)}
                                        className="w-full border-b border-white/10 bg-transparent py-4 text-5xl font-bold text-white focus:border-brand-red focus:outline-none"
                                        placeholder="00"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <label className="mb-2 block text-sm text-white/50">Height (cm)</label>
                                        <input
                                            type="number"
                                            value={formData.height}
                                            onChange={(e) => handleChange('height', e.target.value)}
                                            className="w-full border-b border-white/10 bg-transparent py-4 text-3xl font-bold text-white focus:border-brand-red focus:outline-none"
                                            placeholder="000"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="mb-2 block text-sm text-white/50">Age</label>
                                        <input
                                            type="number"
                                            value={formData.age}
                                            onChange={(e) => handleChange('age', e.target.value)}
                                            className="w-full border-b border-white/10 bg-transparent py-4 text-3xl font-bold text-white focus:border-brand-red focus:outline-none"
                                            placeholder="00"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                            className="flex w-full max-w-2xl flex-col gap-8"
                        >
                            <h2 className="text-center font-display text-4xl font-bold">Primary Goal</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {[
                                    { id: 'hypertrophy', label: 'Hypertrophy', icon: Activity },
                                    { id: 'strength', label: 'Strength', icon: Zap },
                                    { id: 'endurance', label: 'Endurance', icon: Heart },
                                ].map((goal) => (
                                    <button
                                        key={goal.id}
                                        onClick={() => handleChange('goal', goal.id)}
                                        className={`group relative flex flex-col items-center justify-center rounded-2xl border p-8 transition-all ${formData.goal === goal.id
                                                ? 'border-brand-red bg-brand-red/10'
                                                : 'border-white/10 bg-white/5 hover:border-white/30'
                                            }`}
                                    >
                                        <goal.icon className={`mb-4 h-8 w-8 ${formData.goal === goal.id ? 'text-brand-red' : 'text-white'}`} />
                                        <span className="font-bold">{goal.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                            className="flex w-full max-w-md flex-col gap-8"
                        >
                            <h2 className="text-center font-display text-4xl font-bold">Injuries?</h2>
                            <p className="text-center text-white/50">Leave blank if you are 100% fit.</p>
                            <textarea
                                value={formData.injuries}
                                onChange={(e) => handleChange('injuries', e.target.value)}
                                className="h-40 w-full rounded-xl border border-white/10 bg-white/5 p-4 text-lg text-white focus:border-brand-red focus:outline-none"
                                placeholder="Describe any past injuries..."
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={handleNext}
                    className="mt-12 flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-brand-black transition-transform hover:scale-105 active:scale-95"
                >
                    {step === totalSteps - 1 ? 'FINISH' : 'NEXT'}
                    {step === totalSteps - 1 ? <Check size={20} /> : <ArrowRight size={20} />}
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
