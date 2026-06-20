'use client';

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
  tag: string;
};

export default function HomeProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const productsCollection = collection(db, "products");
    const productsQuery = query(productsCollection, orderBy("name"));

    const unsubscribe = onSnapshot(
      productsQuery,
      (snapshot) => {
        const loaded = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Product, "id">),
        }));
        setProducts(loaded);
        setLoading(false);
      },
      (error) => {
        const message = (error as Error).message;
        setError(
          `ไม่สามารถโหลดข้อมูลสินค้าได้: ${message}. กรุณาตรวจสอบสิทธิ์ Firestore หรือเข้าสู่ระบบที่หน้า Login.`
        );
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 rounded-[2rem] border border-slate-800 bg-slate-900/85 p-8 text-center text-slate-400">
        กำลังโหลดข้อมูลสินค้า...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 rounded-[2rem] border border-red-500/40 bg-slate-900/85 p-8 text-center text-red-300">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mt-6 rounded-[2rem] border border-dashed border-slate-700 bg-slate-900/85 p-8 text-center text-slate-400">
        ยังไม่มีสินค้าจาก Firestore กรุณาเพิ่มสินค้าในหน้าผู้ดูแลระบบ
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.id}
          className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/85 p-6 shadow-xl transition hover:-translate-y-1 hover:border-slate-700"
        >
          <div className="h-44 rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-700 p-4">
            <div className="flex h-full items-end justify-between">
              <div>
                <span className="inline-flex rounded-full bg-slate-800/70 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                  {product.tag}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">ราคา</p>
                <p className="mt-2 text-xl font-semibold text-white">{product.price}</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">{product.name}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{product.description}</p>
          </div>
          <button className="mt-6 w-full rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
            เพิ่มลงตะกร้า
          </button>
        </article>
      ))}
    </div>
  );
}
