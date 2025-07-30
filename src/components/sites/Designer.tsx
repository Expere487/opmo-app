"use client"
import React, { useState } from 'react'
import { Tabs, TabsTrigger, TabsList, TabsContent } from '../ui/tabs'
import { Card } from '../ui/card'
import { cn, positionClasses, roundedClasses } from '@/lib/utils'
import { Button } from '../ui/button'
import DesignCard from '../cards/DesignCard'

export interface TriggerSettings {
    backgroundColor: string
    textColor: string
    roundedRatio: string
    position: string
}

export interface PopupSettings {
    title: string
    description: string
    buttonColor: string
    textColor: string
}

export default function Designer() {
    const [triggerSettings, setTriggerSettings] = useState<TriggerSettings>({
        backgroundColor: '#22c55e',
        textColor: '#ffffff',
        roundedRatio: 'rounded-lg',
        position: 'bottom-right'
    })
    const [popupSettings, setPopupSettings] = useState<PopupSettings>({
        title: 'Bir Sorun Bildirim',
        description: 'Karşılaştığınız sorunu detaylı olarak anlatın. Teknik bilgiler otomatik olarak eklenecektir.',
        buttonColor: '#22c55e',
        textColor: '#1f2937'
    })
    const [showModal, setShowModal] = useState(false)

    return (
        <div className="flex w-full items-start justify-center gap-4">
            {/* Ayarlar Paneli */}
            <div className="w-1/4">
                {/* Trigger Butonu Ayarları */}
                <Tabs defaultValue="trigger" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="trigger">Trigger</TabsTrigger>
                        <TabsTrigger value="form">Form</TabsTrigger>
                    </TabsList>
                    <TabsContent value="trigger">
                        <DesignCard card="trigger" triggerSettings={triggerSettings} setTriggerSettings={setTriggerSettings} popupSettings={popupSettings} setPopupSettings={setPopupSettings} />
                    </TabsContent>
                    <TabsContent value="form">
                        <DesignCard card="popup" triggerSettings={triggerSettings} setTriggerSettings={setTriggerSettings} popupSettings={popupSettings} setPopupSettings={setPopupSettings} />
                    </TabsContent>
                </Tabs>
                {/* Popup Modal Ayarları */}
            </div>

            {/* Önizleme Paneli */}
            <div className="w-3/4">
                <Card className="p-6 sticky top-6">
                    <h2 className="text-lg font-semibold mb-4">Önizleme</h2>

                    {/* Preview Container */}
                    <div className="relative bg-gray-50 dark:bg-gray-900 rounded-lg min-h-[500px] border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                            Widget Test Sayfası Önizlemesi
                        </div>

                        {/* Trigger Button Preview */}
                        <button
                            className={cn(
                                positionClasses[triggerSettings.position as keyof typeof positionClasses],
                                roundedClasses[triggerSettings.roundedRatio as keyof typeof roundedClasses],
                                `absolute px-4 py-2 font-medium shadow-lg transition-all hover:shadow-xl z-10`
                            )}
                            style={{
                                backgroundColor: triggerSettings.backgroundColor,
                                color: triggerSettings.textColor
                            }}
                            onClick={() => setShowModal(true)}
                        >
                            Hata Bildir
                        </button>


                        <div className="absolute inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-20">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    ✕
                                </button>

                                <h3
                                    className="text-lg font-semibold mb-2"
                                    style={{ color: popupSettings.textColor }}
                                >
                                    {popupSettings.title}
                                </h3>

                                <p
                                    className="text-sm mb-4 opacity-90"
                                    style={{ color: popupSettings.textColor }}
                                >
                                    {popupSettings.description}
                                </p>

                                <textarea
                                    placeholder="Lütfen sorunu açıklayın..."
                                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm mb-4"
                                />

                                <input
                                    type="email"
                                    placeholder="E-posta adresiniz (isteğe bağlı)"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm mb-4"
                                />

                                <button
                                    className="w-full py-2 px-4 rounded-md font-medium text-white"
                                    style={{ backgroundColor: popupSettings.buttonColor }}
                                >
                                    Raporu Gönder
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
