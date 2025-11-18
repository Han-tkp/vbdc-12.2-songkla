// src/pages/api/messages.js
import { createClient } from '@supabase/supabase-js';

// สร้าง Client โดยดึงค่าจาก Environment Variables
// (เดี๋ยวเราจะไปตั้งค่านี้ใน Vercel ตอน Deploy)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// นี่คือ Serverless Function
export async function handler(req) {
  
  // ------------------------------------
  // จัดการ POST (ส่งข้อความใหม่)
  // ------------------------------------
  if (req.method === 'POST') {
    try {
      const { name, message } = JSON.parse(req.body);

      // ตรวจสอบข้อมูลเบื้องต้น
      if (!name || !message) {
        return new Response(JSON.stringify({ error: 'Name and message are required.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // ส่งข้อมูลไป Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert([{ name: name, message_text: message }])
        .select();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // ------------------------------------
  // จัดการ GET (ดึงข้อความทั้งหมด)
  // ------------------------------------
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*') // ดึงทุกคอลัมน์
        .order('created_at', { ascending: false }); // เรียงจากใหม่ไปเก่า

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // ถ้าเป็น Method อื่นที่ไม่ใช่ GET หรือ POST
  return new Response('Method Not Allowed', { status: 405 });
}