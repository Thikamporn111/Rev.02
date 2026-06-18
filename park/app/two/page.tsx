// app/users-client/page.tsx
'use client';

import { useState } from 'react'; // ไม่จำเป็นต้องใช้ useEffect แล้ว

export default function UsersClientPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false); // เริ่มต้นเป็น false เพราะยังไม่ได้กดโหลด

    // สร้างฟังก์ชันสำหรับดึงข้อมูลเมื่อกดปุ่ม
    const handleFetchUsers = () => {
        setLoading(true); // เริ่มต้นโหลด
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setLoading(false); // โหลดเสร็จแล้ว
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setLoading(false);
            });
    };

    return (
        <main className="p-10">
            <h1 className="text-2xl font-bold mb-4 text-blue-600">รายชื่อผู้ใช้งาน (CSR - On Demand)</h1>

            {/* ปุ่มสำหรับกดโหลดข้อมูล */}
            <button
                onClick={handleFetchUsers}
                disabled={loading} // ป้องกันการกดซ้ำระหว่างโหลด
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 mb-6 transition-colors"
            >
                {loading ? 'กำลังโหลดวัตถุดิบ...' : 'ดึงข้อมูลผู้ใช้งาน'}
            </button>

            {/* แสดงข้อความเมื่อยังไม่มีข้อมูล */}
            {!loading && users.length === 0 && (
                <p className="text-gray-500">ยังไม่มีข้อมูล กรุณากดปุ่มเพื่อโหลดข้อมูล</p>
            )}

            {/* รายการผู้ใช้งาน */}
            <ul>
                {users.map((user) => (
                    <li key={user.id} className="p-2 border-b">
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
        </main>
    );
}