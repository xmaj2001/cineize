// app/components/InfiniteList.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export default function InfiniteList() {
  const [items, setItems] = useState<string[]>([]);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carrega items iniciais
    setItems(Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          alert('🚨 Chegou ao fim! Carregando mais...');
          // Aqui vai chamar a server action depois
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item} className="p-4 bg-gray-200 rounded">
          {item}
        </div>
      ))}
      {/* Esse div é o "trigger" - quando fica visível, carrega mais */}
      <div ref={observerTarget} className="p-4 text-center text-gray-500">
        A carregar mais...
      </div>
    </div>
  );
}