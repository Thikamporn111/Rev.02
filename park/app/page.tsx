import Link from "next/link";
import HomeProducts from "./components/HomeProducts";

const categories = [
  { name: "ESP32 Series", subtitle: "บอร์ด IoT", color: "bg-sky-500/15 text-sky-300" },
  { name: "ESP8266 Series", subtitle: "บอร์ด Wi-Fi", color: "bg-emerald-500/15 text-emerald-300" },
  { name: "Sensors", subtitle: "วัดอุณหภูมิ ความชื้น", color: "bg-violet-500/15 text-violet-300" },
  { name: "Accessories", subtitle: "อุปกรณ์เสริม", color: "bg-orange-500/15 text-orange-300" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400/80">MicroDev Store</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">ร้านอุปกรณ์ IoT สำหรับมือถือและเดสก์ท็อป</h1>
          </div>

        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-28 sm:px-6">
        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="rounded-[2rem] bg-slate-900/90 p-6 shadow-2xl ring-1 ring-white/10 sm:p-10">
            <span className="inline-flex rounded-full bg-sky-500/20 px-3 py-1 text-sm font-semibold text-sky-300">
              NEW GENERATION
            </span>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              ESP32-S3 Dual-Core SoC สำหรับทุกโปรเจกต์ IoT
            </h2>
            <p className="mt-5 max-w-2xl text-slate-300 sm:text-lg">
              สินค้าคุณภาพสูงที่ออกแบบมาเพื่อใช้งานได้ทั้งบนมือถือและเดสก์ท็อป พร้อมแสดงผลสวยงามและใช้งานสะดวกบนทุกขนาดหน้าจอ.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#products"
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
              >
                ดูสินค้าทั้งหมด
              </a>
              <a
                href="#categories"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/70 px-6 py-3 text-base text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
              >
                หมวดสินค้า
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">ไวต่อมือถือ</p>
              <h3 className="mt-4 text-2xl font-semibold">ออกแบบให้สวยทั้งมือถือ</h3>
              <p className="mt-3 text-slate-400">
                หน้าเว็บตอบสนองได้ดีบนหน้าจอขนาดเล็กด้วยการจัดเรียงแบบคอลัมน์และปุ่มขนาดใหญ่.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">ดีทั้งเดสก์ท็อป</p>
              <h3 className="mt-4 text-2xl font-semibold">ใช้งานง่ายบนคอมพิวเตอร์</h3>
              <p className="mt-3 text-slate-400">
                แสดงข้อมูลชัดเจนด้วยกริดสินค้าที่ปรับขนาดได้ และเมนูนำทางที่จัดวางอย่างเหมาะสม.
              </p>
            </div>
          </div>
        </section>

        <section id="categories" className="mt-12 rounded-[2rem] bg-slate-900/80 p-6 shadow-2xl ring-1 ring-white/5 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">หมวดหมู่สินค้า</h2>
              <p className="mt-1 text-sm text-slate-400">เลือกอุปกรณ์ให้ตรงกับงานของคุณได้ทันที</p>
            </div>
            <p className="text-sm text-slate-400">แสดงผลลำดับจากมือถือไปเดสก์ท็อป</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className={`rounded-3xl border border-slate-800 px-5 py-6 ${category.color}`}
              >
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{category.subtitle}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="products" className="mt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">สินค้าแนะนำ</p>
              <h2 className="mt-2 text-2xl font-semibold">สินค้าขายดี</h2>
            </div>
          </div>

          <HomeProducts />
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-slate-200">
          <Link href="#" className="flex flex-col items-center gap-1 text-xs text-slate-300 hover:text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800">🏠</span>
            หน้าแรก
          </Link>
          <Link href="#categories" className="flex flex-col items-center gap-1 text-xs text-slate-300 hover:text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800">📦</span>
            หมวดสินค้า
          </Link>
          <Link href="#products" className="flex flex-col items-center gap-1 text-xs text-slate-300 hover:text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800">🛒</span>
            สินค้า
          </Link>
        </div>
      </nav>
    </div>
  );
}
