import { useEffect, useState } from "react";

export function UserCount({ formId }: { formId: number }) {
    const [userCount, setUserCount] = useState<number | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem("selectedUsersByForm");
        if (raw) {
            const data = JSON.parse(raw);
            const users = data[formId] || [];
            setUserCount(users.length);
        } else {
            setUserCount(0);
        }
    }, [formId]);

    if (userCount === null) return null;

    return (
        <span className="text-sm">
      {userCount > 0 ? `${userCount} نفر در لیست` : "کسی در لیست نیست"}
    </span>
    );
}