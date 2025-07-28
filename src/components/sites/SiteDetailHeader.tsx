"use client"
import { ArrowLeftIcon, ExternalLinkIcon, GlobeIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Site } from "@/types/site";

export default function SiteDetailHeader({ site }: { site: Site }) {

    return (
        <div className="mb-8 flex flex-col items-start justify-between">
            <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="mb-4"
            >
                <ArrowLeftIcon size={16} className="mr-2" />
                Geri Dön
            </Button>

            <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <GlobeIcon size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        {site.site_name || 'İsimsiz Site'}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <span>{site.site_url}</span>
                        <span>•</span>
                        <span>{site._count.issues} issue</span>
                        <span>•</span>
                        <span>Oluşturulma: {new Date(site.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(site.site_url || '', '_blank')}
                >
                    <ExternalLinkIcon size={14} className="mr-1" />
                    Siteyi Ziyaret Et
                </Button>
            </div>
        </div>
    )
}