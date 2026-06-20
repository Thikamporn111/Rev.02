'use client';

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type Product = {
  id?: string;
  name: string;
  price: string;
  description: string;
  tag: string;
};

const defaultProducts: Product[] = [
  {
    name: "ESP32-WROOM-32D",
    price: "฿245.00",
    description: "บอร์ด ESP32 พร้อม Wi-Fi และ Bluetooth สำหรับงาน IoT ทุกประเภท",
    tag: "Developer Edition",
  },
  {
    name: "NodeMCU ESP8266 V3",
    price: "฿120.00",
    description: "บอร์ด ESP8266 พร้อมชิป CH340G ใช้งานง่ายสำหรับโปรเจกต์ Wi-Fi",
    tag: "Popular",
  },
  {
    name: "DHT22 Sensor Module",
    price: "฿240.00",
    description: "เซ็นเซอร์วัดอุณหภูมิและความชื้นความแม่นยำสูง",
    tag: "Sensors",
  },
  {
    name: "0.96 inch OLED Display",
    price: "฿95.00",
    description: "จอ OLED ขนาดเล็กสำหรับแสดงผลบนบอร์ด Microcontroller",
    tag: "Display",
  },
  {
    name: "5V Relay Module",
    price: "฿35.00",
    description: "รีเลย์ 1 ช่องสำหรับควบคุมอุปกรณ์ไฟฟ้า",
    tag: "Power",
  },
  {
    name: "CP2102 USB to TTL",
    price: "฿115.00",
    description: "ตัวแปลง USB เป็น TTL สำหรับเขียนโปรแกรมบอร์ด MCU",
    tag: "Tool",
  },
];

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({
    name: "",
    price: "",
    description: "",
    tag: "Popular",
  });
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authLoaded || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const productsCollection = collection(db, "products");
    const productsQuery = query(productsCollection, orderBy("name"));

    const unsubscribe = onSnapshot(
      productsQuery,
      (snapshot) => {
        const loaded = snapshot.docs.map((document) => ({
          id: document.id,
          ...(document.data() as Omit<Product, "id">),
        }));
        setProducts(loaded);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore snapshot error:", error);
        setStatus(`ไม่สามารถโหลดข้อมูลสินค้าจาก Firestore ได้: ${(error as Error).message}`);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authLoaded, user]);

  const handleInput = (field: keyof Product, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const addProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.price.trim() || !form.description.trim()) {
      setStatus("กรุณากรอกชื่อ ราคา และคำอธิบายสินค้าด้วย");
      return;
    }

    if (!user) {
      setStatus("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้า");
      return;
    }

    if (products.some((item) => item.name === form.name.trim())) {
      setStatus("มีสินค้าชื่อเดียวกันอยู่แล้ว กรุณาใช้ชื่อสินค้าใหม่");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        name: form.name.trim(),
        price: form.price.trim(),
        description: form.description.trim(),
        tag: form.tag.trim() || "Popular",
      });
      setForm({ name: "", price: "", description: "", tag: "Popular" });
      setStatus("เพิ่มสินค้าสำเร็จแล้ว");
    } catch (error) {
      console.error("Firestore addDoc error:", error);
      setStatus(`เกิดข้อผิดพลาดขณะเพิ่มสินค้า: ${(error as Error).message}`);
    }
  };

  const removeProduct = async (productId?: string, name?: string) => {
    if (!user) {
      setStatus("กรุณาเข้าสู่ระบบก่อนลบสินค้า");
      return;
    }

    if (!productId) {
      setStatus("ไม่พบรหัสสินค้า");
      return;
    }

    try {
      await deleteDoc(doc(db, "products", productId));
      setStatus(`ลบสินค้า "${name ?? "รายการนี้"}" เรียบร้อยแล้ว`);
    } catch (error) {
      console.error("Firestore deleteDoc error:", error);
      setStatus(`เกิดข้อผิดพลาดขณะลบสินค้า: ${(error as Error).message}`);
    }
  };

  const resetProducts = async () => {
    if (!user) {
      setStatus("กรุณาเข้าสู่ระบบก่อนรีเซ็ตสินค้า");
      return;
    }
    setStatus("กำลังรีเซ็ตข้อมูลสินค้า...");
    try {
      const productsCollection = collection(db, "products");
      const existing = await getDocs(productsCollection);
      const batch = writeBatch(db);

      existing.forEach((document) => {
        batch.delete(document.ref);
      });

      defaultProducts.forEach((product) => {
        const newDoc = doc(productsCollection);
        batch.set(newDoc, {
          name: product.name,
          price: product.price,
          description: product.description,
          tag: product.tag,
        });
      });

      await batch.commit();
      setStatus("รีเซ็ตสินค้ากลับเป็นค่าเริ่มต้นเรียบร้อยแล้ว");
    } catch (error) {
      console.error("Firestore reset error:", error);
      setStatus("เกิดข้อผิดพลาดขณะรีเซ็ตสินค้า กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400/80">Admin Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">จัดการสินค้าหน้าหลัก</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              เพิ่ม ลบ และรีเซ็ตข้อมูลสินค้าได้ด้วยตัวเอง ผ่านแดชบอร์ดนี้. ข้อมูลจะถูกเก็บไว้ใน Firestore.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 px-5 py-3 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-900">
              กลับหน้าหลัก
            </Link>
            <button
              type="button"
              onClick={resetProducts}
              disabled={!user}
              className="inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              รีเซ็ตสินค้า
            </button>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">รายการสินค้าที่มี</h2>
                <p className="mt-1 text-sm text-slate-400">ลบสินค้าชิ้นใดก็ได้จากหน้าหลัก</p>
              </div>
              <span className="rounded-full bg-slate-800/80 px-4 py-2 text-sm text-slate-300">รวม {products.length} รายการ</span>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 text-center text-slate-400">
                กำลังโหลดข้อมูลจาก Firestore...
              </div>
            ) : !user ? (
              <div className="rounded-3xl border border-amber-500/30 bg-amber-950/20 p-8 text-center text-amber-200">
                กรุณา <Link href="/login" className="font-semibold text-white underline">
                  เข้าสู่ระบบด้วย Google
                </Link> เพื่อดูและจัดการสินค้าของคุณ
              </div>
            ) : (
              <div className="space-y-4">
                {products.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-center text-slate-400">
                    ยังไม่มีสินค้าปัจจุบัน
                  </div>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 transition hover:border-slate-600">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                          <p className="mt-1 text-sm text-slate-400">{product.description}</p>
                          <p className="mt-3 text-sm text-slate-300">
                            แท็ก: <span className="font-medium text-slate-100">{product.tag}</span>
                          </p>
                        </div>
                        <div className="flex flex-col items-start gap-3 sm:items-end">
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">{product.price}</span>
                          <button
                            type="button"
                            onClick={() => removeProduct(product.id, product.name)}
                            disabled={!user}
                            className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">เพิ่มสินค้าใหม่</h2>
                <p className="mt-2 text-sm text-slate-400">กรอกข้อมูลสินค้าเพื่อแสดงบนหน้าหลัก</p>
              </div>
              {!user ? (
                <div className="rounded-3xl bg-yellow-950/80 px-4 py-3 text-sm text-amber-300 ring-1 ring-amber-500/30">
                  กรุณา <Link href="/login" className="font-semibold text-white underline">ล็อกอินด้วย Google</Link> ก่อนใช้งาน
                </div>
              ) : null}
            </div>

            <form onSubmit={addProduct} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200">ชื่อสินค้า</label>
                <input
                  value={form.name}
                  onChange={(event) => handleInput("name", event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
                  placeholder="เช่น ESP32-S3 Mini"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">แท็กสินค้า</label>
                <input
                  value={form.tag}
                  onChange={(event) => handleInput("tag", event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
                  placeholder="เช่น Popular, Sensors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">ราคา</label>
                <input
                  value={form.price}
                  onChange={(event) => handleInput("price", event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
                  placeholder="เช่น ฿150.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">คำอธิบาย</label>
                <textarea
                  value={form.description}
                  onChange={(event) => handleInput("description", event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
                  rows={4}
                  placeholder="คำอธิบายสินค้า"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={!user}
                  className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  เพิ่มสินค้าใหม่
                </button>
                {status ? <p className="text-sm text-slate-300">{status}</p> : null}
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
