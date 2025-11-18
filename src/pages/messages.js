// src/pages/api/messages.js
import { createClient } from '@supabase/supabase-js';

// สร้าง Client
const supabase = createClient(
  import.meta.env.SUPABASE_URL, // Astro ใช้ import.meta.env
  import.meta.env.SUPABASE_SERVICE_KEY
);

// 1. Export GET สำหรับดึงข้อมูล
export async function GET(context) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

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

// 2. Export POST สำหรับส่งข้อมูล
export async function POST(context) {
  try {
    // Astro รับ JSON แบบนี้
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