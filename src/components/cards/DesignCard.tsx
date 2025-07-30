import React from 'react'
import { Card } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { PopupSettings, TriggerSettings } from '../sites/Designer'

export default function DesignCard({ card, triggerSettings, setTriggerSettings, popupSettings, setPopupSettings }: { card: 'trigger' | 'popup', triggerSettings: TriggerSettings, setTriggerSettings: (settings: TriggerSettings) => void, popupSettings: PopupSettings, setPopupSettings: (settings: PopupSettings) => void }) {


    switch (card) {
        case 'trigger':
            return (
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Trigger Butonu Ayarları</h2>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="bg-color">Arka Plan Rengi</Label>
                            <div className="flex gap-2 mt-1">
                                <Input
                                    value={triggerSettings.backgroundColor}
                                    onChange={(e) => setTriggerSettings(prev => ({
                                        ...prev,
                                        backgroundColor: e.target.value
                                    }))}
                                    placeholder="#22c55e"
                                    className="flex-1"
                                />
                                <div className='w-10 h-10 relative'>
                                    <Input
                                        id="bg-color"
                                        type="color"
                                        value={triggerSettings.backgroundColor}
                                        onChange={(e) => setTriggerSettings(prev => ({
                                            ...prev,
                                            backgroundColor: e.target.value
                                        }))}
                                        className="absolute top-0 left-0 w-full h-full p-0 m-0 cursor-pointer rounded-full"
                                    />
                                    <label style={{ backgroundColor: triggerSettings.backgroundColor }} htmlFor='bg-color' className="w-full h-full border border-gray-300 rounded-full absolute"></label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="text-color">Yazı Rengi</Label>
                            <div className="flex gap-2 mt-1 ">
                                <Input
                                    value={triggerSettings.textColor}
                                    onChange={(e) => setTriggerSettings(prev => ({
                                        ...prev,
                                        textColor: e.target.value
                                    }))}
                                    className="flex-1"
                                />
                                <div className='w-10 h-10 relative'>
                                    <Input
                                        id="text-color"
                                        type="color"
                                        value={triggerSettings.textColor}
                                        onChange={(e) => setTriggerSettings(prev => ({
                                            ...prev,
                                            textColor: e.target.value
                                        }))}
                                        className="absolute top-0 left-0 w-full h-full p-0 m-0 cursor-pointer rounded-full"
                                    />
                                    <label style={{ backgroundColor: triggerSettings.textColor }} htmlFor='text-color' className="w-full h-full border border-gray-300 rounded-full absolute"></label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="rounded">Yuvarlaklık Oranı</Label>
                            <Select
                                value={triggerSettings.roundedRatio}
                                onValueChange={(value) => setTriggerSettings(prev => ({
                                    ...prev,
                                    roundedRatio: value
                                }))}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rounded-none">Köşeli (rounded-none)</SelectItem>
                                    <SelectItem value="rounded-sm">Küçük (rounded-sm)</SelectItem>
                                    <SelectItem value="rounded-md">Orta (rounded-md)</SelectItem>
                                    <SelectItem value="rounded-lg">Büyük (rounded-lg)</SelectItem>
                                    <SelectItem value="rounded-xl">Çok Büyük (rounded-xl)</SelectItem>
                                    <SelectItem value="rounded-full">Tam Yuvarlak (rounded-full)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="position">Pozisyon</Label>
                            <Select
                                value={triggerSettings.position}
                                onValueChange={(value) => setTriggerSettings(prev => ({
                                    ...prev,
                                    position: value
                                }))}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bottom-right">Sağ Alt</SelectItem>
                                    <SelectItem value="bottom-left">Sol Alt</SelectItem>
                                    <SelectItem value="top-right">Sağ Üst</SelectItem>
                                    <SelectItem value="top-left">Sol Üst</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Card>
            )
        case 'popup':
            return (
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Popup Modal Ayarları</h2>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="popup-title">Başlık</Label>
                            <Input
                                id="popup-title"
                                value={popupSettings.title}
                                onChange={(e) => setPopupSettings(prev => ({
                                    ...prev,
                                    title: e.target.value
                                }))}
                                className="mt-1"
                                placeholder="Bir Sorun Bildirim"
                            />
                        </div>

                        <div>
                            <Label htmlFor="popup-description">Açıklama Metni</Label>
                            <textarea
                                id="popup-description"
                                value={popupSettings.description}
                                onChange={(e) => setPopupSettings(prev => ({
                                    ...prev,
                                    description: e.target.value
                                }))}
                                className="mt-1 w-full min-h-[80px] px-3 py-2 border border-input rounded-md text-sm"
                                placeholder="Karşılaştığınız sorunu detaylı olarak anlatın..."
                            />
                        </div>

                        <div>
                            <Label htmlFor="popup-btn-color">Buton Rengi</Label>
                            <div className="flex gap-2 mt-1">
                                <Input
                                    id="popup-btn-color"
                                    type="color"
                                    value={popupSettings.buttonColor}
                                    onChange={(e) => setPopupSettings(prev => ({
                                        ...prev,
                                        buttonColor: e.target.value
                                    }))}
                                    className="w-20 h-10 p-1"
                                />
                                <Input
                                    value={popupSettings.buttonColor}
                                    onChange={(e) => setPopupSettings(prev => ({
                                        ...prev,
                                        buttonColor: e.target.value
                                    }))}
                                    placeholder="#22c55e"
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="popup-text-color">Yazı Rengi</Label>
                            <div className="flex gap-2 mt-1">
                                <Input
                                    id="popup-text-color"
                                    type="color"
                                    value={popupSettings.textColor}
                                    onChange={(e) => setPopupSettings(prev => ({
                                        ...prev,
                                        textColor: e.target.value
                                    }))}
                                    className="w-20 h-10 p-1"
                                />
                                <Input
                                    value={popupSettings.textColor}
                                    onChange={(e) => setPopupSettings(prev => ({
                                        ...prev,
                                        textColor: e.target.value
                                    }))}
                                    placeholder="#1f2937"
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            )
    }
}
