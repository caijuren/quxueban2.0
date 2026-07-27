import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '隐私协议 - 趣学伴',
  description: '趣学伴隐私协议，说明我们如何收集、使用和保护您的个人信息。',
};

const sections = [
  {
    title: '1. 适用范围',
    content:
      '本隐私协议适用于趣学伴（以下简称“本服务”）通过网站、小程序及相关服务收集、使用、存储和保护用户信息的行为。使用本服务即表示您同意本协议内容。',
  },
  {
    title: '2. 我们收集的信息',
    content:
      '为提供服务，我们可能会收集以下信息：账号信息（用户名、密码哈希）、家长及孩子基础信息（昵称、年级、目标学校等）、您创建的升学路线与计划、周任务与打卡记录、操作日志及设备信息。我们不会主动收集与升学规划无关的敏感个人信息。',
  },
  {
    title: '3. 信息的使用',
    content:
      '我们使用收集的信息用于：为您提供升学规划、任务拆解、进度追踪与 AI 检视服务；向您发送任务提醒、系统通知及重要更新；改进产品体验与服务质量；保障账号安全与服务稳定运行。',
  },
  {
    title: '4. 信息的存储与安全',
    content:
      '您的数据存储在安全的服务器中，我们采用行业通行的加密与访问控制措施保护数据安全。密码经过不可逆哈希处理，任何人都无法直接读取您的明文密码。我们会定期备份数据，但无法承诺绝对安全，建议您妥善保管账号信息。',
  },
  {
    title: '5. 信息的共享与披露',
    content:
      '我们不会向第三方出售、出租或以其他方式非法共享您的个人信息。仅在以下情形可能披露：获得您的明确同意；应法律法规、政府机关或司法机关的要求；为保护本服务、用户或公众的合法权益所必需。',
  },
  {
    title: '6. 您的权利',
    content:
      '您有权访问、修改、删除您的个人信息，有权注销账号。您可以通过产品内的功能或联系客服行使上述权利。注销账号后，我们将依法删除或匿名化您的个人信息，法律法规另有规定的除外。',
  },
  {
    title: '7. Cookie 与类似技术',
    content:
      '为保障登录状态与使用体验，我们可能使用 Cookie 或类似技术。您可以根据浏览器设置选择禁用 Cookie，但部分功能可能因此无法正常使用。',
  },
  {
    title: '8. 未成年人保护',
    content:
      '本服务主要面向家长用户，由家长代为管理和使用。我们无意收集未成年人个人信息，相关信息由家长主动提供并管理。',
  },
  {
    title: '9. 协议更新',
    content:
      '我们可能根据产品变化或法律法规要求适时更新本隐私协议。更新后会在本页面发布，重大变更将通过公告或站内通知告知您。',
  },
  {
    title: '10. 联系我们',
    content:
      '如您对本隐私协议有任何疑问、意见或投诉，请通过产品内反馈渠道或官方联系方式与我们联系。',
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="mb-4 text-3xl font-bold font-display">隐私协议</h1>
        <p className="mb-12 text-sm text-slate-500">更新日期：2026 年 7 月 27 日</p>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-2 text-lg font-semibold text-slate-100">
                {section.title}
              </h2>
              <p className="leading-relaxed text-slate-400">{section.content}</p>
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
