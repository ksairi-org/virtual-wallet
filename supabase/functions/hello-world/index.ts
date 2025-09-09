// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
console.log("Hello from Functions!");
Deno.serve(async (req)=>{
  const { name } = await req.json();
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const data = {
    message: `Hello ${supabaseUrl} ${name}!!!!###`
  };
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json"
    }
  });
});
