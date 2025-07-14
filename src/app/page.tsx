"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import styles from "./page.module.css";

function generateRoomId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const roomId = generateRoomId();
    router.replace(`/${roomId}`);
  }, [router]);

  return null;
}
