import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  GithubIcon, 
  GitBranchIcon, 
  TrendingUpIcon, 
  UsersIcon, 
  ServerIcon, 
  PlusIcon,
  ExternalLinkIcon,
  EyeIcon,
  ActivityIcon,
  CalendarIcon,
  ClockIcon,
  MenuIcon,
  GlobeIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimpleBarChart, SimpleLineChart } from "@/components/ui/chart";

export default async function Home() {
  // Auth kontrolü
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="">
      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm lg:text-base">
              Hoş geldiniz, {(session.user as any)?.username || session.user?.name}! Projelerinizi yönetin ve performansınızı izleyin
            </p>
          </div>
          <Button className="flex items-center space-x-2 w-full sm:w-auto">
            <PlusIcon size={16} />
            <span>Yeni Proje</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Projeler</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <ServerIcon size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUpIcon size={16} className="text-green-500 mr-1" />
              <span className="text-green-500">12% artış</span>
              <span className="text-gray-500 ml-1">bu ay</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bu Ay Deployments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <GitBranchIcon size={20} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUpIcon size={16} className="text-green-500 mr-1" />
              <span className="text-green-500">8% artış</span>
              <span className="text-gray-500 ml-1">geçen aya göre</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Ziyaretçiler</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12.5K</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                <EyeIcon size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUpIcon size={16} className="text-green-500 mr-1" />
              <span className="text-green-500">23% artış</span>
              <span className="text-gray-500 ml-1">bu hafta</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <ActivityIcon size={20} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-green-500">✓ Son 30 gün</span>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Son Projeler</h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { name: "opmo-dashboard", status: "Yayında", lastDeploy: "2 saat önce", url: "opmo-dashboard.vercel.app" },
                { name: "portfolio-site", status: "Yayında", lastDeploy: "1 gün önce", url: "portfolio.vercel.app" },
                { name: "blog-platform", status: "Geliştiriliyor", lastDeploy: "3 gün önce", url: "blog-platform.vercel.app" },
                { name: "e-commerce", status: "Yayında", lastDeploy: "1 hafta önce", url: "e-commerce.vercel.app" }
              ].map((project, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{project.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{project.url}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      project.status === 'Yayında' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {project.status}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{project.lastDeploy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Son Aktiviteler</h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { action: "Deploy başarılı", project: "opmo-dashboard", time: "2 saat önce", type: "success" },
                { action: "Build başlatıldı", project: "portfolio-site", time: "4 saat önce", type: "info" },
                { action: "Domain eklendi", project: "blog-platform", time: "1 gün önce", type: "success" },
                { action: "Environment variable güncellendi", project: "e-commerce", time: "2 gün önce", type: "info" },
                { action: "Team member eklendi", project: "opmo-dashboard", time: "3 gün önce", type: "info" }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{activity.project} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Haftalık Traffic</h2>
            <SimpleLineChart 
              data={[
                { name: "Paz", value: 1200 },
                { name: "Pzt", value: 1900 },
                { name: "Sal", value: 1600 },
                { name: "Çar", value: 2200 },
                { name: "Per", value: 2800 },
                { name: "Cum", value: 2400 },
                { name: "Cmt", value: 1800 }
              ]}
            />
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Bu hafta toplam</span>
              <span className="font-semibold text-gray-900 dark:text-white">14.0K ziyaretçi</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">En Popüler Projeler</h2>
            <SimpleBarChart 
              data={[
                { name: "dashboard", value: 45 },
                { name: "portfolio", value: 38 },
                { name: "blog", value: 29 },
                { name: "shop", value: 22 },
                { name: "docs", value: 15 }
              ]}
            />
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Son 7 gündeki ziyaretçi yüzdeleri
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Performans Metrikleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">98ms</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ortalama Yanıt Süresi</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">↓ 15ms bu ay</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">99.98%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Uptime</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Son 30 gün</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">2.1GB</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Bandwidth Kullanımı</div>
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Bu ay</div>
            </div>
          </div>
        </div>

        {/* Recent Deployments */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Son Deployments</h2>
              <Button variant="outline" size="sm">Tümünü Gör</Button>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[
              { 
                project: "opmo-dashboard", 
                commit: "feat: dashboard analytics added", 
                branch: "main", 
                status: "success", 
                time: "2 saat önce",
                duration: "1m 23s",
                hash: "a3f7b2c"
              },
              { 
                project: "portfolio-site", 
                commit: "fix: responsive navbar issue", 
                branch: "main", 
                status: "success", 
                time: "4 saat önce",
                duration: "45s",
                hash: "b8e2d4f"
              },
              { 
                project: "blog-platform", 
                commit: "update: new blog post template", 
                branch: "develop", 
                status: "building", 
                time: "6 saat önce",
                duration: "2m 10s",
                hash: "c9f3e5a"
              },
              { 
                project: "e-commerce", 
                commit: "refactor: payment processing", 
                branch: "feature/payments", 
                status: "failed", 
                time: "1 gün önce",
                duration: "1m 45s",
                hash: "d4a6b8c"
              }
            ].map((deployment, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      deployment.status === 'success' ? 'bg-green-500' :
                      deployment.status === 'building' ? 'bg-yellow-500' :
                      deployment.status === 'failed' ? 'bg-red-500' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">{deployment.project}</span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                          {deployment.branch}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{deployment.commit}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>#{deployment.hash}</span>
                        <span>•</span>
                        <span>{deployment.duration}</span>
                        <span>•</span>
                        <span>{deployment.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      deployment.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      deployment.status === 'building' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      deployment.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {deployment.status === 'success' ? 'Başarılı' :
                       deployment.status === 'building' ? 'Build Ediliyor' :
                       deployment.status === 'failed' ? 'Başarısız' : 'Bekliyor'}
                    </span>
                    <ExternalLinkIcon size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
              <GithubIcon size={16} />
              <span>Git Repository'yi Bağla</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
              <ExternalLinkIcon size={16} />
              <span>Domain Ekle</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
              <UsersIcon size={16} />
              <span>Takım Üyesi Davet Et</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
