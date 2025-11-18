// src/pages/api/messages.js
import { createClient } from '@supabase/supabase-js';

// สร้าง Client
const supabase = createClient(
  process.env.SUPABASE_URL,           // <--- ❗️ แก้ไขตรงนี้
  process.env.SUPABASE_SERVICE_KEY   // <--- ❗️ และแก้ไขตรงนี้
);

// 1. Export GET สำหรับดึงข้อมูล
export async function GET(context) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error; // ถ้า Supabase error, โยนไปที่ catch

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    // ถ้าเกิด Error (เช่น ต่อ Supabase ไม่ได้)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, // ส่งสถานะ 500
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// 2. Export POST สำหรับส่งข้อมูล
export async function POST(context) {
  try {
    const { name, message } = await context.request.json();

    if (!name || !message) {
      return new Response(JSON.stringify({ error: 'Name and message are required.' }), {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([{ name: name, message_text: message }])
      .select();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 201, // 201 = Created
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}