import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '用户协议 - 趣学伴',
  description: '趣学伴用户协议，约定您使用本服务时的权利与义务。',
};

const sections = [
  {
    title: '1. 服务说明',
    content:
      '趣学伴是一款面向上海家长的升学规划与执行管理工具，提供路线规划、任务拆解、进度追踪、周计划管理及 AI 诊断等功能。本协议是您与本服务之间关于使用相关产品与服务的法律协议。',
  },
  {
    title: '2. 账号注册与安全',
    content:
      '您需要注册账号并使用用户名、密码登录。您应对账号和密码的安全负责，不得将账号转让、出借或共享给他人。因您保管不善导致的损失，由您自行承担。',
  },
  {
    title: '3. 用户行为规范',
    content:
      '您承诺在使用本服务时遵守法律法规，不得上传、发布违法、侵权、虚假或骚扰性内容，不得利用本服务从事任何危害网络安全或损害他人合法权益的行为。',
  },
  {
    title: '4. 内容所有权',
    content:
      '您在本服务中创建的升学计划、任务记录等内容归您所有。您授予本服务为提供、维护和改进产品所需的有限使用权。本服务中的软件、界面、文案、商标等知识产权归我们或相关权利人所有。',
  },
  {
    title: '5. 服务变更与中断',
    content:
      '我们可能根据运营需要调整、升级或暂停部分服务，并会尽力提前通知。因系统维护、网络故障、不可抗力等原因导致的服务中断，我们不承担责任，但会尽力恢复服务。',
  },
  {
    title: '6. 免责声明',
    content:
      '本服务提供的升学政策解读、路线建议、AI 诊断等内容仅供参考，不构成教育、法律或投资等专业建议。最终决策由您自行判断并承担责任。我们不对因使用或无法使用本服务造成的直接、间接损失承担责任，除非法律另有规定。',
  },
  {
    title: '7. 协议终止',
    content:
      '如您违反本协议，我们有权暂停或终止向您提供服务。您也可以随时停止使用并申请注销账号。协议终止后，相关权利义务仍继续有效的条款继续适用。',
  },
  {
    title: '8. 法律适用与争议解决',
    content:
      '本协议适用中华人民共和国法律。因本协议引起的或与本协议有关的任何争议，双方应友好协商解决；协商不成的，任何一方均可向本服务运营方所在地有管辖权的人民法院提起诉讼。',
  },
  {
    title: '9. 协议更新',
    content:
      '我们可能根据产品变化或法律法规要求适时更新本用户协议。更新后会在本页面发布，重大变更将通过公告或站内通知告知您。',
  },
  {
    title: '10. 联系我们',
    content:
      '如您对本用户协议有任何疑问，请通过产品内反馈渠道或官方联系方式与我们联系。',
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="mb-4 text-3xl font-bold font-display">用户协议</h1>
        <p className="mb-12 text-sm text-text-muted">更新日期：2026 年 7 月 27 日</p>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-2 text-lg font-semibold text-text-primary">
                {section.title}
              </h2>
              <p className="leading-relaxed text-text-secondary">{section.content}</p>
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
