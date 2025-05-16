'use client';

import {useRouter} from 'next/navigation';
import Button from '@mui/material/Button';
import {InfoRow} from "@/components/common/infoRow";

const formTypePersian: Record<string, string> = {
    TEST: 'آزمون',
    QUESTION: 'پرسشنامه',
    SURVEY: 'نظرسنجی',
    COMPETITION: 'مسابقه',
};

interface ListCardProps {
    data: {
        id: string;
        name: string;
        type: keyof typeof formTypePersian;
        accessType?: string;
        status?: string;
    };
}

export default function ListCard({data}: ListCardProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-3 rounded-[20px] border border-[#DDE1E6] p-4">
            <InfoRow label="نام" value={data.name} bold/>
            <InfoRow label="نوع" value={formTypePersian[data.type]} bold/>
            <InfoRow label="دسترسی" value={data.accessType || 'عمومی'} bold/>
            <InfoRow label="وضعیت" value="انجام نشده" bold/>

            <div className="flex w-full flex-row gap-2">
                <Button
                    variant="contained"
                    size="large"
                    disableElevation
                    fullWidth
                    onClick={() => router.push(`/stats/${data.id}`)}
                    sx={{
                        backgroundColor: '#1758BA',
                        borderRadius: '8px',
                        '&:hover': {backgroundColor: '#216ee1'},
                    }}
                >
                    مشاهده نتایج
                </Button>

                <Button
                    variant="contained"
                    size="large"
                    disableElevation
                    fullWidth
                    onClick={() => router.push(`/reports/create-solo/${data.id}`)}
                    sx={{
                        backgroundColor: '#2CDFC9',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#2CDFC9',
                            opacity: 0.9,
                        },
                    }}
                >
                    ساخت گزارش
                </Button>
            </div>
        </div>
    );
}
