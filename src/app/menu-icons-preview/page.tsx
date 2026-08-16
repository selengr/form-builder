'use client';

import Image from 'next/image';

type IconOption = {
  file: string;
  label: string;
};

type PreviewGroup = {
  title: string;
  langId?: string;
  note?: string;
  options: IconOption[];
};

const PREVIEW_GROUPS: PreviewGroup[] = [
  {
    title: 'مدیریت',
    langId: 'acl.psya.management.master',
    options: [
      { file: 'ic_management.svg', label: 'اصلی — تنظیمات' },
      { file: 'ic_management-alt.svg', label: 'پیشنهاد — دسته‌ها / ماژول‌ها' },
    ],
  },
  {
    title: 'بسته‌های ارزیابی',
    langId: 'acl.psya.packaging.master',
    note: 'بازنویسی شده',
    options: [
      { file: 'ic_packaging.svg', label: 'اصلی — جعبه بسته' },
      { file: 'ic_packaging-alt.svg', label: 'پیشنهاد — جعبه + نمودار ارزیابی' },
    ],
  },
  {
    title: 'نظرسنجی',
    langId: 'acl.psya.survey.master',
    options: [
      { file: 'ic_survey.svg', label: 'اصلی — چک‌لیست' },
      { file: 'ic_survey-alt.svg', label: 'پیشنهاد — فرم سوالات' },
    ],
  },
  {
    title: 'جمع‌آوری داده',
    langId: 'acl.psya.admin.data-collection.master',
    options: [
      { file: 'ic_data-collection.svg', label: 'اصلی — دریافت داده' },
      { file: 'ic_data-collection-alt.svg', label: 'پیشنهاد — پایگاه داده' },
    ],
  },
  {
    title: 'گزارشات کاربری',
    langId: 'acl.psya.userreports.master',
    note: 'بازنویسی شده',
    options: [
      { file: 'ic_user-reports.svg', label: 'اصلی — سند + کاربر + نمودار' },
      { file: 'ic_user-reports-alt.svg', label: 'پیشنهاد — سند متنی ساده' },
    ],
  },
  {
    title: 'رسیدگی به درخواست‌های آنلاین‌سازی آزمون',
    langId: 'acl.psya.admin.packagingRequest.master',
    options: [
      { file: 'ic_admin-packaging-request.svg', label: 'اصلی — بررسی و تأیید' },
      { file: 'ic_admin-packaging-request-alt.svg', label: 'پیشنهاد — چک‌لیست رسیدگی' },
    ],
  },
  {
    title: 'فرم‌های پرکاربرد',
    options: [
      { file: 'ic_frequent-forms.svg', label: 'اصلی — فرم لایه‌ای + تأیید' },
      { file: 'ic_frequent-forms-alt.svg', label: 'پیشنهاد — فرم + ستاره پرکاربرد' },
    ],
  },
  {
    title: 'توسعه آزمون شما',
    note: 'بازنویسی شده',
    options: [
      { file: 'ic_develop-assessment.svg', label: 'اصلی — سند + قلم ویرایش' },
      { file: 'ic_develop-assessment-alt.svg', label: 'پیشنهاد — ساخت / افزودن آزمون' },
    ],
  },
];

function IconThumb({ file, alt }: { file: string; alt: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F7F9FC]">
      <Image
        src={`/api/images?folder=menu&file=${file}`}
        alt={alt}
        width={32}
        height={32}
        unoptimized
      />
    </div>
  );
}

export default function MenuIconsPreviewPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-8 sm:px-8" dir="rtl">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-xl font-bold text-[#1F2937] sm:text-2xl">
          پیش‌نمایش آیکون‌های منو (فقط تست)
        </h1>
        <p className="mb-8 text-sm text-[#697077]">
          هنوز به منوی اصلی وصل نشده‌اند. برای هر منو گزینهٔ اصلی و در صورت وجود پیشنهاد جایگزین
          زیر آن آمده تا بتوانید نهایی را انتخاب کنید.
        </p>

        <div className="flex flex-col gap-4">
          {PREVIEW_GROUPS.map((group) => (
            <section
              key={group.title}
              className="rounded-xl border border-[#DDE1E6] bg-white p-4"
            >
              <div className="mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[15px] font-bold text-[#1F2937]">{group.title}</h2>
                  {group.note ? (
                    <span className="rounded-md bg-[#E8F8F5] px-2 py-0.5 text-[11px] font-medium text-[#0F766E]">
                      {group.note}
                    </span>
                  ) : null}
                </div>
                {group.langId ? (
                  <p className="mt-0.5 text-[11px] text-[#A2A9B0]">{group.langId}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                {group.options.map((option) => (
                  <div
                    key={option.file}
                    className="flex items-center gap-3 rounded-lg border border-[#EEF0F3] px-3 py-2"
                  >
                    <IconThumb file={option.file} alt={group.title} />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-[#1F2937]">
                        {option.label}
                      </p>
                      <p className="truncate text-[11px] text-[#697077]">{option.file}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
