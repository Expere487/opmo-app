import { Issue } from '@/app/sites/[id]/issues/page'
import { Button } from '@/components/ui/button'
import { getPriorityColor, getStatusColor } from '@/lib/utils'
import { CalendarIcon, EyeIcon, UserIcon } from 'lucide-react'
import React from 'react'

export default function IssueCard({ issue, siteId }: { issue: Issue, siteId: string }) {
    return (
        <div key={issue.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(issue.status)}`}>
                            {issue.status === 'new' ? 'Yeni' :
                                issue.status === 'in_progress' ? 'İşlemde' :
                                    issue.status === 'resolved' ? 'Çözüldü' :
                                        issue.status === 'wont_fix' ? 'Düzeltilmeyecek' : issue.status}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(issue.priority)}`}>
                            {issue.priority === 'critical' ? 'Kritik' :
                                issue.priority === 'high' ? 'Yüksek' :
                                    issue.priority === 'medium' ? 'Orta' :
                                        issue.priority === 'low' ? 'Düşük' : issue.priority}
                        </span>
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium mb-2">
                        {issue.description}
                    </p>
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <div className="flex items-center space-x-4">
                            <span>URL: {issue.url}</span>
                            {issue.contact_email && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center">
                                        <UserIcon size={14} className="mr-1" />
                                        {issue.contact_email}
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                                <CalendarIcon size={14} className="mr-1" />
                                {new Date(issue.created_at).toLocaleString('tr-TR')}
                            </span>
                            {issue.viewport && (
                                <>
                                    <span>•</span>
                                    <span>Viewport: {issue.viewport}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.location.href = `/sites/${siteId}/issues/${issue.id}`}
                    >
                        <EyeIcon size={14} className="mr-1" />
                        Detayları Görüntüle
                    </Button>
                </div>
            </div>
        </div>
    )
}
