import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const calculatorInputSchema = z.object({
  registrationType: z.enum(['本市学籍', '外地学籍']),
  householdType: z.enum(['本市户籍', '非本市户籍']),
  continuousYears: z.number().min(0).max(12),
  hasPropertyInDistrict: z.boolean().optional(),
  socialInsuranceYears: z.number().min(0).max(20).optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = calculatorInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: '输入参数不正确', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      registrationType,
      householdType,
      continuousYears,
      hasPropertyInDistrict,
      socialInsuranceYears,
    } = parsed.data;

    const eligibility: {
      eligible: boolean;
      level: 'highly_likely' | 'possible' | 'unlikely' | 'not_eligible';
      reason: string;
      suggestions: string[];
    } = {
      eligible: false,
      level: 'not_eligible',
      reason: '',
      suggestions: [],
    };

    if (registrationType === '外地学籍') {
      eligibility.reason = '名额到校资格通常要求本市初中学籍。';
      eligibility.suggestions = ['确认是否可转入本市初中就读。', '关注随迁子女中考政策。'];
      return NextResponse.json({ result: eligibility });
    }

    if (householdType === '非本市户籍' && continuousYears < 3) {
      eligibility.level = 'unlikely';
      eligibility.reason =
        '非本市户籍学生通常需要连续三年在本市初中就读，并满足居住证积分或房产等要求。';
      eligibility.suggestions = ['确认父母一方居住证积分是否达标。', '核实社保连续缴纳年限。'];
      return NextResponse.json({ result: eligibility });
    }

    if (householdType === '非本市户籍' && continuousYears >= 3) {
      const hasResidence = hasPropertyInDistrict || (socialInsuranceYears ?? 0) >= 3;
      if (hasResidence) {
        eligibility.eligible = true;
        eligibility.level = 'possible';
        eligibility.reason =
          '满足连续三年本市就读，且具备居住证积分/房产/社保等条件，可申请名额到校。';
        eligibility.suggestions = ['向学校确认名额到校志愿填报流程。', '关注当年中考政策微调。'];
      } else {
        eligibility.level = 'unlikely';
        eligibility.reason =
          '连续三年就读但缺少居住证积分或房产等辅助条件，名额到校资格存在不确定性。';
        eligibility.suggestions = ['尽快办理居住证积分或确认房产所属学区。', '咨询所在区教育局。'];
      }
      return NextResponse.json({ result: eligibility });
    }

    if (householdType === '本市户籍') {
      if (continuousYears >= 3) {
        eligibility.eligible = true;
        eligibility.level = 'highly_likely';
        eligibility.reason = '本市户籍且连续三年在本市初中就读，具备名额到校资格。';
        eligibility.suggestions = [
          '关注一模、二模成绩对名额到校录取的影响。',
          '合理填报志愿，区分名额分配到区与到校。',
        ];
      } else if (continuousYears >= 1) {
        eligibility.eligible = true;
        eligibility.level = 'possible';
        eligibility.reason =
          '本市户籍但在本市初中就读未满三年，可能按学籍所在区政策认定，具体以当年政策为准。';
        eligibility.suggestions = [
          '向学校教务处确认连续就读年限认定标准。',
          '关注中考报名资格审核通知。',
        ];
      } else {
        eligibility.level = 'unlikely';
        eligibility.reason = '本市户籍但就读年限不足，需确认是否按户籍地或特殊政策申请。';
        eligibility.suggestions = ['咨询户籍所在区招考机构。'];
      }
      return NextResponse.json({ result: eligibility });
    }

    eligibility.reason = '输入条件无法判断，请补充信息。';
    return NextResponse.json({ result: eligibility });
  } catch (err: unknown) {
    console.error('[toolbox admission-calculator POST]', err);
    const message = err instanceof Error ? err.message : '计算失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
